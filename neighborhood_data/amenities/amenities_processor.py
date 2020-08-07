#!/usr/bin/env python3
# encoding=utf8

""" Script for extracting amenitiy latitude,longitude
    from OSM GeoJSON file """

import json
import csv
from datetime import datetime
from geopy.geocoders import Nominatim
from amenity import Amenity

GEO_LOCATOR = Nominatim(user_agent="amenities_processor")
def process_geopy_addr(geopy_addr):
    # 8
    # '110, Union Street, Springfield Hill, Westfield, Hampden County, Massachusetts, 01085-3899, United States of America',
    # 'Taunton State Hospital, 60, Hodges Avenue, Taunton, Bristol County, Massachusetts, 02780, United States of America', 
    # 9
    # 'School of Medicine, 111, Cedar Street, Downtown, New Haven, New Haven County, Connecticut, 06519, United States of America',
    # 'Tewksbury Hospital, 365, East Street, Tewksbury Junction, Tewksbury, Middlesex County, Massachusetts, 01876-0841, United States of America',
    # 10
    # 'New England School of Law Library, 154, Stuart Street, Chinatown, Beacon Hill, Boston, Suffolk County, Massachusetts, 02111, United States of America', 
    # 'Treadwell Library, 55, Fruit Street, Charles River Square, Beacon Hill, Boston, Suffolk County, Massachusetts, 02114, United States of America',
    # [name, house number, street, area descriptor?, city, state, zip code, country]
    # sometimes name is not present
    split_addr = geopy_addr.split(',')
    flag = False
    zipcode = ''
    for sec in split_addr:
        sec = sec.strip(' ')
        if sec == 'Massachusetts' or sec == 'Connecticut':
            flag = True
            continue
        if flag and sec != 'United States of America':
            zipcode = sec
            break
    
    if len(zipcode) > 5:
        zipcode = zipcode[:5]
    return zipcode
    

# get ECHO definied amenity types
with open('./created_data/echo_amenity_types.json') as f:
    amenity_types = json.load(f)

# get data from OSM json data
# data tagged with 'amenity'
with open('./downloaded_data/ma_amenities_data.json') as f:
    amenity_data = json.load(f)
amenity_data = amenity_data['features']

# data tagged with 'leisure'
with open('./downloaded_data/ma_leisure_data.json') as f:
    leisure_data = json.load(f)
leisure_data = leisure_data['features']

# data tagged with 'shop'
with open('./downloaded_data/ma_shop_data.json') as f:
    shop_data = json.load(f)
shop_data = shop_data['features']

# data extraction
amenities_data = {'amenity': amenity_data, 'leisure': leisure_data, 'shop': shop_data}
amenities = []
loc_addr_lengths = {}

total = 0
for f in amenities_data:
    total += len(amenities_data[f])
i = 0
for f in amenities_data:
    temp_data = amenities_data[f]
    for d in temp_data:
        # get amenity type and subtype
        tipo = d['properties'][f]
        sub_tipo = ''
        if not tipo in amenity_types:
            for t in amenity_types:
                if tipo in amenity_types[t]:
                    sub_tipo = tipo
                    tipo = t
                    break

        add_to_dataset = True
        # get id
        try:
            _id = int(d["id"][5:])
        except:
            add_to_dataset = False

        # get lat and long
        try:
            (longitude, latitude) = d['geometry']['coordinates']
        except:
            add_to_dataset = False
    
        # get name
        name = ''
        try:
            name = d['properties']['name']
        except:
            add_to_dataset = False

        # get address
        # addr:postcode, addr: state, addr:city, addr:street, addr:housenumber
        address = {}
        try:
            address['postcode'] = d['properties']['addr:postcode']
        except:
            # print('data point missing postcode tag, trying to find postcode with geopy...')
            try:
                location = GEO_LOCATOR.reverse(str(latitude) + ', ' + str(longitude))
                postcode = process_geopy_addr(location.address)
                if len(postcode) > 0:
                    address['postcode'] = postcode
                else:
                    add_to_dataset = False
            except:
                pass
        try:
            address['state'] = d['properties']['addr:state']
        except:
            pass
        try:
            address['city'] = d['properties']['addr:city']
        except:
            pass
        try:
            address['street'] = d['properties']['addr:street']
        except:
            pass
        try:
            address['housenumber'] = d['properties']['addr:housenumber']
        except:
            pass
        
        if  add_to_dataset:
            # get opening_hours
            hours = ''
            try:
                hours = d['properties']['opening_hours']
            except:
                pass

            # get wheelchair accesibility
            wheelchair = ''
            try:
                wheelchair = d['properties']['wheelchair']
            except:
                pass

            # get website
            website = ''
            try:
                website = d['properties']['website']
            except:
                pass

            # get description
            description = ''
            try:
                description = d['properties']['description']
            except:
                pass

            # get denomination -> religion for place_of_worship
            religion = {}
            if sub_tipo == "place_of_worship":
                try:
                    religion['denomination'] = d['properties']['denomination']
                except:
                    pass
                try:
                    religion['religion'] = d['properties']['religion']
                except:
                    pass

            # get yes / no emergency for hospital
            emergency = ''
            if sub_tipo == "hospital":
                try:
                    emergency = d['properties']['emergency']
                except:
                    pass

            # insantiating Amenity datastructure
            # properties: name, address, description, hours, website, wheelchair, religion, emergency
            properties = {"name": name, "address": address, "description": description, 
                        "hours": hours , "website": website, "wheelchair": wheelchair, 
                        "religion": religion, "emergency": emergency, "type": tipo, "subtype": sub_tipo}

            amenities.append(Amenity(_id, (longitude, latitude), properties).to_json())
        i += 1
        if i % 100 == 0:
            print(i,'/', total)

# group data by zipcode
zipcode_to_amenity = {}
for a in amenities[:]:
    zipcode = ''
    try:
        zipcode = a['properties']['address']['postcode']
    except:
        print('KeyError with amenity:', a)
    if zipcode != '':
        if zipcode in zipcode_to_amenity:
            zipcode_to_amenity[zipcode].append(a)
        else:
            zipcode_to_amenity[zipcode] = [a]


# write extracted amenity data to json file and output
final_data = {
    "title": "ECHOLocator Amenity Data Set",
    "date": str(datetime.now()),
    "data": zipcode_to_amenity
}

with open('./created_data/amenity_zipcode_dataset_fixed.json', 'w') as outfile:
    json.dump(final_data, outfile)
            

# code for getting count data
#
# amenities = {}
# for f in amenity_data:
#     amenity = f['properties']['amenity']
#     if amenity in amenities:
#         amenities[amenity] += 1
#     else:
#         amenities[amenity] = 1

# for f in leisure_data:
#     amenity = f['properties']['leisure']
#     if amenity in amenities:
#         amenities[amenity] += 1
#     else:
#         amenities[amenity] = 1

# for f in shop_data:
#     amenity = f['properties']['shop']
#     if amenity in amenities:
#         amenities[amenity] += 1
#     else:
#         amenities[amenity] = 1



# print(amenities)

# with open('./created_data/amenity_count.csv', 'w', newline='') as csvfile:
#     fieldnames = ['amenity']
#     writer = csv.writer(csvfile)
#     for a in amenities:
#         writer.writerow([a, amenities[a]])
    
    
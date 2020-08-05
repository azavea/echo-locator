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
    # [name, house number, street, area descriptor?, city, state, zip code, country]
    # sometimes name is not present
    split_addr = geopy_addr.split(',')
    # print(split_addr)
    # print(len(split_addr))
    return len(split_addr)
    

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
            try:
                location = GEO_LOCATOR.reverse(str(latitude) + ', ' + str(longitude))
                addr_len = process_geopy_addr(location.address)
                if addr_len in loc_addr_lengths:
                    loc_addr_lengths[addr_len].append(location.address)
                else:
                    loc_addr_lengths[addr_len] = [location.address]
            except:
                pass
            add_to_dataset = False
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
        
        if not add_to_dataset:
            continue
        
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
            print(loc_addr_lengths)

# group data by zipcode
zipcode_to_amenity = {}
for a in amenities[:]:
    zipcode = a['properties']['address']['postcode']
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

print(loc_addr_lengths)

# with open('./created_data/amenity_zipcode_dataset.json', 'w') as outfile:
#     json.dump(final_data, outfile)
            

# code for getting count data
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
    
    
#!/usr/bin/env python3
# encoding=utf8

""" Script for extracting amenitiy latitude,longitude
    from OSM GeoJSON file """

import json
import csv
from amenity import Amenity

# get ECHO definied amenity types
with open('./created_data/echo_amenity_types.json') as f:
    amenity_types = json.load(f)
print("amenity_types", amenity_types)

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
amenities = {}
for f in amenity_data:
    tipo = f['properties']['amenity']
    if tipo in amenity_types:


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
    
    
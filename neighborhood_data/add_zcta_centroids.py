#!/usr/bin/env python
# encoding=utf8

import csv
import sys

import fiona
from shapely.geometry import shape

NEIGHBORHOOD_FILE = 'neighborhoods.csv'
ZCTA_FILE = 'zctas/cb_2017_us_zcta510_500k.shp'

OUT_FILE = 'neighborhood_centroids.csv'

# ensure Unicode will be handled properly
reload(sys)
sys.setdefaultencoding('utf8')

places = {}
with open(NEIGHBORHOOD_FILE) as inf:
        rdr = csv.DictReader(inf)
        fieldnames = rdr.fieldnames
        for neighborhood in rdr:
            zipcode = neighborhood['zipcode'].zfill(5)
            neighborhood['zipcode'] = zipcode
            places[zipcode] = neighborhood

with fiona.open(ZCTA_FILE) as shp:
    for zcta in shp:
        zipcode = zcta['properties']['ZCTA5CE10']
        if zipcode in places:
            print('Found zipcode {zipcode}'.format(zipcode=zipcode))
            centroid = shape(zcta['geometry']).centroid
            places[zipcode]['x'] = centroid.x
            places[zipcode]['y'] = centroid.y

with open(OUT_FILE, 'w') as outf:
    fieldnames.append('x')
    fieldnames.append('y')
    wtr = csv.DictWriter(outf, fieldnames=fieldnames)
    wtr.writeheader()
    wtr.writerows(places.values())

print('All done writing centroids to {outfile}'.format(outfile=OUT_FILE))

print('\n\nmissing:')
for place in places:
    p = places[place]
    if not p.get('x') or not p.get('y'):
        print(place)

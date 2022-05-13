#!/usr/bin/env python3
# encoding=utf8

import csv
import os
import zipfile

import fiona
from fiona.crs import from_epsg
import requests
from shapely.geometry import shape

NEIGHBORHOOD_FILE = 'neighborhoods.csv'

ZCTA_BASE = 'cb_2017_us_zcta510_500k'
ZCTA_DIRECTORY = 'zctas'
ZCTA_PATH_BASE = '{dir}/{base}'.format(dir=ZCTA_DIRECTORY, base=ZCTA_BASE)
ZCTA_FILE = '{base}.shp'.format(base=ZCTA_PATH_BASE)
ZCTA_ZIPFILE = '{base}.zip'.format(base=ZCTA_PATH_BASE)
ZCTA_URL = 'http://www2.census.gov/geo/tiger/GENZ2017/shp/{base}.zip'.format(
    base=ZCTA_BASE)

OUT_FILE = 'neighborhood_centroids.csv'
OUT_ZCTA_GEOJSON = 'neighborhood_bounds.json'

if not os.path.isfile(ZCTA_FILE):
    print('Census ZCTA Shapefile not found. Downloading...')
    req = requests.get(ZCTA_URL, stream=True)
    with open(ZCTA_ZIPFILE, 'wb') as zf:
        for chunk in req.iter_content(chunk_size=128):
            zf.write(chunk)
        print('Done donwloading Census ZCTA Shapefile. Extracting...')
    with zipfile.ZipFile(ZCTA_ZIPFILE, 'r') as zipref:
        zipref.extractall(ZCTA_DIRECTORY)
        print('Zipped Census ZCTA Shapefile extracted.')
else:
    print('Census ZCTA Shapefile found locally; not downloading.')

places = {}
with open(NEIGHBORHOOD_FILE) as inf:
    rdr = csv.DictReader(inf)
    fieldnames = rdr.fieldnames
    for neighborhood in rdr:
        zipcode = neighborhood['zipcode'].zfill(5)
        neighborhood['zipcode'] = zipcode
        places[zipcode] = neighborhood
        places[zipcode]['x'] = neighborhood['lon']
        places[zipcode]['y'] = neighborhood['lat']

with fiona.open(ZCTA_FILE) as shp:
    schema = shp.schema.copy()
    crs = from_epsg(4326)
    schema['geometry'] = 'MultiPolygon'
    schema['properties']['town'] = 'str:30'
    schema['properties']['id'] = 'str:5'
    schema['properties']['ecc'] = 'int'
    with fiona.open(OUT_ZCTA_GEOJSON, 'w', driver='GeoJSON', schema=schema,
                    crs=crs) as outjson:
        for zcta in shp:
            zipcode = zcta['properties']['ZCTA5CE10']
            if zipcode in places:
                print('Found zipcode {zipcode}'.format(zipcode=zipcode))
                if places[zipcode]['x'] and places[zipcode]['y']:
                    print('Already have centroid for zip code {zipcode}'.format(zipcode=zipcode))
                else:
                    centroid = shape(zcta['geometry']).centroid
                    places[zipcode]['x'] = centroid.x
                    places[zipcode]['y'] = centroid.y
                # normalize all polygons as multi polygons for GeoJSON
                if zcta['geometry']['type'] == 'Polygon':
                    zcta['geometry']['coordinates'] = [zcta[
                        'geometry']['coordinates']]
                    zcta['geometry']['type'] = 'MultiPolygon'
                zcta['properties']['town'] = places[zipcode]['town']
                zcta['properties']['ecc'] = places[zipcode]['ecc']
                zcta['properties']['id'] = zipcode
                outjson.write(zcta)

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

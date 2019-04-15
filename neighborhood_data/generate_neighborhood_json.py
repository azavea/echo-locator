#!/usr/bin/env python
# encoding=utf8

"""
Produces a GeoJSON file of the ECC neighborhood points with associated data.

Expects `add_zcta_centroids.py` was already run to identify the points.
"""

from collections import OrderedDict
import csv
import errno
import os

import fiona
from fiona.crs import from_epsg

NEIGHBORHOOD_CSV = 'neighborhood_centroids.csv'
DESCRIPTIONS_CSV = 'neighborhood_extended_descriptions.csv'
OUTPUT_FILE = 'neighborhoods.json'

# Columns to treat as text in the input CSV; all others assumed to be floats.

"""
town,zipcode,overall_affordability_quintile,violentcrime_quintile,education_percentile_quintile,
education_percentile,zipcode_population,percentage_college_graduates,has_t_stop,near_t_station,
near_park,near_railstation
"""

# expected column names and types (fiona.FIELD_TYPES_MAP)
COLUMNS = {
    'id': 'str',
    'town': 'str',
    'zipcode': 'str',
    'overall_affordability_quintile': 'float',
    'violentcrime_quintile': 'float',
    'education_percentile_quintile': 'float',
    'education_percentile': 'float',
    'zipcode_population': 'int',
    'percentage_college_graduates': 'float',
    'has_t_stop': 'int',
    'near_t_station': 'float',
    'near_park': 'float',
    'near_railstation': 'float'
}

if not os.path.isfile(NEIGHBORHOOD_CSV):
    print('\nFirst run add_zcta_centroids.py to generate {f}.\n\n'.format(
          f=NEIGHBORHOOD_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  NEIGHBORHOOD_CSV)

if not os.path.isfile(DESCRIPTIONS_CSV):
    print('\nFirst run fetch_images.py to generate {f}.\n\n'.format(
        f=DESCRIPTIONS_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  DESCRIPTIONS_CSV)

# Read CSV of descriptions and images, keyed by zip code.
# Fields in DESCRIPTIONS_CSV:
# zip_code,town,town_website_description,town_link,wikipedia,wikipedia_link,street,school,
# town_square,open_space_or_landmark,extra
descriptions_zips = {}
with open(DESCRIPTIONS_CSV) as df:
    rdr = csv.DictReader(df)
    fieldnames = list(rdr.fieldnames)
    fieldnames.remove('zip_code')
    for row in rdr:
        zipcode = row['zip_code'].zfill(5)
        row.pop('zip_code')
        descriptions_zips[zipcode] = row

description_columns = OrderedDict((field, 'str') for field in fieldnames)
description_columns.update(COLUMNS)

with open(NEIGHBORHOOD_CSV) as inf:
        rdr = csv.DictReader(inf)

        # Copy the fields from the CSV and create a GeoJSON schema for them
        fieldnames = ['id'] + list(rdr.fieldnames)
        # Do not treat point geometry columns as properties
        fieldnames.remove('x')
        fieldnames.remove('y')

        schema = {
            'id': 'str',
            'geometry': 'Point',
            'properties': description_columns
        }

        with fiona.open(OUTPUT_FILE, 'w', driver='GeoJSON', schema=schema,
                        crs=from_epsg(4326)) as outjson:

            exported = 0
            for n in rdr:
                zipcode = str(n['zipcode'])
                if not n['x'] or not n['y']:
                    print('Skipping ECC zip missing coordinates: {z}'.format(
                        z=zipcode))
                    continue

                x = float(n['x'])
                y = float(n['y'])
                properties = OrderedDict()
                properties['id'] = zipcode
                for field in fieldnames:
                    if field == 'id':
                        val = zipcode
                    else:
                        val = n[field].strip()
                    if not val:
                        # explicitly set nulls so fiona will be satisfied
                        # with the schema definition
                        properties[field] = None
                    elif COLUMNS[field] == 'float':
                        properties[field] = float(val)
                    elif COLUMNS[field] == 'int':
                        properties[field] = int(val)
                    else:
                        properties[field] = str(val)

                description = descriptions_zips.get(zipcode)
                if not description:
                    raise ValueError(
                        'Missing description for {z}.'.format(z=zipcode))
                else:
                    # append description and image fields to the propertiess
                    for fld in description:
                        properties[fld] = str(description[fld])

                neighborhood = {
                    'id': zipcode,
                    'geometry': {
                        'type': 'Point',
                        'coordinates': (x, y)
                    },
                    'properties': properties
                }

                print('Writing ECC zip: {f}...'.format(f=zipcode))
                outjson.write(neighborhood)
                exported += 1

print('\nAll done writing {n} neighborhoods to {f}.'.format(n=exported,
                                                            f=OUTPUT_FILE))

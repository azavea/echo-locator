#!/usr/bin/env python3
# encoding=utf8

"""
Produces a GeoJSON file of the neighborhood points with associated data.

Expects `add_zcta_centroids.py` was already run to identify the points.
"""

from collections import OrderedDict
import csv
import errno
import os

import fiona
from fiona.crs import from_epsg

NEIGHBORHOOD_CSV = 'neighborhood_centroids_descriptions.csv'
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
    'town_area': 'str',
    'zipcode': 'str',
    'ecc': 'int',
    'violentcrime_quintile': 'float',
    'education_percentile_quintile': 'float',
    'education_percentile': 'float',
    'house_number_symbol': 'int',
    'lat_lon_category': 'int',
    'max_rent_0br': 'float',
    'max_rent_1br': 'float',
    'max_rent_2br': 'float',
    'max_rent_3br': 'float',
    'max_rent_4br': 'float',
    'max_rent_5br': 'float',
    'max_rent_6br': 'float',
    'school_choice': 'int',
    'total_mapc': 'float',
    'town_website_description': 'str',
    'town_link': 'str',
    'wikipedia': 'str',
    'wikipedia_link': 'str',
    'street': 'str',
    'school': 'str',
    'town_square': 'str',
    'open_space_or_landmark': 'str',
    'crime_percentile': 'float'
}

# Add column definitions for the extra image metadata columns
IMAGE_COLUMNS = ['street', 'school', 'town_square', 'open_space_or_landmark']
EXTRA_IMAGE_COLUMNS = ['_thumbnail', '_license', '_license_url', '_description', '_artist',
                       '_username']

for col in IMAGE_COLUMNS:
    for suffix in EXTRA_IMAGE_COLUMNS:
        COLUMNS[col + suffix] = 'str'

if not os.path.isfile(NEIGHBORHOOD_CSV):
    print('\nFirst run add_zcta_centroids.py to generate {f}.\n\n'.format(
          f=NEIGHBORHOOD_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  NEIGHBORHOOD_CSV)

with open(NEIGHBORHOOD_CSV) as inf:
    rdr = csv.DictReader(inf)

    # Copy the fields from the CSV and create a GeoJSON schema for them
    fieldnames = ['id'] + list(rdr.fieldnames)
    # Do not treat point geometry columns as properties
    fieldnames.remove('x')
    fieldnames.remove('y')
    fieldnames.remove('lat')
    fieldnames.remove('lon')

    schema = {
        'id': 'str',
        'geometry': 'Point',
        'properties': COLUMNS
    }

    with fiona.open(OUTPUT_FILE, 'w', driver='GeoJSON', schema=schema,
                    crs=from_epsg(4326)) as outjson:

        exported = 0
        for n in rdr:
            zipcode = str(n['zipcode'])
            if not n['x'] or not n['y']:
                print('Skipping zip missing coordinates: {z}'.format(
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
                    try:
                        properties[field] = float(val)
                    except ValueError as ex:
                        if field == 'crime_percentile':
                            properties[field] = -1  # flag for no value
                        else:
                            raise ex
                elif COLUMNS[field] == 'int':
                    properties[field] = int(val)
                else:
                    properties[field] = str(val)

            neighborhood = {
                'id': zipcode,
                'geometry': {
                    'type': 'Point',
                    'coordinates': (x, y)
                },
                'properties': properties
            }

            print('Writing zip: {f}...'.format(f=zipcode))
            outjson.write(neighborhood)
            exported += 1

print('\nAll done writing {n} neighborhoods to {f}.'.format(n=exported,
                                                            f=OUTPUT_FILE))

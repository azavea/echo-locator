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
OUTPUT_FILE = 'neighborhoods.json'

# Columns to treat as text in the input CSV; all others assumed to be floats.
TEXT_COLUMNS = ['town', 'proposedsafmrfmr','fmr_area_name','rent_value',
    'finalRentValue','Region','Region_notes','Transit','Transit_notes']

if not os.path.isfile(NEIGHBORHOOD_CSV):
    print('\nFirst run add_zcta_centroids.py to generate {f}.\n\n'.format(
          f=NEIGHBORHOOD_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  NEIGHBORHOOD_CSV)

with open(NEIGHBORHOOD_CSV) as inf:
        rdr = csv.DictReader(inf)

        # Copy the fields from the CSV and create a GeoJSON schema for them
        fieldnames = list(rdr.fieldnames)
        # Do not treat point geometry columns as properties
        fieldnames.remove('x')
        fieldnames.remove('y')
        # All neighborhoods in output are ECC, so omit the field
        fieldnames.remove('ecc_expand')
        # The zip code is the ID, so doesn't also need to be a property
        fieldnames.remove('zip_code')

        schema = {
            'geometry': 'Point',
            'properties': OrderedDict((field, 'float') if field not in
                                      TEXT_COLUMNS else (field, 'str')
                                      for field in fieldnames)
        }

        with fiona.open(OUTPUT_FILE, 'w', driver='GeoJSON', schema=schema,
                        crs=from_epsg(4326)) as outjson:

            exported = 0
            for n in rdr:
                zipcode = n['zip_code']
                if n['ecc_expand'] != '1':
                    print('Skipping non-ECC zip: {z}'.format(z=zipcode))
                    continue

                if not n['x'] or not n['y']:
                    print('Skipping ECC zip missing coordinates: {z}'.format(
                        z=zipcode))
                    continue

                x = float(n['x'])
                y = float(n['y'])
                properties = OrderedDict()
                for field in fieldnames:
                    val = n[field].strip()
                    if not val:
                        # explicitly set nulls so fiona will be satisfied
                        # with the schema definition
                        properties[field] = None
                    elif field not in TEXT_COLUMNS:
                        properties[field] = float(val)
                    else:
                        properties[field] = val

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

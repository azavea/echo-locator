#!/usr/bin/env python
# encoding=utf8

"""
Produces a GeoJSON file of the ECC neighborhood points with associated data.

Expects `add_zcta_centroids.py` was already run to identify the points.
"""

import csv
import errno
import os

ECC_NEIGHBORHOOD_CSV = 'ecc_neighborhoods.csv'
NON_ECC_NEIGHBORHOOD_CSV = 'non_ecc_max_subsidies.csv'
OUTPUT_FILE = 'neighborhoods.csv'


if not os.path.isfile(ECC_NEIGHBORHOOD_CSV):
    print('\nMissing input file {f}.\n\n'.format(f=ECC_NEIGHBORHOOD_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  ECC_NEIGHBORHOOD_CSV)

if not os.path.isfile(NON_ECC_NEIGHBORHOOD_CSV):
    print('\nMissing input file {f}.\n\n'.format(f=NON_ECC_NEIGHBORHOOD_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  NON_ECC_NEIGHBORHOOD_CSV)

# Read CSVs of neighborhoods, keyed by zip code.
ecc_zips = {}
with open(ECC_NEIGHBORHOOD_CSV) as df:
    rdr = csv.DictReader(df)
    ecc_fieldnames = list(rdr.fieldnames)
    ecc_fieldnames.remove('zipcode')
    for row in rdr:
        zipcode = row['zipcode'].zfill(5)
        row.pop('zipcode')
        ecc_zips[zipcode] = row

non_ecc_zips = {}
with open(NON_ECC_NEIGHBORHOOD_CSV) as df:
    rdr = csv.DictReader(df)
    non_ecc_fieldnames = list(rdr.fieldnames)
    non_ecc_fieldnames.remove('zipcode')
    for row in rdr:
        zipcode = row['zipcode'].zfill(5)
        row.pop('zipcode')
        non_ecc_zips[zipcode] = row

IGNORE_NON_ECC_COLUMNS = ['education_percentile_previous', 'zviolentcrimeflip']
for col in IGNORE_NON_ECC_COLUMNS:
    non_ecc_fieldnames.remove(col)

joined_fieldnames = list(set(non_ecc_fieldnames).union(set(ecc_fieldnames)))
joined_zips = non_ecc_zips.copy()

# Add the fields from the ECC CSV to the combination ECC and non-ECC
for zipcode in joined_zips:
    joined_zips[zipcode]['zipcode'] = zipcode
    for col in IGNORE_NON_ECC_COLUMNS:
        joined_zips[zipcode].pop(col)
    if zipcode in ecc_zips:
        for fld in ecc_fieldnames:
            joined_zips[zipcode]['ecc'] = 1
            joined_zips[zipcode][fld] = ecc_zips[zipcode][fld]
    else:
        is_ecc = joined_zips[zipcode]['ecc'] and (joined_zips[zipcode]['ecc'] == '1' or
                                                  joined_zips[zipcode]['ecc'] == 1)
        joined_zips[zipcode]['ecc'] = 1 if is_ecc else 0
        for fld in ecc_fieldnames:
            if fld not in joined_zips[zipcode]:
                joined_zips[zipcode][fld] = ''

joined_fieldnames.append('zipcode')
with open(OUTPUT_FILE, 'w') as outf:
    wtr = csv.DictWriter(outf, fieldnames=joined_fieldnames)
    wtr.writeheader()
    wtr.writerows(joined_zips.values())

print('\nAll done writing {n} neighborhoods to {f}.'.format(n=len(joined_zips.keys()),
                                                            f=OUTPUT_FILE))

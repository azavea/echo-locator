#!/usr/bin/env python3
# encoding=utf8

"""
Fetch image metadata and download thumbnails.
"""

import csv
import errno
import os
import requests
from time import sleep
import urllib.parse

DESCRIPTIONS_CSV = 'neighborhood_centroids.csv'
OUTPUT_FILE = 'neighborhood_centroids_descriptions.csv'
STATUS_FILE = 'image_status.csv'

STATUS_FIELDS = ['zipcode', 'source_field', 'url', 'issue']

if not os.path.isfile(DESCRIPTIONS_CSV):
    print('\nMissing neighborhood images and descriptions in {f}.\n\n'.format(
        f=DESCRIPTIONS_CSV))
    raise IOError(errno.ENOENT,
                  os.strerror(errno.ENOENT),
                  DESCRIPTIONS_CSV)

# Set the user agent to avoid 403s. See: https://meta.wikimedia.org/wiki/User-Agent_policy
USER_AGENT = 'ECHOLocatorCacheBot/1.0 (https://github.com/azavea/echo-locator; kkillebrew@azavea.com) requests/2.22'
HEADERS = {
    'User-Agent': USER_AGENT
}
IMAGE_DIRECTORY = 'images/'
IMAGE_FIELDS = ['school', 'open_space_or_landmark', 'street', 'town_square']
IMAGE_METADATA_FIELDS = [
    'thumbnail',
    'license',
    'license_url',
    'description',
    'artist',
    'username'
]

METADATA_URL = 'https://en.wikipedia.org/w/api.php'


def get_image_metadata(url, type):
    print('Get metadata for image {u} of type {t}...'.format(u=url, t=type))
    offset = url.find('File:')

    wiki_offset = url.find('wikimedia.org')
    if wiki_offset == -1:
        wiki_offset = url.find('wikipedia.org')

    if offset > -1 and wiki_offset > -1:
        filename = url[offset:]
    elif offset == -1 and wiki_offset > -1:
        # Read out end of URL path to get the file name
        offset = url.rfind('/')
        if url.lower().endswith('.jpg') or url.lower().endswith('.png'):
            # Have a Wikipedia image link, but without File: prepended.
            # Strip any translated File: prefix, then prepend File: to look up
            # from English metadata API
            endpath = url[offset + 1:]
            offset = endpath.find(':')
            if offset > -1:
                endpath = endpath[offset + 1:]
            filename = 'File:' + endpath
        else:
            print('Wikipedia article link: {u}'.format(u=url))
            return {'error': 'Not a link to an image file'}
    else:
        print('URL {u} of type {t} has no Wikipedia File reference.\n'.format(
            u=url, t=type))
        return {'error': 'Not a link to a Wikipedia file reference'}

    query_url = '{meta}?titles={title}'.format(meta=METADATA_URL,
                                               title=urllib.parse.unquote(filename))
    params = {
        'action': 'query',
        'prop': 'imageinfo',
        'iiprop': 'user|userid|extmetadata|url',
        'iiurlwidth': '120',
        'iiurlheight': '90',
        'format': 'json'
    }
    sleep(.3)
    r = requests.get(query_url, params=params, headers=HEADERS)
    if not r.ok:
        print('request failed!')
        return {'error': 'Request for Wikipedia metadata failed'}
    resp = r.json()
    page = list(resp['query']['pages'].keys())[0]
    imageinfo = (resp['query']['pages'][page]['imageinfo'][0]
                 if 'imageinfo' in resp['query']['pages'][page] else '')
    if not imageinfo:
        print('\nGot no imageinfo for {u}. Full response:'.format(u=url))
        print(resp)
        print('\n\n')
        invalidreason = resp['query']['pages'][page].get('invalidreason', '')
        return {'error': 'Could not get Wikipedia metadata. API reason: {invalid}'.format(
            invalid=invalidreason)}
    metadata = imageinfo['extmetadata']
    username = imageinfo['user']
    thumbnail = imageinfo['thumburl']
    artist = metadata['Artist']['value'] if 'Artist' in metadata else ''
    license_name = metadata['LicenseShortName']['value'] if 'LicenseShortName' in metadata else ''
    license_url = (metadata['LicenseUrl']['value']
                   if 'LicenseUrl' in metadata else '')
    description = metadata['ObjectName']['value'] if 'ObjectName' in metadata else ''
    return {
        'thumbnail': thumbnail,
        'license': license_name,
        'license_url': license_url,
        'description': description,
        'artist': artist,
        'username': username
    }


def get_image_metadata_fields(fld, data):
    extended = {}
    if not data or 'error' in data:
        for f in IMAGE_METADATA_FIELDS:
            extended['{field}_{key}'.format(field=fld, key=f)] = ''
    else:
        for key in data.keys():
            extended['{field}_{key}'.format(field=fld, key=key)] = data[key]
    return extended


def download_image(url, filename):
    """Return true on success."""
    print('Download image to {filename}...'.format(filename=filename))
    sleep(1)
    r = requests.get(url, headers=HEADERS, stream=True)
    if r.status_code == 200:
        with open(filename, 'wb') as imagefile:
            for chunk in r.iter_content(chunk_size=128):
                imagefile.write(chunk)
        return True
    else:
        print('Failed to download image from {url}. Response: {status}.'.format(
            url=url, status=r.status_code))
        print(r.text)
    return False


def get_image_filename(zipcode, fieldname, thumbnail):
    lthumb = thumbnail.lower()
    offset = lthumb.rfind('.')
    extension = lthumb[offset:]
    return os.path.join(IMAGE_DIRECTORY,
                        '{zipcode}_{fld}{extension}'.format(zipcode=zipcode,
                                                            fld=fieldname,
                                                            extension=extension))


with open(DESCRIPTIONS_CSV) as df:
    rdr = csv.DictReader(df)
    fieldnames = list(rdr.fieldnames)
    descriptions = [r for r in rdr]

extended_fieldnames = fieldnames
for img in IMAGE_FIELDS:
    for meta in IMAGE_METADATA_FIELDS:
        extended_fieldnames.append(
            '{field}_{meta}'.format(field=img, meta=meta))

# Track counts
good_urls = bad_urls = missing_urls = 0
downloaded_images = failed_downloads = skipped_downloads = 0

# ['zipcode', 'source_field', 'url', 'issue']

with open(OUTPUT_FILE, 'w') as outf:
    wtr = csv.DictWriter(outf, fieldnames=extended_fieldnames)
    wtr.writeheader()
    with open(STATUS_FILE, 'w') as statusf:
        status_wtr = csv.DictWriter(statusf, fieldnames=STATUS_FIELDS)
        status_wtr.writeheader()
        for row in descriptions:
            zipcode = row['zipcode'].zfill(5)
            print('Processing {zip}...'.format(zip=zipcode))
            extended_row = row
            for fld in IMAGE_FIELDS:
                url = row[fld]
                metadata = None
                if url:
                    metadata = get_image_metadata(url, fld)
                    if not metadata or 'error' in metadata:
                        bad_urls += 1
                        status_wtr.writerow({
                            'zipcode': zipcode,
                            'source_field': fld,
                            'url': url,
                            'issue': metadata.get('error',
                                                  'Failed to fetch metadata for attribution')
                        })
                    else:
                        good_urls += 1
                        thumb = metadata['thumbnail']
                        filename = get_image_filename(zipcode, fld, thumb)
                        exists = os.path.isfile(filename)
                        if exists:
                            skipped_downloads += 1
                        elif download_image(thumb, filename):
                            downloaded_images += 1
                        else:
                            failed_downloads += 1
                else:
                    missing_urls += 1
                extended_row.update(get_image_metadata_fields(fld, metadata))
            try:
                wtr.writerow(extended_row)
            except Exception as ex:
                print('Failed to write:')
                print(extended_row)
                raise ex

print('Good: {g} Bad: {b} Missing: {m}'.format(g=good_urls,
                                               b=bad_urls,
                                               m=missing_urls))

print('\n\nDownloaded {d} images. Attempted and failed to download {f} images.'.format(
    d=downloaded_images, f=failed_downloads))

print('Skipped downloading {s} images already in {images_dir}.'.format(
    s=skipped_downloads,
    images_dir=IMAGE_DIRECTORY)
)

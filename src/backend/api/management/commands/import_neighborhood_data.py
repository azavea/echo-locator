import json
from urllib.parse import urlparse

import boto3
from api.models import Neighborhood
from django.contrib.gis.geos import GEOSGeometry
from django.core.management.base import BaseCommand
from django.db import transaction

NULLABLE_CHAR_FIELDS = set(
    [
        "town_area",
        "town_website_description",
        "town_link",
        "wikipedia",
        "wikipedia_link",
        "street",
        "school",
        "town_square",
        "open_space_or_landmark",
        "street_thumbnail",
        "school_thumbnail",
        "town_square_thumbnail",
        "open_space_or_landmark_thumbnail",
        "street_license",
        "school_license",
        "town_square_license",
        "open_space_or_landmark_license",
        "street_license_url",
        "school_license_url",
        "town_square_license_url",
        "open_space_or_landmark_license_url",
        "street_description",
        "school_description",
        "town_square_description",
        "open_space_or_landmark_description",
        "street_artist",
        "school_artist",
        "town_square_artist",
        "open_space_or_landmark_artist",
        "street_username",
        "school_username",
        "town_square_username",
        "open_space_or_landmark_username",
    ]
)

# Booleans expressed as integers in the data (0 = False, non-zero = True)
BOOLEAN_INT_FIELDS = set(["ecc", "school_choice"])

IMAGE_FIELDS = set(["street", "school", "town_square", "open_space_or_landmark"])


def make_neighborhood(nhd, bound, imgs):
    # Mini transformers for incoming data format
    def sanitize_value(key, val):
        if key in NULLABLE_CHAR_FIELDS:
            return val if val is not None else ""
        elif key in BOOLEAN_INT_FIELDS:
            return True if val > 0 else False
        return val

    # The Django model keys exactly match the keys present in the GeoJSON properties.
    sanitized_properties = {key: sanitize_value(key, val) for key, val in nhd["properties"].items()}
    # Remove zipcodes from image file names in order to match to image fields
    img_no_zips = {"_".join(img.split("_")[1:]): imgs[img] for img in imgs}
    identify_imgs = {}
    for field in IMAGE_FIELDS:
        for img in img_no_zips:
            if img == field:
                identify_imgs[field] = img_no_zips[img]
    _, created = Neighborhood.objects.update_or_create(
        zipcode=nhd["properties"]["zipcode"],
        defaults=dict(
            centroid=GEOSGeometry(json.dumps(nhd["geometry"]), srid=4326),
            boundary=GEOSGeometry(json.dumps(bound["geometry"]), srid=4326),
            street_image=identify_imgs.get("street"),
            school_image=identify_imgs.get("school"),
            town_square_image=identify_imgs.get("town_square"),
            open_space_or_landmark_image=identify_imgs.get("open_space_or_landmark"),
            **sanitized_properties,
        ),
    )
    return created


class Command(BaseCommand):
    help = "Import neighborhoods data from json files"

    def add_arguments(self, parser):
        parser.add_argument(
            "neighborhoods_json",
            help="""S3 Path to file storing neighborhood data, as GeoJSON, e.g.
            s3://bucket-name/path/to/neighborhoods.json""",
        )
        parser.add_argument(
            "neighborhood_bounds_json",
            help="""S3 path to file storing neighborhood boundaries, as GeoJSON, e.g.
            s3://bucket-name/path/to/neighborhood_bounds.json""",
        )
        parser.add_argument(
            "neighborhood_images",
            help="""S3 path to file storing neighborhood images, e.g.
            s3://bucket-name/path/to/assets/neighborhoods/""",
        )

    def handle(self, *args, **options):
        # Pull data from files out into Python dicts
        nhd_url_parts = urlparse(options["neighborhoods_json"])
        bounds_url_parts = urlparse(options["neighborhood_bounds_json"])
        images_url_parts = urlparse(options["neighborhood_images"])
        s3 = boto3.resource("s3")
        # Parse the passed S3 urls into bucket/key parts, then download, parse to JSON, and pull out
        # the "features" key (which will be an array of geometries with properties).
        # The result of urlparse includes a leading forward-slash in .path, which S3 doesn't
        # consider to be part of the Object name, so we need to strip it off, hence the [1:] slice.
        neighborhood_data = json.load(
            s3.Object(nhd_url_parts.netloc, nhd_url_parts.path[1:]).get()["Body"]
        )["features"]
        bounds_data = json.load(
            s3.Object(bounds_url_parts.netloc, bounds_url_parts.path[1:]).get()["Body"]
        )["features"]
        image_bucket = s3.Bucket(images_url_parts.netloc)
        # Iterate through and generate list of item keys from assets/neighborhood, excluding .gitkeep
        neighborhood_images = [
            img.key.split("/")[2]
            for img in image_bucket.objects.filter(Prefix=images_url_parts.path[1:])
            if img.key.split(".")[1] != "gitkeep"
        ]
        # Zip data sources together by shared unique key (zip code)
        neighborhoods_by_zip = {nhd["properties"]["zipcode"]: nhd for nhd in neighborhood_data}
        imgs_by_zip = {}
        for zipcode in neighborhoods_by_zip:
            img_and_key = {}
            for img in neighborhood_images:
                if img.split("_")[0] == zipcode:
                    # save key to dictionary without extension
                    img_and_key[img.split(".")[0]] = img
            imgs_by_zip[zipcode] = img_and_key
        nhd_bounds_imgs_by_zip = {
            bound["properties"]["id"]: (
                neighborhoods_by_zip[bound["properties"]["id"]],
                bound,
                imgs_by_zip[bound["properties"]["id"]],
            )
            for bound in bounds_data
        }

        # Create Django objects from each pair of (neighborhood, bounds)
        with transaction.atomic():
            created_or_not = [
                make_neighborhood(nhd, bound, imgs)
                for nhd, bound, imgs in nhd_bounds_imgs_by_zip.values()
            ]
        print("Done!")
        print(
            f"""
{created_or_not.count(True)} neighborhoods created, {created_or_not.count(False)} updated
    """
        )

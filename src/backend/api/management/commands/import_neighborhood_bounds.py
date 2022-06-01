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


def make_neighborhood(nhd, bound):
    # Mini transformers for incoming data format
    def sanitize_value(key, val):
        if key in NULLABLE_CHAR_FIELDS:
            return val if val is not None else ""
        elif key in BOOLEAN_INT_FIELDS:
            return True if val > 0 else False
        return val

    # The Django model keys exactly match the keys present in the GeoJSON properties.
    sanitized_properties = {key: sanitize_value(key, val) for key, val in nhd["properties"].items()}
    _, created = Neighborhood.objects.update_or_create(
        zipcode=nhd["properties"]["zipcode"],
        defaults=dict(
            centroid=GEOSGeometry(json.dumps(nhd["geometry"]), srid=4326),
            boundary=GEOSGeometry(json.dumps(bound["geometry"]), srid=4326),
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

    def handle(self, *args, **options):
        # Pull data from files out into Python dicts
        nhd_url_parts = urlparse(options["neighborhoods_json"])
        bounds_url_parts = urlparse(options["neighborhood_bounds_json"])
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
        # Zip data sources together by shared unique key (zip code)
        neighborhoods_by_zip = {nhd["properties"]["zipcode"]: nhd for nhd in neighborhood_data}
        nhd_and_bounds_by_zip = {
            bound["properties"]["id"]: (neighborhoods_by_zip[bound["properties"]["id"]], bound)
            for bound in bounds_data
        }

        # Create Django objects from each pair of (neighborhood, bounds)
        with transaction.atomic():
            created_or_not = [
                make_neighborhood(nhd, bound) for nhd, bound in nhd_and_bounds_by_zip.values()
            ]
        print("Done!")
        print(
            f"""
{created_or_not.count(True)} neighborhoods created, {created_or_not.count(False)} updated
    """
        )

from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class NeighborhoodPhotoStorage(S3Boto3Storage):
    bucket_name = settings.AWS_S3_PHOTO_BUCKET
    querystring_auth = False
    location = "assets/neighborhoods"

from django.contrib.gis.db import models
from django.utils.safestring import mark_safe

from .storage_backends import NeighborhoodPhotoStorage


class Neighborhood(models.Model):

    town = models.CharField(max_length=100)
    # For grouping zipcodes into larger towns (specifically, Boston)
    town_area = models.CharField(max_length=100, blank=True)
    zipcode = models.CharField(max_length=5, unique=True)
    centroid = models.PointField(srid=4326)
    boundary = models.MultiPolygonField(srid=4326)

    # Whether this neighborhood is designated an Expanded Choice Community
    ecc = models.BooleanField(default=False)
    violentcrime_quintile = models.FloatField(null=True)
    crime_percentile = models.FloatField(null=True)
    education_percentile_quintile = models.FloatField()
    education_percentile = models.FloatField()
    house_number_symbol = models.IntegerField()

    # This looks like it might be better as a ChoiceField, but so far I haven't found a place where
    # it's even being used, so leaving it as-is for now.
    lat_lon_category = models.IntegerField()

    max_rent_0br = models.FloatField(null=True)
    max_rent_1br = models.FloatField(null=True)
    max_rent_2br = models.FloatField(null=True)
    max_rent_3br = models.FloatField(null=True)
    max_rent_4br = models.FloatField(null=True)
    max_rent_5br = models.FloatField(null=True)
    max_rent_6br = models.FloatField(null=True)

    # Whether this neighborhood is in a school choice district (applies mostly (only?) to Boston)
    school_choice = models.BooleanField(default=False)
    total_mapc = models.FloatField()

    town_website_description = models.TextField(blank=True)
    town_link = models.URLField(max_length=400, blank=True)
    wikipedia = models.TextField(blank=True)
    wikipedia_link = models.URLField(max_length=400, blank=True)

    street = models.URLField(max_length=400, blank=True)
    school = models.URLField(max_length=400, blank=True)
    town_square = models.URLField(max_length=400, blank=True)
    open_space_or_landmark = models.URLField(max_length=400, blank=True)

    street_thumbnail = models.URLField(max_length=400, blank=True)
    school_thumbnail = models.URLField(max_length=400, blank=True)
    town_square_thumbnail = models.URLField(max_length=400, blank=True)
    open_space_or_landmark_thumbnail = models.URLField(max_length=400, blank=True)

    street_image = models.ImageField(
        blank=True,
        storage=NeighborhoodPhotoStorage(),
        help_text="Save and return to this record to see uploaded image. Image will be displayed at 120x90.",
    )
    school_image = models.ImageField(
        blank=True,
        storage=NeighborhoodPhotoStorage(),
        help_text="Save and return to this record to see uploaded image. Image will be displayed at 120x90.",
    )
    town_square_image = models.ImageField(
        blank=True,
        storage=NeighborhoodPhotoStorage(),
        help_text="Save and return to this record to see uploaded image. Image will be displayed at 120x90.",
    )
    open_space_or_landmark_image = models.ImageField(
        blank=True,
        storage=NeighborhoodPhotoStorage(),
        help_text="Save and return to this record to see uploaded image. Image will be displayed at 120x90.",
    )

    street_license = models.CharField(max_length=50, blank=True)
    school_license = models.CharField(max_length=50, blank=True)
    town_square_license = models.CharField(max_length=50, blank=True)
    open_space_or_landmark_license = models.CharField(max_length=50, blank=True)

    street_license_url = models.URLField(max_length=400, blank=True)
    school_license_url = models.URLField(max_length=400, blank=True)
    town_square_license_url = models.URLField(max_length=400, blank=True)
    open_space_or_landmark_license_url = models.URLField(max_length=400, blank=True)

    street_description = models.TextField(blank=True)
    school_description = models.TextField(blank=True)
    town_square_description = models.TextField(blank=True)
    open_space_or_landmark_description = models.TextField(blank=True)

    street_artist = models.CharField(max_length=400, blank=True)
    school_artist = models.CharField(max_length=400, blank=True)
    town_square_artist = models.CharField(max_length=400, blank=True)
    open_space_or_landmark_artist = models.CharField(max_length=400, blank=True)

    street_username = models.CharField(max_length=50, blank=True)
    school_username = models.CharField(max_length=50, blank=True)
    town_square_username = models.CharField(max_length=50, blank=True)
    open_space_or_landmark_username = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["zipcode"]

    def __str__(self):
        return f"{self.town} ({self.zipcode})"

    @property
    def street_image_preview(self):
        if self.street_image:
            return mark_safe(
                '<img src="{url}" width="120" height="90" />'.format(url=self.street_image.url)
            )
        return ""

    @property
    def school_image_preview(self):
        if self.school_image:
            return mark_safe(
                '<img src="{url}" width="120" height="90" />'.format(url=self.school_image.url)
            )
        return ""

    @property
    def town_square_image_preview(self):
        if self.town_square_image:
            return mark_safe(
                '<img src="{url}" width="120" height="90" />'.format(url=self.town_square_image.url)
            )
        return ""

    @property
    def open_space_or_landmark_image_preview(self):
        if self.open_space_or_landmark_image:
            return mark_safe(
                '<img src="{url}" width="120" height="90" />'.format(
                    url=self.open_space_or_landmark_image.url
                )
            )
        return ""

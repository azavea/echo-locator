from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver


@receiver(pre_save, sender=User)
def lowercase_email(sender, instance, *args, **kwargs):
    instance.username = instance.username.lower()
    instance.email = instance.username


class UserProfile(models.Model):
    class TravelMode(models.TextChoices):
        CAR = "CAR", "car"
        BUS_TRAIN = "BT", "bus/train"
        BUS_TRAIN_EXPRESS = "BTE", "bus/train/express"

    class Priorities(models.TextChoices):
        NOT_IMPORTANT = "NI", "Not important"
        SOMEWHAT_IMPORTANT = "SI", "Somewhat important"
        IMPORTANT = "I", "Important"
        VERY_IMPORTANT = "VI", "Very important"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(
        blank=True, max_length=200
    )  # This is used in place of Django's auto first name and last name fields; they're still present in User but unused
    has_voucher = models.BooleanField(
        default=True, verbose_name="Has Boston Housing Authority voucher"
    )
    voucher_bedrooms = models.IntegerField(
        blank=True, null=True, verbose_name="Boston Housing Authority voucher bedrooms"
    )
    rent_budget = models.IntegerField(blank=True, null=True)
    desired_bedrooms = models.IntegerField(blank=True, null=True)
    favorites = ArrayField(models.CharField(max_length=10), default=list)
    travel_mode = models.CharField(
        choices=TravelMode.choices, max_length=3, default=TravelMode.BUS_TRAIN
    )
    commute_priority = models.CharField(
        choices=Priorities.choices, max_length=2, default=Priorities.NOT_IMPORTANT
    )
    school_quality_priority = models.CharField(
        choices=Priorities.choices, max_length=2, default=Priorities.NOT_IMPORTANT
    )
    public_safety_priority = models.CharField(
        choices=Priorities.choices, max_length=2, default=Priorities.SOMEWHAT_IMPORTANT
    )

    def __str__(self):
        return self.user.email


class Destination(models.Model):
    class TripPurpose(models.TextChoices):
        WORK = "WK", "Work"
        DAYCARE = "DC", "Daycare"
        FAMILY = "FA", "Family"
        FRIENDS = "FR", "Friends"
        WORSHIP = "WP", "Worship"
        DOCTOR = "DR", "Doctor"
        OTHER = "OT", "Other"

    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="destinations")
    label = models.CharField(max_length=200)
    location = gis_models.PointField(
        help_text="The lat/lng point location of the destination",
        default=Point(-71.06, 42.36, srid=4326),
    )
    purpose = models.CharField(choices=TripPurpose.choices, max_length=2, default=TripPurpose.WORK)
    primary_destination = models.BooleanField(default=False)

    def __str__(self):
        return self.profile.full_name + self.label

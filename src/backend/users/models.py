from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    class TravelMode(models.TextChoices):
        CAR = "CAR", "car"
        BUSTRAIN = "BT", "bus/train"
        BUSTRAINEXPRESS = "BTE", "bus/train/express"

    class Priorities(models.TextChoices):
        NOTIMPORTANT = "NI", "Not important"
        SOMEWHATIMPORTANT = "SI", "Somewhat important"
        IMPORTANT = "I", "Important"
        VERYIMPORTANT = "VI", "Very important"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.EmailField(unique=True)
    full_name = models.CharField(blank=True, max_length=60)
    has_voucher = models.BooleanField(default=False)
    voucher_number = models.CharField(blank=True, max_length=10)
    voucher_bedrooms = models.IntegerField(blank=True, null=True)
    rent_budget = models.IntegerField(blank=True, null=True)
    desired_bedrooms = models.IntegerField(blank=True, null=True)
    travel_mode = models.CharField(choices=TravelMode.choices, max_length=40, default=TravelMode.BUSTRAIN)
    commute_priority = models.CharField(choices=Priorities.choices, max_length=18, default=Priorities.NOTIMPORTANT)
    school_quality_priority = models.CharField(choices=Priorities.choices, max_length=18, default=Priorities.NOTIMPORTANT)
    public_safety_priority = models.CharField(choices=Priorities.choices, max_length=18, default=Priorities.SOMEWHATIMPORTANT)

    def __str__(self):
        return self.full_name

class Destination(models.Model):
    class TripPurpose(models.TextChoices):
        WORK = "WK", "Work"
        DAYCARE = "DC", "Day care"
        FAMILY = "FA", "Family"
        FRIENDS = "FR", "Friends"
        WORSHIP = "WP", "Worship"
        DOCTOR = "DR", "Doctor"
        OTHER = "OT", "Other"
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    address = models.CharField(max_length=100)
    purpose = models.CharField(choices=TripPurpose.choices, max_length=8, default=TripPurpose.WORK)
    primary_destination = models.BooleanField(default=False)

    def __str__(self):
        return self.profile.user + ' - ' + self.address
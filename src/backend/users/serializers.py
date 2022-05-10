from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Destination, UserProfile


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["id", "profile", "address", "purpose", "primary_destination"]


class UserProfileSerializer(serializers.ModelSerializer):
    destinations = DestinationSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = [
            "full_name",
            "has_voucher",
            "voucher_number",
            "voucher_bedrooms",
            "rent_budget",
            "desired_bedrooms",
            "travel_mode",
            "commute_priority",
            "school_quality_priority",
            "public_safety_priority",
            "destinations",
        ]


class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ["userprofile", "username"]
        read_only_fields = ["username"]

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Destination, UserProfile


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ["profile", "location", "label", "purpose", "primary_destination"]


class UserProfileSerializer(serializers.ModelSerializer):
    destinations = DestinationSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = [
            "full_name",
            "has_voucher",
            "voucher_bedrooms",
            "rent_budget",
            "desired_bedrooms",
            "travel_mode",
            "commute_priority",
            "school_quality_priority",
            "public_safety_priority",
            "destinations",
            "favorites",
        ]


class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ["userprofile", "username"]
        read_only_fields = ["username"]


class HouseSeekerSignUpSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ["username"]

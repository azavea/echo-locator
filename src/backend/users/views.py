from django.conf import settings
from django.contrib.auth.models import Group, User
from django.contrib.gis.geos import Point
from django.core.mail import send_mail
from django.db import transaction
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from sesame import utils

from .models import Destination, UserProfile
from .serializers import HouseSeekerSignUpSerializer, UserSerializer


def send_login_link(request):
    """
    Send email with passwordless login link to User on Login/Sign Up.
    Will raise an exception if User.DoesNotExist
    """
    email = request.data["username"]
    user = User.objects.get(username__iexact=email)
    login_token = utils.get_query_string(user)
    host = request.get_host()
    protocol = "https://" if request.is_secure() else "http://"
    login_link = f"{protocol}{host}/callback{login_token}"

    html_message = """
    <p>Hi there,</p>
    <p>Thanks for using ECHO! Here is your <a href="{}">link to login</a>. This link is valid for 1 hour.</p>
    <p>BHA</p>
    """.format(
        login_link
    )

    # Confirm User has default empty profile to access site
    # if one doesn't already exist
    UserProfile.objects.get_or_create(user=user)

    send_mail(
        "Your ECHO Login Link",
        html_message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
        html_message=html_message,
    )


class UnifiedLoginView(APIView):
    """
    Handles both login and registration.
    If the user exists, it sends a login link.
    If the user does not exist, it creates the user first, then sends the link.
    """

    def post(self, request, **kwargs):
        # Use a serializer to validate the email format
        serializer = HouseSeekerSignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["username"].lower()

        # get_or_create handles the core logic for new and existing users
        user, created = User.objects.get_or_create(username=email)

        if created:
            # If a new user was created, perform any first-time setup
            # This logic is moved from the old serializer's .create() method
            user.email = email
            user.save()
            UserProfile.objects.create(user=user)
            # Add them to a group
            house_seeker_group = Group.objects.get(name="HouseSeeker")
            user.groups.add(house_seeker_group)

        # Send the magic link email to both new and existing users
        send_login_link(request)

        # Always return a consistent, positive message for security
        message = "If an account with this email exists or was just created, you will receive a login link shortly."
        return Response({"message": message})


class ObtainToken(APIView):
    def get(self, request, **kwargs):
        user = utils.get_user(request)

        # If the token is invalid or expired, get_user returns None
        if user is None:
            return Response({"error": "Invalid or expired login link."}, status=401)

        # Get or create the DRF token for the user
        token, _ = Token.objects.get_or_create(user=user)

        # Return the token key in a JSON response
        return Response({"token": token.key})


class DeleteToken(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, **kwargs):
        # Delete the token from the database.
        Token.objects.get(key=request.auth.key).delete()
        # 204 No Content
        return Response(status=204)


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    map_priorities_to_nums = {"NI": 1, "SI": 2, "I": 3, "VI": 4}
    map_nums_to_priorities = {value: key for key, value in map_priorities_to_nums.items()}
    map_purposes = {
        "WK": "Work",
        "DC": "Daycare",
        "FA": "Friends/Family",
        "FR": "Friends/Family",
        "WP": "Other",
        "DR": "Doctor",
        "OT": "Other",
        "SC": "School",
    }

    def repackage_for_frontend(self, serialized_data):
        # repackage destinations to match frontend AccountAddress
        user_profile = serialized_data["userprofile"]
        formatted_destinations = [
            {
                "location": {
                    "label": destination["label"],
                    "position": {
                        "lat": destination["location"]["coordinates"][1],
                        "lon": destination["location"]["coordinates"][0],
                    },
                },
                "primary": destination["primary_destination"],
                "purpose": self.map_purposes[destination["purpose"]],
            }
            for destination in user_profile["destinations"]
        ]

        # repackage user profile to match frontend AccountProfile type
        content = {
            "clientEmail": serialized_data["username"],
            "destinations": formatted_destinations,
            "hasVehicle": user_profile["travel_mode"] == "CA",
            "headOfHousehold": user_profile["full_name"],
            "importanceAccessibility": self.map_priorities_to_nums[
                user_profile["commute_priority"]
            ],
            "importanceSchools": self.map_priorities_to_nums[
                user_profile["school_quality_priority"]
            ],
            "importanceViolentCrime": self.map_priorities_to_nums[
                user_profile["public_safety_priority"]
            ],
            "hasVoucher": user_profile["has_voucher"],
            "voucherRooms": user_profile["voucher_bedrooms"],
            "nonVoucherRooms": user_profile["desired_bedrooms"],
            "nonVoucherBudget": user_profile["rent_budget"],
            "useCommuterRail": user_profile["travel_mode"] == "BTE",
            "favorites": user_profile["favorites"],
        }
        return content

    def get(self, request, **kwargs):
        user = User.objects.get(username=request.user)
        serializer = UserSerializer(user)

        content = self.repackage_for_frontend(serializer.data)

        return Response(content)

    def process_nullable_int(self, data, field):
        try:
            result = int(data[field])
        except (ValueError, TypeError):
            # field is something that cannot be converted to
            # a number. It could be an empty string, or a
            # string like 'hello'
            # insert null in this case
            result = None
        return result

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        data = request.data
        updated_profile = UserProfile.objects.select_for_update().get(
            user=User.objects.get(username=request.user)
        )

        Destination.objects.filter(profile=updated_profile).delete()
        destinations = [
            Destination(
                profile=updated_profile,
                label=dest["location"]["label"],
                primary_destination=dest["primary"],
                purpose=list(self.map_purposes.keys())[
                    list(self.map_purposes.values()).index(dest["purpose"])
                ],
                location=Point(
                    dest["location"]["position"]["lon"],
                    dest["location"]["position"]["lat"],
                    srid=4326,
                ),
            )
            for dest in data["destinations"]
        ]
        Destination.objects.bulk_create(destinations)

        # determine user's mode of travel
        if data["hasVehicle"]:
            updated_profile.travel_mode = "CA"
        elif data["useCommuterRail"]:
            updated_profile.travel_mode = "BTE"
        else:
            updated_profile.travel_mode = "BT"

        updated_profile.full_name = data["headOfHousehold"]
        updated_profile.commute_priority = self.map_nums_to_priorities[
            int(data["importanceAccessibility"])
        ]
        updated_profile.school_quality_priority = self.map_nums_to_priorities[
            int(data["importanceSchools"])
        ]
        updated_profile.public_safety_priority = self.map_nums_to_priorities[
            int(data["importanceViolentCrime"])
        ]
        updated_profile.has_voucher = data["hasVoucher"]
        updated_profile.voucher_bedrooms = self.process_nullable_int(data, "voucherRooms")
        updated_profile.desired_bedrooms = self.process_nullable_int(data, "nonVoucherRooms")
        updated_profile.rent_budget = self.process_nullable_int(data, "nonVoucherBudget")
        updated_profile.favorites = data["favorites"]

        updated_profile.save()

        serializer = UserSerializer(User.objects.get(username=request.user))
        content = self.repackage_for_frontend(serializer.data)
        return Response(content)

from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.db import transaction
from django.db.utils import IntegrityError
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
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
    user = User.objects.get(username=email)
    login_token = utils.get_query_string(user)
    host = request.get_host()
    protocol = "https://" if request.is_secure() else "http://"
    login_link = protocol + host + reverse("obtain_token") + login_token

    html_message = """
    <p>Hi there,</p>
    <p>Thanks for using ECHO! Here is your <a href="{}">link to login</a>. </p>
    <p>BHA</p>
    """.format(
        login_link
    )

    # Confirm User has default empty profile to access site
    # if one doesn't already exist
    UserProfile.objects.get_or_create(user=user)

    # TODO replace with actual values parameterized based on environment
    # issue 485 (https://github.com/azavea/echo-locator/issues/485)
    send_mail(
        "Your ECHO Login Link",
        html_message,
        "admin@domain.com",
        [email],
        fail_silently=False,
        html_message=html_message,
    )


class LoginPage(APIView):
    def post(self, request, **kwargs):
        try:
            # Will throw exception if cannot find the User
            # For privacy reasons, do not send 500 error back if not found
            send_login_link(request)
        except User.DoesNotExist:
            pass
        return Response(content_type="application/json")


class ObtainToken(APIView):
    def get(self, request, **kwargs):
        user = utils.get_user(request)
        token, created = Token.objects.get_or_create(user=user)
        response = HttpResponseRedirect("/")
        # set authentication cookie with max_age 30 days
        response.set_cookie("auth_token", token.key, max_age=60 * 60 * 24 * 30)
        return response


class DeleteToken(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, **kwargs):
        response = Response(status=200)
        response.delete_cookie("auth_token")
        Token.objects.get(key=request.auth.key).delete()
        return response


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    map_priorities_to_nums = {"NI": 1, "SI": 2, "I": 3, "VI": 4}
    map_nums_to_priorities = {value: key for key, value in map_priorities_to_nums.items()}
    map_purposes = {
        "WK": "Work",
        "DC": "Daycare",
        "FA": "Family",
        "FR": "Friends",
        "WP": "Worship",
        "DR": "Doctor",
        "OT": "Other",
    }

    def repackage_for_frontend(self, serialized_data):
        # repackage destinations to match frontend AccountAddress
        # TODO replace dummy Point data issue 486
        # (https://github.com/azavea/echo-locator/issues/486)
        user_profile = serialized_data["userprofile"]
        formatted_destinations = [
            {
                "location": {
                    "label": profile["label"],
                    "position": {"lat": 42.351550, "lon": -71.084753},
                },
                "primary": profile["primary_destination"],
                "purpose": self.map_purposes[profile["purpose"]],
            }
            for profile in user_profile["destinations"]
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
            "voucherNumber": user_profile["voucher_number"],
        }
        return content

    def get(self, request, **kwargs):
        user = User.objects.get(username=request.user)
        serializer = UserSerializer(user)

        content = self.repackage_for_frontend(serializer.data)

        return Response(content)

    @transaction.atomic
    def put(self, request, *args, **kwargs):
        data = request.data
        updated_profile = UserProfile.objects.select_for_update().get(
            user=User.objects.get(username=request.user)
        )

        # delete & replace all destinations on UserProfile
        # TODO save Point data issue 486 (https://github.com/azavea/echo-locator/issues/486)
        Destination.objects.filter(profile=updated_profile).delete()
        destinations = [
            Destination(
                profile=updated_profile,
                label=dest["location"]["label"],
                primary_destination=dest["primary"],
                purpose=list(self.map_purposes.keys())[
                    list(self.map_purposes.values()).index(dest["purpose"])
                ],
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
            int(data["importanceAccessibility"])
        ]
        updated_profile.public_safety_priority = self.map_nums_to_priorities[
            int(data["importanceAccessibility"])
        ]
        updated_profile.has_voucher = data["hasVoucher"]
        updated_profile.voucher_bedrooms = data["voucherRooms"]
        updated_profile.desired_bedrooms = data["nonVoucherRooms"]
        updated_profile.voucher_number = data["voucherNumber"]
        updated_profile.rent_budget = data["nonVoucherBudget"]
        updated_profile.voucher_number = data["voucherNumber"]

        updated_profile.save()

        serializer = UserSerializer(User.objects.get(username=request.user))
        content = self.repackage_for_frontend(serializer.data)
        return Response(content)


class SignUpPage(APIView):
    def post(self, request, **kwargs):
        signup_message = "Thank you! You'll receive an email shortly with a link to complete your account. Click the link to create your profile and get started with ECHO."
        try:
            user_serializer = HouseSeekerSignUpSerializer(data=request.data)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
            send_login_link(request)
        except IntegrityError:
            signup_message = "It looks like we already have an account with that email. Sign in by clicking the link below!"
        except ValidationError:
            signup_message = "Please try again with a valid email address."
        return Response(data=signup_message, content_type="application/json")

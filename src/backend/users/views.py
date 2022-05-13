from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from sesame import utils

from .serializers import UserSerializer


class LoginPage(APIView):
    def post(self, request, **kwargs):
        email = request.data["email"]
        # try to find the User, but for privacy reasons, do not send 500 error back if not found
        try:
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


class GetUserProfile(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, **kwargs):
        user = User.objects.get(username=request.user)
        serializer = UserSerializer(user)
        user_profile = serializer.data["userprofile"]
        map_priorities_to_nums = {"NI": 1, "SI": 2, "I": 3, "VI": 4}
        map_purposes = {
            "WK": "Work",
            "DC": "Day care",
            "FA": "Family",
            "FR": "Friends",
            "WP": "Worship",
            "DR": "Doctor",
            "OT": "Other",
        }

        # repackage destinations to match frontend AccountAddress
        # TODO replace dummy Point data issue 486
        # (https://github.com/azavea/echo-locator/issues/486)
        formatted_destinations = [
            {
                "location": {
                    "label": profile["label"],
                    "position": {"lat": 42.351550, "lon": -71.084753},
                },
                "primary": profile["primary_destination"],
                "purpose": map_purposes[profile["purpose"]],
            }
            for profile in user_profile["destinations"]
        ]

        # repackage user profile to match frontend AccountProfile type
        content = {
            "clientEmail": serializer.data["username"],
            "destinations": formatted_destinations,
            "hasVehicle": user_profile["travel_mode"] == "CA",
            "headOfHousehold": user_profile["full_name"],
            "importanceAccessibility": map_priorities_to_nums[user_profile["commute_priority"]],
            "importanceSchools": map_priorities_to_nums[user_profile["school_quality_priority"]],
            "importanceViolentCrime": map_priorities_to_nums[
                user_profile["public_safety_priority"]
            ],
            "rooms": user_profile["voucher_bedrooms"]
            if user_profile["voucher_bedrooms"]
            else user_profile["desired_bedrooms"],
            "useCommuterRail": user_profile["travel_mode"] == "BTE",
            "voucherNumber": user_profile["voucher_number"],
        }
        return Response(content)

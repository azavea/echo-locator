from django.shortcuts import render
from django.contrib.auth.models import User
from sesame import utils
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginPage(APIView):
    def post(self, request, **kwargs):
        email = request.data['email']
        # try to find the User, but for privacy reasons, do not send 500 error back if not found
        try:
            user = User.objects.get(username=email)
            login_token = utils.get_query_string(user)
            login_link = "http://localhost:9966/auth/{}".format(login_token)

            html_message = """
            <p>Hi there,</p>
            <p>Thanks for using ECHO! Here is your <a href="{}">link to login</a>. </p>
            <p>BHA</p>
            """.format(login_link)

            send_mail(
                'Your ECHO Login Link',
                html_message,
                'admin@domain.com', # This will need to be replaced with actual values
                [email],
                fail_silently=False,
                html_message = html_message
            )
            return Response (content_type="application/json")
        except:
            return Response (content_type="application/json")
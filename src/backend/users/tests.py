from django.contrib.auth.models import Group, User
from django.test import Client, TestCase
from users.models import UserProfile


class AdminSiteTest(TestCase):
    """Check for the correct content by group permissions on admin site."""

    fixtures = ["group_permissions"]

    @classmethod
    def setUpTestData(cls):
        cls.counselor, cls.houseseeker = Client(), Client()

        cls.counselor_username = "counselor"
        cls.houseseeker_username = "houseseeker"
        cls.password = "password"

        # Create users
        cls.counselor_user = User.objects.create_user(
            cls.counselor_username, "test@azavea.com", password=cls.password
        )
        cls.houseseeker_user = User.objects.create_user(
            cls.houseseeker_username, "test1@azavea.com", password=cls.password
        )

        # Add to groups
        cls.test_counselor_group = Group.objects.get(name="Counselor")
        cls.test_houseseeker_group = Group.objects.get(name="HouseSeeker")
        cls.counselor_user.groups.add(cls.test_counselor_group)
        cls.counselor_user.save()
        cls.houseseeker_user.groups.add(cls.test_houseseeker_group)
        cls.houseseeker_user.save()
        super(AdminSiteTest, cls).setUpTestData()

    def setUp(self):
        # Login
        self.counselor.login(username=self.counselor_username, password=self.password)
        self.houseseeker.login(username=self.houseseeker_username, password=self.password)

    def tearDown(self):
        self.counselor.logout()
        self.houseseeker.logout()

    def test_counselor_group_signal(self):
        self.counselor_user.groups.remove(self.test_counselor_group)
        self.counselor_user.save()
        no_group = self.counselor_user.is_staff
        self.counselor_user.groups.add(self.test_counselor_group)
        self.counselor_user.save()
        has_group = self.counselor_user.is_staff
        self.assertNotEqual(no_group, has_group)
        self.assertTrue(has_group)

    def test_counselor_group_login_permissions(self):
        response = self.counselor.get("/admin/auth/user/")
        self.assertEqual(
            response.status_code,
            200,
            f"Expected 200, got {response.status_code}. {response.content}",
        )
        response = self.counselor.get("/admin/users/userprofile/")
        self.assertEqual(
            response.status_code,
            200,
            f"Expected 200, got {response.status_code}. {response.content}",
        )

    def test_counselor_group_user_auth_permissions(self):
        other_counselor_user = User.objects.create_user(
            "other_test_user", "test@azavea.com", password=self.password
        )
        response = self.counselor.get("/admin/auth/user/")
        content = response.content.decode("utf-8")
        self.assertIn(
            self.houseseeker_user.username, content, "Got unexpected content: %s" % content
        )
        self.assertNotIn(
            other_counselor_user.username, content, "Got unexpected content: %s" % content
        )
        self.assertNotIn("Add", content, "Got unexpected content: %s" % content)

    def test_houseseeker_group_permissions(self):
        response = self.houseseeker.get("/admin/")
        # Expect redirect back to admin on failed login
        self.assertEqual(
            response.url,
            "/admin/login/?next=/admin/",
            f"Got unexpected response: {response.status_code}. {response.content}",
        )


class HouseSeekerSignUpTest(TestCase):
    """Check User sign up process."""

    fixtures = ["group_permissions"]

    @classmethod
    def setUpTestData(cls):
        cls.houseseeker = Client()
        cls.test_houseseeker_group = Group.objects.get(name="HouseSeeker")

    def test_signup_endpoint_response(self):
        """
        Test signup endpoint responds with correct login message.
        """
        first_response = self.houseseeker.post(
            "/api/signup/",
            {"username": "testechoemail@azavea.com"},
            content_type="application/json",
        )
        self.assertEqual(
            first_response.status_code,
            200,
            f"Expected 200, got {first_response.status_code}. {first_response.content}",
        )
        second_response = self.houseseeker.post(
            "/api/signup/",
            {"username": "testechoemail@azavea.com"},
            content_type="application/json",
        )
        self.assertEqual(
            second_response.status_code,
            200,
            f"Expected 200, got {second_response.status_code}. {second_response.content}",
        )
        self.assertContains(first_response, "created your account", status_code=200)
        self.assertContains(second_response, "already have an account", status_code=200)

    def test_user_and_no_profile_created_on_signup(self):
        self.houseseeker.post(
            "/api/signup/",
            {"username": "testechoemail1@azavea.com"},
            content_type="application/json",
        )
        houseseeker_user = User.objects.filter(username="testechoemail1@azavea.com")
        self.assertEqual(len(houseseeker_user), 1)
        self.assertEqual(houseseeker_user.first().groups.first(), self.test_houseseeker_group)
        houseseeker_user_profile = UserProfile.objects.filter(user=houseseeker_user.first())
        self.assertIsNone(houseseeker_user_profile.first())

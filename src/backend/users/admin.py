from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import Group, User
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.forms.widgets import OSMWidget
from django.core.validators import validate_email
from django.forms.models import BaseInlineFormSet

from .models import Destination, UserProfile


class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Email")
    error_messages = {"invalid_login": "Please enter a correct email and password."}

    # convert entered email to lowercase
    def clean(self):
        self.cleaned_data["username"] = self.cleaned_data.get("username").lower()
        cleaned_data = super(LoginForm, self).clean()
        return cleaned_data


# Validates that the username is a valid email on save
class CreateUserAdminForm(UserCreationForm):
    class Meta:
        model = User
        fields = "__all__"

    def clean(self):
        cleaned_data = super(CreateUserAdminForm, self).clean()
        validate_email(cleaned_data["username"])
        return cleaned_data


class DestinationAdminForm(BaseInlineFormSet):
    class Meta:
        model = Destination
        fields = "__all__"

    def clean(self):
        if self.is_valid():
            primary_destinations = [
                dest for dest in self.cleaned_data if dest.get("primary_destination")
            ]
            if len(primary_destinations) != 1:
                raise forms.ValidationError("Please select exactly one primary address")


class DestinationInline(admin.TabularInline):
    model = Destination
    min_num = 1
    formset = DestinationAdminForm
    formfield_overrides = {
        gis_models.PointField: {"widget": OSMWidget},
    }


# Define a new UserAdmin that filters Counselor group view
# This admin also changes the username field to be referred to as "email"
class UserAdmin(BaseUserAdmin):
    add_form = CreateUserAdminForm
    list_display = ("username",)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Permissions",
            {
                "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions"),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields["username"].label = "Email:"
        return form

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        houseSeekers = Group.objects.get(name="HouseSeeker")
        return qs.filter(groups=houseSeekers)


class UserProfileAdmin(admin.ModelAdmin):
    inlines = [DestinationInline]
    list_display = ("user", "full_name")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "user",
                    "full_name",
                    "has_voucher",
                    "voucher_bedrooms",
                    "rent_budget",
                    "desired_bedrooms",
                    "travel_mode",
                    "commute_priority",
                    "school_quality_priority",
                    "public_safety_priority",
                    "favorites",
                )
            },
        ),
    )


admin.site.register(UserProfile, UserProfileAdmin)
# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

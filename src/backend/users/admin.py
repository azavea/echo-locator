from django.contrib import admin
from django import forms
from django.forms.models import BaseInlineFormSet
from django.core.validators import validate_email
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import UserProfile, Destination

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='Email')

# Validates that the username is a valid email on save
class CreateUserAdminForm(UserCreationForm):
    class Meta:
        model = User
        fields = '__all__'

    def clean(self):
        cleaned_data = super(CreateUserAdminForm, self).clean()
        try:
            validate_email(cleaned_data['username'])
            return cleaned_data
        except:
            raise forms.ValidationError('Please enter a valid email address')

class DestinationAdminForm(BaseInlineFormSet):
    class Meta:
        model = Destination
        fields = '__all__'

    def clean(self):
        if self.is_valid():
            count_primary_destinations = 0
            for i in self.cleaned_data:
                if i.get('primary_destination'):
                    count_primary_destinations += 1
            if count_primary_destinations != 1:
                raise forms.ValidationError('Please select one primary address')

class DestinationInline(admin.TabularInline):
    model = Destination
    min_num = 1
    formset = DestinationAdminForm


# Define a new UserAdmin that filters Counselor group view
# This admin also changes the username field to be referred to as "email"
class UserAdmin(BaseUserAdmin):
    add_form = CreateUserAdminForm
    list_display = ('username', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('username', 'password', 'first_name', 'last_name')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['username'].label = 'Email:'
        return form

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        houseSeekers = Group.objects.get(name='HouseSeeker')
        return qs.filter(groups=houseSeekers)

class UserProfileAdmin(admin.ModelAdmin):
    inlines = [
        DestinationInline
    ]
    list_display = ('username', 'full_name')
    fieldsets = (
        (None, {'fields': ('user', 'username', 'full_name', 'has_voucher', 'voucher_number',
        'voucher_bedrooms', 'rent_budget', 'desired_bedrooms', 'travel_mode', 'commute_priority',
        'school_quality_priority', 'public_safety_priority')}),
    )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['username'].label = 'Email:'
        return form

admin.site.register(UserProfile, UserProfileAdmin)
# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
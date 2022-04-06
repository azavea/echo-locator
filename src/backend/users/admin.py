from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User, Group
from .models import UserProfile

# Define a new UserAdmin that filters Counselor group view
class UserAdmin(BaseUserAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        houseSeekers = Group.objects.get(name='HouseSeeker')
        return qs.filter(groups=houseSeekers)

admin.site.register(UserProfile)
# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

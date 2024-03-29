"""echo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from api import views as api_views
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path
from echo import settings
from users import views as user_views
from users.admin import LoginForm

admin.site.login_form = LoginForm

urlpatterns = [
    path(
        "admin/password_reset/",
        auth_views.PasswordResetView.as_view(),
        name="admin_password_reset",
    ),
    path(
        "admin/password_reset/done/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path("api/signup/", user_views.SignUpPage.as_view(), name="signup"),
    path("api/login/", user_views.LoginPage.as_view(), name="login"),
    path("api/auth/login/", user_views.ObtainToken.as_view(), name="obtain_token"),
    path("api/user/", user_views.UserProfileView.as_view(), name="user_details"),
    path("api/logout/", user_views.DeleteToken.as_view(), name="delete_token"),
    path("api/neighborhoods/", api_views.ListNeighborhoods.as_view(), name="list_neighborhoods"),
    path(
        "api/neighborhood-bounds/",
        api_views.ListNeighborhoodBounds.as_view(),
        name="list_neighborhood_bounds",
    ),
    path("admin/", admin.site.urls),
    path("health-check/", include("watchman.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

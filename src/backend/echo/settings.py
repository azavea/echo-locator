"""

Generated by 'django-admin startproject' using Django 3.2.

For more information on this file, see
Django settings for echo project.

https://docs.djangoproject.com/en/3.2/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os
from pathlib import Path

import requests
from django.core.exceptions import ImproperlyConfigured

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "secret")

# Set environment
ENVIRONMENT = os.getenv("DJANGO_ENV", "Development")
VALID_ENVIRONMENTS = ("Production", "Staging", "Development")
if ENVIRONMENT not in VALID_ENVIRONMENTS:
    raise ImproperlyConfigured(
        "Invalid ENVIRONMENT provided, must be one of {}".format(VALID_ENVIRONMENTS)
    )

LOGLEVEL = os.getenv("DJANGO_LOG_LEVEL", "INFO")
 # SECURITY WARNING: don't run with debug turned on in production!
DEBUG = ENVIRONMENT == "Development"

ALLOWED_HOSTS = []

if "R53_PUBLIC_HOSTED_ZONE" in os.environ:
    ALLOWED_HOSTS.append(os.getenv("R53_PUBLIC_HOSTED_ZONE"))

if ENVIRONMENT == "Development":
    ALLOWED_HOSTS.append("localhost")
    ALLOWED_HOSTS.append("django")
    ALLOWED_HOSTS.append("127.0.0.1")

    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = "django_amazon_ses.EmailBackend"

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@stg.echosearch.org")

if ENVIRONMENT in ["Production", "Staging"]:
    # The Elastic Load Balancer HTTP health check will use the target
    # instance's private IP address for the Host header.
    #
    # The following steps look up the current instance's private IP address
    # (via the ECS container metadata URI) and add it to the Django
    # ALLOWED_HOSTS configuration so that health checks pass.
    response = requests.get(os.getenv("ECS_CONTAINER_METADATA_URI"))
    if response.ok:
        container = response.json()
        for network in container["Networks"]:
            for addr in network["IPv4Addresses"]:
                ALLOWED_HOSTS.append(addr)
    else:
        raise ImproperlyConfigured("Unable to fetch instance metadata")

# Application definition

INSTALLED_APPS = [
    "whitenoise.runserver_nostatic",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.gis",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
    "rest_framework",
    "rest_framework_gis",
    "storages",
    "watchman",
    "rest_framework.authtoken",
    "api",
    "users",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "spa.middleware.SPAMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "rollbar.contrib.django.middleware.RollbarNotifierMiddleware",
]

ROOT_URLCONF = "echo.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "echo.wsgi.application"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": os.getenv("POSTGRES_DB"),
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("POSTGRES_HOST"),
        "PORT": os.getenv("POSTGRES_PORT"),
    }
}

# Set protocol for sent links like password reset or magic links
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "sesame.backends.ModelBackend",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
}

# set magic link expire time to 1 hour
SESAME_MAX_AGE = 60 * 60
SESAME_TOKEN_NAME = "echo_auth"

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

# Set the django-spa static file storage:
STATICFILES_STORAGE = "spa.storage.SPAStaticFilesStorage"

# Bucket for storing neighborhood photo image files
AWS_S3_PHOTO_BUCKET = os.getenv("AWS_S3_PHOTO_BUCKET", None)

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

WATCHMAN_ERROR_CODE = 503
WATCHMAN_CHECKS = ("watchman.checks.databases",)

# Configure Rollbar
if ENVIRONMENT in ["Production", "Staging"]:
    ROLLBAR = {
        "access_token": os.getenv("ROLLBAR_ACCESS_TOKEN", None),
        "environment": ENVIRONMENT,
        "root": BASE_DIR,
    }
    import rollbar

    rollbar.init(**ROLLBAR)

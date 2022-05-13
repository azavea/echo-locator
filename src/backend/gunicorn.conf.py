import os

bind = ":8085"
accesslog = "-"
errorlog = "-"
workers = 3
loglevel = "Debug"

ENVIRONMENT = os.getenv("DJANGO_ENV", "Development")

if ENVIRONMENT == "Development":
    reload = True
else:
    preload = True

wsgi_app = "echo.wsgi"

FROM quay.io/azavea/django:3.2-python3.10-slim

RUN mkdir -p /usr/local/src/backend
WORKDIR /usr/local/src/backend

COPY requirements.txt /usr/local/src/backend/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/local/src/backend

CMD ["-b :8085", \
    "--workers=2", \
    "--timeout=60", \
    "--access-logfile=-", \
    "--access-logformat=%({X-Forwarded-For}i)s %(h)s %(l)s %(u)s %(t)s \"%(r)s\" %(s)s %(b)s \"%(f)s\" \"%(a)s\"", \
    "--error-logfile=-", \
    "--log-level=info", \
    "--capture-output", \
    "echo.wsgi"]

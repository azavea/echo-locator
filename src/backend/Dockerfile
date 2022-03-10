FROM quay.io/azavea/django:3.2-python3.9-slim

RUN mkdir -p /usr/local/src/backend
WORKDIR /usr/local/src/backend

COPY requirements.txt /usr/local/src/backend/
RUN set -ex \
    && buildDeps=" \
    build-essential \
    " \
    && deps=" \
    postgresql-client-13 \
    " \
    && apt-get update && apt-get install -y $buildDeps $deps --no-install-recommends \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y --auto-remove $buildDeps

COPY . /usr/local/src/backend

CMD ["-b :8085", \
    "--workers=1", \
    "--timeout=60", \
    "--access-logfile=-", \
    "--access-logformat=%({X-Forwarded-For}i)s %(h)s %(l)s %(u)s %(t)s \"%(r)s\" %(s)s %(b)s \"%(f)s\" \"%(a)s\"", \
    "--error-logfile=-", \
    "--log-level=info", \
    "--capture-output", \
    "echo.wsgi"]

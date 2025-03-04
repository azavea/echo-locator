FROM python:3.7-slim-buster

RUN mkdir -p /usr/local/src/backend
WORKDIR /usr/local/src/backend

COPY ./src/backend/requirements.txt /tmp/

# Install GPG for Postgres
RUN set -ex \
      && buildDeps=" \
            build-essential \
            libpq-dev \
            git-core \
            libssl-dev \
      " \
      && deps=" \
            gdal-bin \
            gettext \
            postgresql-client-11 \
      " \
      && apt-get update && apt-get install -y $buildDeps $deps --no-install-recommends \
      && pip install --no-cache-dir -r /tmp/requirements.txt \
      && apt-get purge -y --auto-remove $buildDeps \
      && rm -rf /tmp/requirements.txt /var/lib/apt/lists/*

ENTRYPOINT ["/usr/local/bin/gunicorn"]

COPY ./src/backend /usr/local/src/backend
COPY ./src/frontend/build /usr/local/src/backend/static

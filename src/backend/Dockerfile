FROM python:3.13-slim-bookworm

# Set DEBIAN_FRONTEND to noninteractive to avoid prompts during build
ENV DEBIAN_FRONTEND=noninteractive
# Ensures Python output is unbuffered
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /usr/local/src/backend
WORKDIR /usr/local/src/backend

COPY ./src/backend/requirements.txt /tmp/

# Install dependencies, including adding the PostgreSQL repo for client v17
RUN set -ex \
      # Define build-time dependencies, INCLUDING tools needed to add the PG repo
      && buildDeps=" \
            build-essential \
            libpq-dev \
            git-core \
            libssl-dev \
            gnupg \
            wget \
            lsb-release \
      " \
      # Define runtime dependencies (postgresql-client-17 is listed here)
      && deps=" \
            gdal-bin \
            gettext \
            postgresql-client-17 \
      " \
      # --- Steps to add PostgreSQL Apt Repository ---
      # 1. Update apt lists for initial installations
      && apt-get update \
      # 2. Install build dependencies (including repo tools) FIRST
      && apt-get install -y $buildDeps --no-install-recommends \
      # 3. Add the PostgreSQL official key
      && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg \
      # 4. Add the PostgreSQL repository source, using the key for verification
      && echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list > /dev/null \
      # 5. Update apt lists AGAIN to read the new repository
      && apt-get update \
      # --- End PostgreSQL Repo Steps ---
      \
      # 6. Install runtime dependencies (postgresql-client-17 should now be found)
      && apt-get install -y $deps --no-install-recommends \
      # 7. Install Python packages
      && pip install --no-cache-dir -r /tmp/requirements.txt \
      # 8. Clean up: Remove build dependencies and apt cache/lists
      && apt-get purge -y --auto-remove $buildDeps \
      && apt-get clean \
      && rm -rf /tmp/requirements.txt /var/lib/apt/lists/*

# Optional: Verify psql version during build to confirm success
RUN psql --version

# Copy Django project source code
COPY ./src/backend /usr/local/src/backend

ENTRYPOINT ["/usr/local/bin/gunicorn"]
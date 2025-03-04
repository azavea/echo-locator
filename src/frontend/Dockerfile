FROM node:12-slim

# Update debian stretch repositories
# Fixes upstream dependency of the node:12-slim base image
# Can likely be removed on higher version of Node.
RUN sed -i -e 's/deb.debian.org/archive.debian.org/g' \
    -e 's|security.debian.org|archive.debian.org/|g' \
    -e '/stretch-updates/d' /etc/apt/sources.list

# Install git for packages on GitHub
RUN set -ex; \
  apt-get update && \
  apt-get install -y git

COPY . /usr/local/src
WORKDIR /usr/local/src

RUN yarn install --frozen-lockfile

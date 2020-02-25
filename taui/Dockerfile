FROM node:12-slim

# Install git for packages on GitHub
RUN set -ex; \
  apt-get update && \
        apt-get install -y git

COPY . /usr/local/src
WORKDIR /usr/local/src

RUN yarn install

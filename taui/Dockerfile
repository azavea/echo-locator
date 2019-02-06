FROM node:8-slim

RUN set -ex; \
  apt-get update && \
        apt-get install -y git

COPY . /usr/local/src
WORKDIR /usr/local/src

RUN yarn install

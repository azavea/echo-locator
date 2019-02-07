FROM node:8-slim

# Install git for packages on GitHub
RUN set -ex; \
  apt-get update && \
        apt-get install -y git

# Install Amplify CLI globally
npm install -g @aws-amplify/cli

COPY . /usr/local/src
WORKDIR /usr/local/src

RUN yarn install

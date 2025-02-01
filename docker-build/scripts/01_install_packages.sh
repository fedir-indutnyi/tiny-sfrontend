#!/bin/sh -e

if [ $DEBUG = "true" ]; then
  set -x
fi

# install dependencies
apk update
apk add --virtual build-deps make gcc linux-headers g++ python3
apk add dumb-init


# installing global npm of latest version and global angular
npm install -g npm@10.9.0
npm install -g @angular/cli@18 --force

# installing npm packages
npm install --force


npm run build:${NODE_ENV}

# remove build packages
apk del build-deps

# remove git repo and root cache
rm -rf /tmp/* /root/.cache /var/cache/apk/*

# remove python cache files
find /usr/ /var/ \( -name "*.pyc" -o -name "__pycache__" \) -delete

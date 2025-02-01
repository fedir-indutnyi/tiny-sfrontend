#!/bin/sh
set -e

if [ $DEBUG = "true" ]; then
  set -x
fi

getent group $GROUP || addgroup -g $GID $GROUP
getent passwd $USERNAME || adduser -u $UID -S $USERNAME -s /bin/sh -G $GROUP

chown -R $UID:$GID /usr/app
apk add su-exec

# Run command with node if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- exec su-exec $USERNAME node "$@"
fi

exec su-exec $USERNAME "$@"
#!/usr/bin/env bash

set -e

if [ -n "${BACKEND_URL}" ]; then
  perl -pi -e "s#http://localhost:8080#$BACKEND_URL#g" /home/node/dist/*.js
fi

if [[ $@ == nginx* ]]; then
  exec $@
else
  USER=node
  HOME=/home/node
  chpst -u node $@
fi

#!/usr/bin/env bash
set -e
dockerize -wait tcp://mongo:27017 -timeout 60s &> /dev/null
mongorestore -h mongo:27017 --drop -d aviation -c projects /app/test-data/projects.bson &> /dev/null
dockerize -wait tcp://backend:8080 -timeout 60s &> /dev/null
sleep 1
exec $@
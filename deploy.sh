#!/bin/bash
# Remove the old environment and build a new updated one

git reset --hard
git pull

docker-compose down
docker-compose rm -f
docker-compose build
docker-compose up -d

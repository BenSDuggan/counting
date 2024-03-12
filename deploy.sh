#!/bin/bash
# Remove the old environment and build a new updated one
# This script will preserve the current docker-compose.yml file

cp docker-compose.yml ~/abcdefg.tmp

git reset --hard
git pull

cp ~/abcdefg.tmp ./docker-compose.yml

chmod +x deploy.sh


docker-compose down
docker-compose rm -f
docker-compose build
docker-compose up -d

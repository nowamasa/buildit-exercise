#!/usr/bin/env bash

# This script builds the docker image for the weather app and runs in a container
#  bash build-and-run-docker-image.sh <host-port-number>
#  e.g.
# bash build-and-run-docker-image.sh 8088
# can then access running container at <docker-machine ip address>:8088

#  <host-port-number> defaults to 80, access running container at <docker-machine ip address>:80

# set -ex

GREEN='\033[0;32m'
NC='\033[0m' # No Color

imageid=weather-web-app
containerid=weather-web-app
hostport=80

# Parameter $1 allows you to specify a host port that will map to the container's express port 3000
if [[ "$1" != "" ]]; then
    hostport=$1
fi

# clean up any images or containers from a previous run of this script
docker kill ${containerid} || true;
docker rm ${containerid} || true;
docker rmi ${imageid} || true;

# build docker image ()
docker build -t ${imageid} .

# run the image as a docker container
docker run --name ${containerid} -p ${hostport}:3000 -d ${imageid}

printf "\n${GREEN}Container ${containerid} now running on docker machine host port ${hostport} ${NC}\n\n"
printf "To get the ip address of your docker machine run docker-machine ip <docker machine name> \n"
printf "e.g. if you are running the default docker run  docker-machine ip default \n\n"

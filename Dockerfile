FROM node:20-alpine3.18 as base

# Build Client
RUN mkdir -p /home/node/app/client && chown -R node:node /home/node/app/client

WORKDIR /home/node/app/client

COPY client/package.json .
COPY client/src src
COPY client/public public
COPY client/tsconfig.json .
#COPY client/build build

RUN npm i

RUN npm run build

# Build Server
RUN mkdir -p /home/node/app/server && chown -R node:node /home/node/app/server

WORKDIR /home/node/app/server

COPY server/package.json .
COPY server/src src
COPY server/tsconfig.json .

RUN npm i

RUN npm run build




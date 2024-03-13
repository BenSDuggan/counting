#!/bin/bash
# Build the production code

# Build Client
cd client
npm i
npm run build
cd ..

# Build Server
cd server
npm i
npm run build


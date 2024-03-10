# Server

The server side code is primarily designed to be an API for the React frontend. It also hosts the frontend in a production environment.

## Install

Run `npm i` from the [server](/server) directory.

Originally set up using: <https://khalilstemmler.com/blogs/typescript/node-starter-project/>

## Commands

* Development environment: `npm run dev`
* Build: `npm run build`
* Start production: `npm run start`

## Endpoints

* `/api/weight`: Used to manage the persons weight progress
* `/api/food`: Access manually entered foods, or foods previously pulled/cached from Open Food Facts
* `/api/product`: Get a food from the Open Food Facts API
* `/api/meal`: Update a meal within a given day
* `/api/day`: Get and manage the meals, calories, and macronutrients for a given day




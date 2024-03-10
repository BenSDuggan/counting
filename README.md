# Calories/Weight Counting

***Still in early development***

I built this one because the majority of the other ones weren't free or were missing some features.

## Development environment

Set the following environment variables:

```
export COUNTING_PROD=false
export COUNTING_PORT=4010
export DB_HOST=<DATABASE_ADDRESS>
export DB_USER=<DATABASE_USERNAME>
export DB_PASS=<DATABASE_PASSWORD>
```

## Features (MVP)

- [ ] Weights
    - [x] Make data structure
    - [x] Add/edit/remove weights
    - [x] View weights in table
    - [ ] View weights on graph
- [ ] Foods
    - [x] Make data structure
    - [x] Add/edit/remove foods
    - [ ] Search foods
    - [x] Food manager with table to view foods and make changes
- [ ] Days
    - [ ] Calory and macro progress viewer
    - [ ] View old days
    - [x] View meal cards
    - [x] Add/edit/remove meals for a given day
    - [x] Add exercise 
- [ ] Products
    - [x] Search OpenFoodFacts database by barcode
    - [ ] Search OpenFoodFacts by product name
    - [ ] Scan QR code and search `Products`
    - [ ] Use our DB for products
- [ ] Meal Picker
    - [x] View meals, change quantities, remove meal
    - [x] View `Foods`
    - [x] View `Products` and search for them
    - [x] Show `Recent` `foods` and `products`
    - [ ] Add `Products` images
- [ ] Settings
    - [ ] Create settings page
    - [ ] Start weight and end weight (saved and visible on graph)
    - [ ] Set calories and macros 
- [ ] Deploy
    - [x] Create working docker image
    - [ ] Create script to build nightly

## Bugs

- [ ] `food_api.get_food_api` and `food_api.get_food_recent_api` both return the previous item when `page >= 2`

## Docker

* Build docker image `docker-compose build`
* Run production image `docker-compose up -d`

Built using guides from [Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker#step-3-writing-the-dockerfile) and [Dev.to](https://dev.to/dariansampare/setting-up-docker-typescript-node-hot-reloading-code-changes-in-a-running-container-2b2f).


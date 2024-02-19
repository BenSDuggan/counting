# Server

## Install and Run

* Originally set up using: <https://khalilstemmler.com/blogs/typescript/node-starter-project/>
* Run dev: `npm run start:dev


## Project structure
```
.
├── common                 			# Contains scrips needed by most files including utils and logging
├── decoder                         # Decodes STT output from call 
├── routes          				# API script
├── types                           # Type definitions
├── calls.ts                        # Watches for new calls and processes them
├── index.ts          				# Entry point
└── web.ts           				# Sets up web server and API
```

## Components

* `Weights`
* `Days`: calories in and out for a given day
* `Meal`: The `Food`s and `Product`s consumed for a given meal
    * Types: `Breakfast`, `Lunch`, `Dinner`, `Snack`, `Desert`
* `Food`: Manually entered foods
* `Products`: Copy of the [OpenFoodFacts](https://world.openfoodfacts.org/) database

## Food information needed

* Name (`product_name`)
* Description
* Servings (`quantity`)
* Calories (`nutriments.energy_value`)
* Carbs (`carbohydrates_value`)
* Fat (`fat_value`)
* Protein (`proteins_value`)
* Photo

## ToDo

[x] Quantity
[ ] Make calory/macro chart render when we go over
[ ]



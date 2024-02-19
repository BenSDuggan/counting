# Set up and run operations on database

## Database

1. Create database named `counting`
2. Create collections named `weight`,  `food`, `product`, `day`
3. `db.createUser({user: "loser", pwd: passwordPrompt(), roles: [ "readWrite" ]})`


## Create Products page

Run `npx ts-node ./src/make_product_collection.ts`.

1. Download Products <https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz> and unzip to [data/products]
2. 
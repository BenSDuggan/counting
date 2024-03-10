
import path from 'path';

import bodyParser from 'body-parser'
import express, { Application, Request, Response } from 'express';

import { logger } from './common/logger'
import { config } from './config'

import * as weight_api from './routes/weight_api'
import * as food_api from './routes/food_api'
import * as product_api from './routes/product_api'
import * as meal_api from './routes/meal_api'
import * as day_api from './routes/day_api'

export const app:Application = express();

const PORT:number = Number(config.port);
const API_BASE_URL:string = '/api';
const FRONTEND_URL:string = path.join(__dirname,"../../client/build");

//app.use('/', express.static('../client/build'))
app.use(express.static(FRONTEND_URL));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Get server version
app.get(API_BASE_URL+'/version', (req: Request, res: Response): void => {
    res.status(200).json({"version":"v0.0.1b"})
});


// Weight API
app.get(API_BASE_URL+'/weight/:id/', weight_api.get_weight_id_api);
app.get(API_BASE_URL+'/weight/', weight_api.get_weight_api);
app.post(API_BASE_URL+'/weight/', weight_api.post_weight_api);
app.put(API_BASE_URL+'/weight/', weight_api.put_weight_api);
app.delete(API_BASE_URL+'/weight/:id', weight_api.delete_weight_api);

// Food API
app.get(API_BASE_URL+'/food/recent', food_api.get_food_recent_api);
app.get(API_BASE_URL+'/food/:id/', food_api.get_food_id_api);
app.get(API_BASE_URL+'/food/', food_api.get_food_api);
app.post(API_BASE_URL+'/food/', food_api.post_food_api);
app.put(API_BASE_URL+'/food/', food_api.put_food_api);
app.delete(API_BASE_URL+'/food/:id', food_api.delete_food_api);

app.get(API_BASE_URL+'/product/barcode/:id', product_api.get_product_barcode_id_api);

// Day API
app.get(API_BASE_URL+'/day/:id/', day_api.get_day_id_api);
app.get(API_BASE_URL+'/day/', day_api.get_day_api);
app.post(API_BASE_URL+'/day/', day_api.post_day_api);
app.put(API_BASE_URL+'/day/', day_api.put_day_api);
app.delete(API_BASE_URL+'/day/:id', day_api.delete_day_api);

// Meal API
app.post(API_BASE_URL+'/meal/:did/:type/', meal_api.post_meal_item_api);
app.put(API_BASE_URL+'/meal/:did/:type/', meal_api.put_meal_item_api);
app.delete(API_BASE_URL+'/meal/:did/:type/:fid', meal_api.delete_meal_item_api);

// Handle any other routes by serving the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_URL, "index.html"));
});

app.listen(PORT, (): void => {
    logger.info('Server started on port: ' + PORT);
});

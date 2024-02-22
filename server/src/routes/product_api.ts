"use strict";

import { Response, Request } from "express";
import * as http from 'http'

import { logger } from '../common/logger'
import { epoch } from '../common/utils'
import * as food from '../types/Food'

const NUMBER_RESULTS:number = 10;

export const get_off_product_barcode = async (barcode:string):Promise<food.Food[]> => {
    
    let response = await fetch("https://world.openfoodfacts.org/api/v2/product/"+barcode+".json", {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
    
    let record:any = await response.json();
    
    if(record.status === 1) {
        let product:food.Food = food.new_food();

        product.name = record["product"]["product_name"];
        product.serving = record["product"]["serving_size"];
        product.manual = false;
        product.off_id = barcode;

        product.calories = record["product"]["nutriments"]["energy-kcal"];
        product.fat = record["product"]["nutriments"]["fat"];
        product.carbs = record["product"]["nutriments"]["carbohydrates"];
        product.protein = record["product"]["nutriments"]["proteins"];

        await food.insert_food(product);

        return [product];
    }
    else {
        return []
    }
}


/**
 * Get specific products by barcode
 * @route GET /api/product/barcode/:id
 */
export const get_product_barcode_id_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    food.get_food({"off_id":id}).then((result) => {
        if(result.length === 1) {
            food.update_used_time(result[0].fid);
            result[0].last_used = new Date().toISOString();

            return result
        }
        else if(result.length > 1) {
            logger.warn("product_api.get_product_barcode_id_api: More than one product by barcode found in `foods`.");

            food.update_used_time(result[0].fid);
            result[0].last_used = new Date().toISOString();
            return [result[0]]
        }
        else {
            return get_off_product_barcode(id);
        }
    }).then((result) => {
        if(result.length == 1) {
            res.status(200).json({"successful":true, "data":result[0]});
        }
        else {
            res.status(404).json({"successful":true, "data":result}).end();
        }
    }).catch((err) => {
        logger.error("food_api: could not fetch food from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


"use strict";

import { Response, Request } from "express";

import { logger } from '../common/logger'
import { epoch } from '../common/utils'
import * as food from '../types/Food'

const NUMBER_RESULTS:number = 10;

/**
 * Get many food records. Further refine by giving dates and page number
 * @route GET /api/food
 */
export const get_food_api = (req: Request, res: Response) => {
    let page:number = Number(req.query.page) ?? 0;
    let max_date:string = new Date(Number(req.query.max_date ?? epoch())).toISOString();
    let min_date:string = new Date(Number(req.query.min_date ?? (1))).toISOString();

    let term = {};
    // Filter by date
    term = {$and:[{"timestamp": {$gte:min_date}}, {"timestamp":{$lte:max_date}}]};

    food.get_food(term, NUMBER_RESULTS, page).then((result) => {
        res.status(200).json({"successful":true, "data":result});
    }).catch((err) => {
        logger.error("food_api: could not fetch food from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Get specific food record
 * @route GET /api/food/:id
 */
export const get_food_id_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    food.get_food({"fid":id}).then((result) => {
        if(result.length > 0) 
            res.status(200).json({"successful":true, "data":result});
        else
            res.status(404).json({"successful":true, "data":result}).end();
    }).catch((err) => {
        logger.error("food_api: could not fetch food from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

/**
 * Get specific food record
 * @route POST /api/food/
 */
export const post_food_api = (req: Request, res: Response) => {
    let entry:food.Food = req.body;
    
    food.insert_food(entry).then((result) => { 
        if(result) 
            res.status(200).json({"successful":result, "data":""});
        else 
            res.status(400).json({"successful":result, "data":""}).end();
    }).catch((err) => {
        logger.error("food_api: could not fetch food from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

/**
 * Update food
 * @route PUT /api/food/
 */
export const put_food_api = (req: Request, res: Response) => {
    if(!req.body.hasOwnProperty("fid")) {
        res.status(400).json({"successful":false, "data":"An FID must be included in the body."}).end();
        return
    }
    
    food.update_food(req.body.fid, req.body).then((result) => { 
        if(result) 
            res.status(200).json({"successful":result, "data":""})
        else 
            res.status(400).end();
    }).catch((err) => {
        logger.error("food_api: could not fetch food from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Remove food
 * @route DELETE /api/food/
 */
export const delete_food_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    food.delete_food(id).then((result) => { 
        res.status(200).json({"successful":result, "data":""});
    }).catch((err) => {
        logger.error("food_api: could not delete food from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

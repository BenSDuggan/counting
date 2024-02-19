"use strict";

import { Response, Request } from "express";

import { logger } from '../common/logger'
import { epoch } from '../common/utils'
import * as food from '../types/Food'
import * as day from '../types/Day'
import * as meal from '../types/Meal'

const NUMBER_RESULTS:number = 10;

/**
 * Get many day records. Further refine by giving dates and page number
 * @route GET /api/day
 */
export const get_day_api = (req: Request, res: Response) => {
    let page:number = Number(req.query.page ?? 0);
    let max_date:string = new Date(Number(req.query.max_date ?? epoch())).toISOString();
    let min_date:string = new Date(Number(req.query.min_date ?? (1))).toISOString();
    let required:boolean = Boolean(req.query.required) ?? false;

    let term = {};
    // Filter by date
    term = {$and:[{"timestamp": {$gte:min_date}}, {"timestamp":{$lte:max_date}}]};

    day.get_day(term, NUMBER_RESULTS, page).then((result) => {
        if(result.length == 1) {
            res.status(200).json({"successful":true, "data":result});
        }
        else if(result.length > 1) {
            res.status(201).json({"successful":true, "data":result});
        }
        else if(result.length == 0 && required) {
            let d:day.Day = day.new_day();
            day.insert_day(d).then((result2) => {
                if(result2)
                    res.status(200).json({"successful":true, "data":d});
                else {
                    logger.error("day_api: could not insert new day");
                    res.status(500).json({"successful":false, "data":"could not insert new day"}).end();
                }
            })
        }
        else {
            res.status(500).json({"successful":false, "data":"Could not find record. Did you make `required`?"}).end();
        }
    }).catch((err) => {
        logger.error("day_api: could not fetch day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Get specific day record
 * @route GET /api/day/:id
 */
export const get_day_id_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    day.get_day({"did":id}).then((result) => {
        if(result.length > 0) 
            res.status(200).json({"successful":true, "data":result});
        else
            res.status(404).json({"successful":true, "data":result}).end();
    }).catch((err) => {
        logger.error("day_api: could not fetch day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

/**
 * Add a specific meal item to a meal
 * @route POST /api/meal/mid/type
 */
export const post_meal_item_api = (req: Request, res: Response) => {
    let entry:food.Food = req.body;

    let id:string = req.params.did;
    let type:"breakfast"|"lunch"|"dinner"|"snack"|"dessert" = req.params.type as "breakfast"|"lunch"|"dinner"|"snack"|"dessert";

    day.get_day({"did":id}).then((result) => {
        if(result.length === 1) {
            let match:food.Food[] = result[0][type].items.filter((food:food.Food) => food.fid === entry.fid);

            if(match.length > 0) {
                result[0][type].items = result[0][type].items.map((food:food.Food) => {
                    if(food.fid === entry.fid)
                        food.quantity += entry.quantity
                        
                    return food;
                })
            }
            else {
                result[0][type].items.push(entry);
            }

            result[0] = day.total_nutrients(result[0]);

            return day.update_day(result[0].did, result[0])
        }
        else
            res.status(404).json({"successful":true, "data":result}).end();
    }).then((result) => {
        if(result) 
            res.status(200).json({"successful":result, "data":""});
        else 
            res.status(400).json({"successful":result, "data":""}).end();
    }).catch((err) => {
        logger.error("day_api: could not fetch day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

/**
 * Update meal
 * @route PUT /api/meal/mid/type
 */
export const put_meal_item_api = (req: Request, res: Response) => {
    let entry:food.Food = req.body;

    let id:string = req.params.did;
    let type:"breakfast"|"lunch"|"dinner"|"snack"|"dessert" = req.params.type as "breakfast"|"lunch"|"dinner"|"snack"|"dessert";

    day.get_day({"did":id}).then((result) => {
        if(result.length === 1) {
            let match:food.Food[] = result[0][type].items.filter((food:food.Food) => food.fid === entry.fid);

            // If the food item is in the database, combine the quantity and update everything else
            if(match.length > 0) {
                result[0][type].items = result[0][type].items.map((food:food.Food) => {
                    if(food.fid === entry.fid) {
                        food = entry;
                    }
                        
                    return food;
                })
            }
            else {
                result[0][type].items.push(entry);
            }

            result[0] = day.total_nutrients(result[0]);

            return day.update_day(result[0].did, result[0])
        }
        else
            res.status(404).json({"successful":true, "data":result}).end();
    }).then((result) => {
        if(result) 
            res.status(200).json({"successful":result, "data":""});
        else 
            res.status(400).json({"successful":result, "data":""}).end();
    }).catch((err) => {
        logger.error("day_api: could not fetch day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Remove meal
 * @route DELETE /api/meal/mid/type/fid
 */
export const delete_meal_item_api = (req: Request, res: Response) => {
    let did:string = req.params.did;
    let type:"breakfast"|"lunch"|"dinner"|"snack"|"dessert" = req.params.type as "breakfast"|"lunch"|"dinner"|"snack"|"dessert";
    let fid:string = req.params.fid

    day.get_day({"did":did}).then((result) => {
        if(result.length === 1) {
            result[0][type].items = result[0][type].items.filter((food:food.Food) => food.fid !== fid);

            result[0] = day.total_nutrients(result[0]);

            return day.update_day(result[0].did, result[0])
        }
        else
            res.status(404).json({"successful":true, "data":result}).end();
    }).then((result) => {
        if(result) 
            res.status(200).json({"successful":result, "data":""});
        else 
            res.status(400).json({"successful":result, "data":""}).end();
    }).catch((err) => {
        logger.error("day_api: could not fetch day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

"use strict";

import { Response, Request } from "express";

import { logger } from '../common/logger'
import { epoch } from '../common/utils'
import * as day from '../types/Day'

const NUMBER_RESULTS:number = 10;

/**
 * Get many day records. Further refine by giving dates and page number
 * @route GET /api/day
 */
export const get_day_api = (req: Request, res: Response) => {
    let page:number = Number(req.query.page) ?? 0;
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
        else {
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
 * Get specific day record
 * @route POST /api/day/
 */
export const post_day_api = (req: Request, res: Response) => {
    let entry:day.Day = req.body;
    entry = day.total_nutrients(entry);
    
    day.insert_day(entry).then((result) => { 
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
 * Update day
 * @route PUT /api/day/
 */
export const put_day_api = (req: Request, res: Response) => {
    if(!req.body.hasOwnProperty("did")) {
        res.status(400).json({"successful":false, "data":"A DID must be included in the body."}).end();
        return
    }

    let entry:day.Day = req.body;
    entry = day.total_nutrients(entry);
    
    day.update_day(req.body.did, entry).then((result) => { 
        if(result) 
            res.status(200).json({"successful":result, "data":""})
        else 
            res.status(400).end();
    }).catch((err) => {
        logger.error("day_api: could not fetch day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Remove day
 * @route DELETE /api/day/
 */
export const delete_day_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    day.delete_day(id).then((result) => { 
        res.status(200).json({"successful":result, "data":""});
    }).catch((err) => {
        logger.error("day_api: could not delete day from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

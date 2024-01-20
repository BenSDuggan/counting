"use strict";

import { Response, Request } from "express";

import { logger } from '../common/logger'
import { epoch } from '../common/utils'
import * as weight from '../types/Weight'

const NUMBER_RESULTS:number = 10;

/**
 * Get many weight records. Further refine by giving dates and page number
 * @route GET /api/weight
 */
export const get_weight_api = (req: Request, res: Response) => {
    let page:number = Number(req.query.page) ?? 0;
    //let max_date:string = new Date(Number(req.query.max_date ?? epoch())).toISOString();
    //let min_date:string = new Date(Number(req.query.min_date ?? epoch()-(7*24*60*60*1000))).toISOString();

    let term = {};
    // Filter by date
    //term = {$and:[{"timestamp": {$gte:min_date}}, {"timestamp":{$lte:max_date}}]};

    weight.get_weight(term, NUMBER_RESULTS, page).then((result) => {
        res.status(200).json({"successful":true, "data":result});
    }).catch((err) => {
        logger.error("weight_api: could not fetch weight from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Get specific weight record
 * @route GET /api/weight/:id
 */
export const get_weight_id_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    weight.get_weight({"wid":id}).then((result) => {
        if(result.length > 0) 
            res.status(200).json({"successful":true, "data":result});
        else
            res.status(404).json({"successful":true, "data":result}).end();
    }).catch((err) => {
        logger.error("weights_api: could not fetch weight from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

/**
 * Get specific weight record
 * @route POST /api/weight/
 */
export const post_weight_api = (req: Request, res: Response) => {
    let entry:weight.Weight = req.body;
    
    weight.insert_weight(entry).then((result) => { 
        if(result) 
            res.status(200).json({"successful":result, "data":""});
        else 
            res.status(400).json({"successful":result, "data":""}).end();
    }).catch((err) => {
        logger.error("weight_api: could not fetch weight from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

/**
 * Update weight
 * @route PUT /api/weight/
 */
export const put_weight_api = (req: Request, res: Response) => {
    if(!req.body.hasOwnProperty("wid")) {
        res.status(400).json({"successful":false, "data":"An WID must be included in the body."}).end();
        return
    }
    
    weight.update_weight(req.body.wid, req.body).then((result) => { 
        if(result) 
            res.status(200).json({"successful":result, "data":""})
        else 
            res.status(400).end();
    }).catch((err) => {
        logger.error("weight_api: could not fetch weight from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};


/**
 * Remove weight
 * @route DELETE /api/weight/
 */
export const delete_weight_api = (req: Request, res: Response) => {
    let id:string = req.params.id;

    weight.delete_weight(id).then((result) => { 
        res.status(200).json({"successful":result, "data":""});
    }).catch((err) => {
        logger.error("weight_api: could not delete weight from database. " + err.message);
        res.status(500).json({"successful":false, "data":err.message}).end();
    });
};

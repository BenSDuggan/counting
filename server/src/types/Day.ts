// Manually entered day items


import { v4 as uuidv4 } from 'uuid';
import { 
    type InsertOneResult, 
    type InsertManyResult, 
    type UpdateResult,
    type DeleteResult, 
    type Filter,
    type WithId,
    Document
} from "mongodb"

import { logger } from "../common/logger"
import { client, DATABASE_NAME } from "../database"
import { Meal, new_meal, total_meal_nutrients } from "./Meal"

const collection:string = "day";


export interface Day {
    "did":string, //Day ID
    "description":string, //Meal description
    "calories":number, //Calories in kcal
    "carbs":number, //Carbs in grams
    "fat":number, //Fat in grams
    "protein":number, //Protein in grams
    "cal_expended": number, //Calories expended
    "breakfast":Meal,//breakfast
    "lunch":Meal,//lunch
    "dinner":Meal,//dinner
    "snack":Meal,//snack
    "dessert":Meal,//dessert
    "timestamp":string, //When was meal was entered
}

export const new_day = ():Day => {
    let d:Day = {
        "did":uuidv4(), //Day ID
        "description":"", //Meal description
        "calories":0, //Calories in kcal
        "carbs":0, //Carbs in grams
        "fat":0, //Fat in grams
        "protein":0, //Protein in grams
        "cal_expended": 0, //Calories expended
        "breakfast":new_meal(),//breakfast
        "lunch":new_meal(),//lunch
        "dinner":new_meal(),//dinner
        "snack":new_meal(),//snack
        "dessert":new_meal(),//dessert
        "timestamp":new Date().toISOString(), //When was meal was entered
    };
    d.breakfast.type = "breakfast";
    d.lunch.type = "lunch";
    d.dinner.type = "dinner";
    d.snack.type = "snack";
    d.dessert.type = "dessert";

    return d;
}

export const total_nutrients = (d:Day):Day => {
    let count:number = 0;
    let mismatch:string[] = [];

    // Tally each meals points
    d.breakfast = total_meal_nutrients(d.breakfast);
    d.lunch = total_meal_nutrients(d.lunch);
    d.dinner = total_meal_nutrients(d.dinner);
    d.snack = total_meal_nutrients(d.snack);
    d.dessert = total_meal_nutrients(d.dessert);

    // Calories
    count = d.breakfast.calories;
    count += d.lunch.calories;
    count += d.dinner.calories;
    count += d.snack.calories;
    count += d.dessert.calories;

    if(d.calories != count)
        mismatch.push("calories");
    d.calories = count;

    // fat
    count = d.breakfast.fat;
    count += d.lunch.fat;
    count += d.dinner.fat;
    count += d.snack.fat;
    count += d.dessert.fat;

    if(d.fat != count)
        mismatch.push("fat");
    d.fat = count;

    // carbs
    count = d.breakfast.carbs;
    count += d.lunch.carbs;
    count += d.dinner.carbs;
    count += d.snack.carbs;
    count += d.dessert.carbs;

    if(d.carbs != count)
        mismatch.push("carbs");
    d.carbs = count;

    // protein
    count = d.breakfast.protein;
    count += d.lunch.protein;
    count += d.dinner.protein;
    count += d.snack.protein;
    count += d.dessert.protein;

    if(d.protein != count)
        mismatch.push("protein");
    d.protein = count;

    if(mismatch.length > 0)
        logger.warn("Day.total_nutrients: Meal counted values differ from previous total values for " + 
            mismatch.map((m) => m + " "))

    return d;
}

/* Get day
*
* term (JSON): What values should be used to search for
* page (number): What page to return
*
* Returns: JSON object with the matched terms
*/
export const get_day = async (terms:{}, num_results:number=10, page:number=0):Promise<Day[]> => {
    const cursor = await client
    .db(DATABASE_NAME)
    .collection<Day>(collection)
    .find(terms)
    .sort( { "timestamp":-1 } )
    .skip(num_results*page)
    .limit(num_results);

    return await cursor.toArray();
}

/* Insert a day
*
* entry (Day|Day[]): The new day metadata
*
* Returns: true if added successfully and false otherwise
*/
export const insert_day = async (entry:Day|Day[]): Promise<boolean> => {
    if(Array.isArray(entry)) {
        const result:InsertManyResult = await client.db(DATABASE_NAME).collection<Day>(collection).insertMany(entry);
        
        return result.acknowledged;
    }
    else {
        const result:InsertOneResult = await client.db(DATABASE_NAME).collection<Day>(collection).insertOne(entry);
        
        return result.acknowledged;
    }
}

/* Update an entry the `did` and updated structure
*
* id (string): The ID or list of ID to be removed
* updates (JSON or Call): Full organization or just the updated key-value pairs. If updating an array, the full new array must be included. For example, if adding `c` to `["a", "b"]`, then the value must be `["a", "b", "c"]`.
*
* Returns: true if successfully updated and false otherwise
*/
export const update_day = async (id:string, updates:any): Promise<boolean> => {
    if(updates.hasOwnProperty("_id")) {
        delete updates["_id"]
    }

    const result:UpdateResult = await client.db(DATABASE_NAME).collection<Day>(collection).updateOne(
        {"did":id},
        {$set:updates}
    );

    return result.acknowledged;
}

/* Delete a day
*
* id (string|string[]): The ID or list of ID to be removed
*
* Returns: true if successfully updated and false otherwise
*/
export const delete_day = async(id:string|string[]): Promise<boolean> => {
    if(Array.isArray(id)) {
        if(id.length === 0) return false;

        let filter: { [key: string]: string }[] = id.map((i) => {return {"did":i}});
        let result: DeleteResult = await client.db(DATABASE_NAME).collection<Day>(collection).deleteMany({$or:filter});
        return result.deletedCount == id.length;
    }
    else {
        let result: DeleteResult = await client.db(DATABASE_NAME).collection<Day>(collection).deleteOne({"did": id});
        return result.deletedCount == 1;
    }
}



// Manually entered food items


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

const collection:string = "food";


export interface Food {
    "fid":string, //Weight ID
    "name":string, //Food name
    "description":string, //Food description
    "serving":string, //Food serving
    "calories":number, //Calories in kcal
    "carbs":number, //Carbs in grams
    "fat":number, //Fat in grams
    "protein":number, //Protein in grams
    "photos":string[], // product photos
    "timestamp":string, //When was food was entered
}

export const new_food = ():Food => {
    return {
        "fid":uuidv4(), //Weight ID
        "name":"", //Food name
        "description":"", //Food description
        "serving":"", //Food serving
        "calories":0, //Calories in kcal
        "carbs":0, //Carbs in grams
        "fat":0, //Fat in grams
        "protein":0, //Protein in grams
        "photos":[], // product photos
        "timestamp":new Date().toISOString(), //When was food was entered
    }
}

/* Get food
*
* term (JSON): What values should be used to search for
* page (number): What page to return
*
* Returns: JSON object with the matched terms
*/
export const get_food = async (terms:{}, num_results:number=10, page:number=0):Promise<WithId<Food>[]> => {
    const cursor = await client
    .db(DATABASE_NAME)
    .collection<Food>(collection)
    .find(terms)
    .sort( { "timestamp":-1 } )
    .skip(num_results*page)
    .limit(num_results);

    return await cursor.toArray();
}

/* Insert a food
*
* entry (Food|Food[]): The new food metadata
*
* Returns: true if added successfully and false otherwise
*/
export const insert_food = async (entry:Food|Food[]): Promise<boolean> => {
    if(Array.isArray(entry)) {
        const result:InsertManyResult = await client.db(DATABASE_NAME).collection<Food>(collection).insertMany(entry);
        
        return result.acknowledged;
    }
    else {
        const result:InsertOneResult = await client.db(DATABASE_NAME).collection<Food>(collection).insertOne(entry);
        
        return result.acknowledged;
    }
}

/* Update an entry the `fid` and updated structure
*
* id (string): The ID or list of ID to be removed
* updates (JSON or Call): Full organization or just the updated key-value pairs. If updating an array, the full new array must be included. For example, if adding `c` to `["a", "b"]`, then the value must be `["a", "b", "c"]`.
*
* Returns: true if successfully updated and false otherwise
*/
export const update_food = async (id:string, updates:object): Promise<boolean> => {
    const result:UpdateResult = await client.db(DATABASE_NAME).collection<Food>(collection).updateOne(
        {"fid":id},
        {$set:updates}
    );

    return result.acknowledged;
}

/* Delete a food
*
* id (string|string[]): The ID or list of ID to be removed
*
* Returns: true if successfully updated and false otherwise
*/
export const delete_food = async(id:string|string[]): Promise<boolean> => {
    if(Array.isArray(id)) {
        if(id.length === 0) return false;

        let filter: { [key: string]: string }[] = id.map((i) => {return {"fid":i}});
        let result: DeleteResult = await client.db(DATABASE_NAME).collection<Food>(collection).deleteMany({$or:filter});
        return result.deletedCount == id.length;
    }
    else {
        let result: DeleteResult = await client.db(DATABASE_NAME).collection<Food>(collection).deleteOne({"fid": id});
        return result.deletedCount == 1;
    }
}




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

const collection:string = "weight";


export interface Weight {
    "wid":string, //Weight ID
    "value":number, // Weight (in Pounds)
    "description":string, //Custom description if one is added
    "photos":string[], //Path to photos
    "timestamp":string, //When was the call dispatched
}

export const new_call = ():Weight => {
    return {
        "wid":uuidv4(), //Weight ID
        "value":NaN, // Weight (in Pounds)
        "description":"", //Custom description if one is added
        "photos":[], //Path to photos
        "timestamp":"", //When was the call dispatched
    }
}

/* Get weight
*
* term (JSON): What values should be used to search for
* page (number): What page to return
*
* Returns: JSON object with the matched terms
*/
export const get_weight = async (terms:{}, num_results:number=10, page:number=0):Promise<WithId<Weight>[]> => {
    const cursor = await client
    .db(DATABASE_NAME)
    .collection<Weight>(collection)
    .find(terms)
    .sort( { "timestamp":-1 } )
    .skip(num_results*page)
    .limit(num_results);

    return await cursor.toArray();
}

/* Insert a weight
*
* entry (Call|Call[]): The new call metadata
*
* Returns: true if added successfully and false otherwise
*/
export const insert_weight = async (entry:Weight|Weight[]): Promise<boolean> => {
    if(Array.isArray(entry)) {
        const result:InsertManyResult = await client.db(DATABASE_NAME).collection<Weight>(collection).insertMany(entry);
        
        return result.acknowledged;
    }
    else {
        const result:InsertOneResult = await client.db(DATABASE_NAME).collection<Weight>(collection).insertOne(entry);
        
        return result.acknowledged;
    }
}

/* Update an entry the `wid` and updated structure
*
* id (string): The ID or list of ID to be removed
* updates (JSON or Call): Full organization or just the updated key-value pairs. If updating an array, the full new array must be included. For example, if adding `c` to `["a", "b"]`, then the value must be `["a", "b", "c"]`.
*
* Returns: true if successfully updated and false otherwise
*/
export const update_weight = async (id:string, updates:object): Promise<boolean> => {
    const result:UpdateResult = await client.db(DATABASE_NAME).collection<Weight>(collection).updateOne(
        {"wid":id},
        {$set:updates}
    );

    return result.acknowledged;
}

/* Delete a weight
*
* id (string|string[]): The ID or list of ID to be removed
*
* Returns: true if successfully updated and false otherwise
*/
export const delete_weight = async(id:string|string[]): Promise<boolean> => {
    if(Array.isArray(id)) {
        if(id.length === 0) return false;

        let filter: { [key: string]: string }[] = id.map((i) => {return {"wid":i}});
        let result: DeleteResult = await client.db(DATABASE_NAME).collection<Weight>(collection).deleteMany({$or:filter});
        return result.deletedCount == id.length;
    }
    else {
        let result: DeleteResult = await client.db(DATABASE_NAME).collection<Weight>(collection).deleteOne({"wid": id});
        return result.deletedCount == 1;
    }
}


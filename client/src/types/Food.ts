import { v4 as uuidv4 } from 'uuid';

export interface Food {
    "fid":string, //Weight ID
    "name":string, //Food name
    "description":string, //Food description
    "manual":boolean, //Was the data manually entered
    "serving":string, //Food serving
    "quantity":number, //Number of servings
    "calories":number, //Calories in kcal
    "carbs":number, //Carbs in grams
    "fat":number, //Fat in grams
    "protein":number, //Protein in grams
    "photos":string[], // product photos
    "timestamp":string, //When was food was entered
    "last_used":string, //Last time the food was used
    "off_id":string, //ID from OpenFoodFacts
    "misc":{} //Misc data to include
}

export const new_food = ():Food => {
    return {
        "fid":uuidv4(), //Weight ID
        "name":"", //Food name
        "description":"", //Food description
        "manual":true, //Was the data manually entered
        "serving":"", //Food serving
        "quantity":1, //Number of servings
        "calories":0, //Calories in kcal
        "carbs":0, //Carbs in grams
        "fat":0, //Fat in grams
        "protein":0, //Protein in grams
        "photos":[], // product photos
        "timestamp":new Date().toISOString(), //When was food was entered
        "last_used":new Date().toISOString(),
        "off_id":"", //ID from OpenFoodFacts
        "misc":{} //Misc data to include
    }
}
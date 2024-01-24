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
    "off_id":string, //ID from OpenFoodFacts
    "misc":{} //Misc data to include
}
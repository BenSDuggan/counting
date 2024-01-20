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
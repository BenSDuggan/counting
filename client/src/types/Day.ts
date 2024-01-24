
import { v4 as uuidv4 } from 'uuid';

import { Food } from './Food'

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

export interface Meal {
    "mid":string, //Meal ID
    "type": "breakfast"|"lunch"|"dinner"|"snack"|"dessert", //Which meal
    "description":string, //Meal description
    "calories":number, //Calories in kcal
    "carbs":number, //Carbs in grams
    "fat":number, //Fat in grams
    "protein":number, //Protein in grams
    "items": Food[], //Items eaten in meal
    "timestamp":string, //When was meal was entered
}

export const new_meal = ():Meal => {
    return {
        "mid":uuidv4(), //Meal ID
        "type":"snack", //Which meal: Breakfast, Lunch, Dinner, Snack, Desert
        "description":"", //Meal description
        "calories":0, //Calories in kcal
        "carbs":0, //Carbs in grams
        "fat":0, //Fat in grams
        "protein":0, //Protein in grams
        "items": [], //Items eaten in meal
        "timestamp":new Date().toISOString(), //When was meal was entered
    }
}
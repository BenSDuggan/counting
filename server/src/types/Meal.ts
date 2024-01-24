// Manually entered meal items


import { v4 as uuidv4 } from 'uuid';

import { logger } from "../common/logger"
import { Food } from "./Food"

const collection:string = "meal";


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

export const total_meal_nutrients = (m:Meal):Meal => {
    // Calories
    m.calories = 0;
    m.items.map(i => m.calories += i.calories * i.quantity);

    // Fat
    m.fat = 0;
    m.items.map(i => m.fat += i.fat * i.quantity);

    // Carbs
    m.carbs = 0;
    m.items.map(i => m.carbs += i.carbs * i.quantity);

    // Protein
    m.protein = 0;
    m.items.map(i => m.protein += i.protein * i.quantity);

    return m;
}

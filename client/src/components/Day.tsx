
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import MealItems from './MealItems'
import { type Food as Food_Type } from '../types/Food';
import { new_day, Day as Day_Type, Meal as Meal_Type } from '../types/Day'

const Day = ({}) => {
    const [day, setDay] = useState(new_day() as Day_Type);

    async function get_day(ignore:boolean) {
        const currentDate = new Date();
        const beginningOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
        const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);

        let params = '?required=true';
        params += '&min_date=' + beginningOfDay.valueOf();
        params += '&max_date=' + endOfDay.valueOf();

        fetch("api/day"+params, {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            if(!ignore) {
                console.log(record)

                if(record.data.length == 1)
                    setDay(record.data[0]);
                else
                    alert("Could not get the data for today.")
            }
        })
        .catch((error) => console.error(error));
    }

    let update_meal_items = async (meal:Meal_Type, reload:boolean):Promise<void> => {
        // TODO: Update day with meals
        let d:Day_Type = {...day};
        d[meal.type] = meal;

        fetch("/api/day/", { 
            method: "put",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            console.log(record);
            if(record.successful)
                window.location.reload();
            else
                alert("Could not update item")
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        });
    }

    useEffect(() => {
        let ignore = false;

        get_day(ignore);

        return () => {ignore = true;}
      }, []);

    return (
        <Container className="main" fluid="lg">
            <h2>{new Date(day.timestamp ?? 1).toDateString()}</h2>
            <Container>
                Calories {day.calories}; Fat {day.fat}; Carbs {day.carbs}; Protein {day.protein}
            </Container>
            <MealItems meal={day.breakfast} updateMeal={update_meal_items} />
            
        </Container>
    )
}

export default Day;
//<MealItems meal={day.breakfast} />
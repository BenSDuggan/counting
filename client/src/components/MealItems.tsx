
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import IntakeModal from './IntakeModal'
import MealItem  from './MealItem';
import { Food, type Food as Food_Type } from '../types/Food';
import { type Meal as Meal_Type } from '../types/Day';

interface IProps {
    meal:Meal_Type,
    updateMeal:(meal:Meal_Type, reload:boolean)=>Promise<void>
}

const MealItems = (props:IProps) => {
    let chunks:Food_Type[][] = [];
    for(let i=0; i<props.meal.items.length; i+=3) {
        chunks.push(props.meal.items.slice(i, i + 3));
    }

    let set_food_items = (foods:Food_Type[]) => {
        let m:Meal_Type = {...props.meal};
        m.items = foods;

        props.updateMeal(m, true);
    }

    let delete_food_item = (fid:string) => {
        let m:Meal_Type = {...props.meal};
        m.items = m.items.filter((f:Food_Type) => f.fid !== fid)

        props.updateMeal(m, true);
    }

    return (
        <Container>
            <h3>{props.meal.type.toLocaleUpperCase()}</h3>
            <IntakeModal 
                    meal={props.meal}
                    saveItems={set_food_items} />
                
            {chunks.map((chunk:Food_Type[], index:number) =>
            <Row key={props.meal.type+index}>
                {chunk.map((f:Food_Type) => 
                <Col md={4}>
                    <MealItem
                        key={f.fid}
                        food={f}
                        deleteFood={delete_food_item} />
                </Col>)}
            </Row>)}
        </Container>
    )
}

export default MealItems;
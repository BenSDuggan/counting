
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

    let delete_food_item = (fid:string) => {
        let m:Meal_Type = {...props.meal};
        m.items = m.items.filter((f:Food_Type) => f.fid !== fid)

        props.updateMeal(m, true);
    }

    return (
        <Container>
                <Row>
                    <Col><h3>Breakfast</h3></Col> 
                    <Col><IntakeModal meal={props.meal} /></Col>
                </Row>
                {props.meal.items.map((f:Food_Type) => 
                    <MealItem 
                        key={f.fid} 
                        food={f}
                        deleteFood={delete_food_item} />)}
            </Container>
    )
}

export default MealItems;
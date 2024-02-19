
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import MealItem  from './MealItem';
import { Food, type Food as Food_Type } from '../types/Food';
import { type Meal as Meal_Type } from '../types/Day';

interface IProps {
    meal:Meal_Type,
    did:string
}

const MealItems = (props:IProps) => {
    let chunks:Food_Type[][] = [];
    for(let i=0; i<props.meal.items.length; i+=3) {
        chunks.push(props.meal.items.slice(i, i + 3));
    }

    return (
        <Container>
            <div>
                <h3 style={{"display":"inline"}}>{props.meal.type.toLocaleUpperCase()}</h3>
                <a href={"/mealedit?type="+props.meal.type}>Edit</a>
            </div>
                
            {chunks.map((chunk:Food_Type[], index:number) =>
            <Row key={props.meal.type+index}>
                {chunk.map((f:Food_Type) => 
                <Col key={"item-row_"+f.fid} md={4}>
                    <MealItem
                        key={f.fid}
                        food={f}
                        did={props.did}
                        type={props.meal.type}
                        new_card={false} />
                </Col>)}
            </Row>)}
        </Container>
    )
}

export default MealItems;

/*
import IntakeModal from './IntakeModal'

<IntakeModal 
    key={props.meal.type}
    meal={props.meal}
    saveItems={set_food_items} />
*/
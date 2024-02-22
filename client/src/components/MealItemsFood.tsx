
// ToDo: Implement delete item to card
// ToDo: Implement change serving

import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { v4 as uuidv4 } from 'uuid';

import FoodNewModal from './FoodNewModal'
import { type Food as Food_Type } from '../types/Food';

interface IProps {
    food:Food_Type
}

export const MealItemFood = (props:IProps) => {
    const [quantity, setQuantity] = useState(1);

    let remove_food_item = () => {
        fetch("api/food/"+props.food.fid, { 
            method: 'delete',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            console.log(record);
            window.location.reload();
        })
        .catch((error) => console.error(error));
    }

    useEffect(() => {
        setQuantity(props.food.quantity);
    }, []);


    return (
            <Card 
                border={props.food.manual ? "success" : "warning"}
                key={props.food.fid+uuidv4()}>
                <Card.Body>
                    <Card.Title>{props.food.name}</Card.Title>
                    <Card.Subtitle>{props.food.description}</Card.Subtitle>
                    <div>{props.food.serving} | Calories: {props.food.calories*quantity} kcal</div>
                    <div>
                        <span>Fat: {props.food.fat*quantity} g | </span>
                        <span>Carbs: {props.food.carbs*quantity} g | </span>
                        <span>Protein: {props.food.protein*quantity} g</span>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Card.Link onClick={(e) => {e.preventDefault();}}><FoodNewModal food={props.food} /></Card.Link>
                    <Card.Link onClick={(e) => {e.preventDefault(); remove_food_item();}}>Remove</Card.Link>
                </Card.Footer>
            </Card>
    )
}


interface IsProps {
    foods:Food_Type[],
}

const MealItemsFood = (props:IsProps) => {
    let chunks:Food_Type[][] = [];
    for(let i=0; i<props.foods.length; i+=3) {
        chunks.push(props.foods.slice(i, i + 3));
    }

    return (
        <Container>
            {chunks.map((chunk:Food_Type[], index:number) =>
            <Row key={"food"+index}>
                {chunk.map((f:Food_Type) => 
                <Col key={"item-row_"+f.fid} md={4}>
                    <MealItemFood
                        key={f.fid}
                        food={f} />
                </Col>)}
            </Row>)}
        </Container>
    )
}

export default MealItemsFood;
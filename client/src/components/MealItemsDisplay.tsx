
// ToDo: Implement delete item to card
// ToDo: Implement change serving

import {useState} from "react";

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { v4 as uuidv4 } from 'uuid';

import { type Food as Food_Type } from '../types/Food';

interface IProps {
    food:Food_Type
}

export const MealItemDisplay = (props:IProps) => {
    const [quantity, setQuantity] = useState(1);

    return (
            <Card 
                border={props.food.manual ? "success" : "warning"}
                key={props.food.fid+uuidv4()}>
                <Card.Body>
                    <Card.Title>{props.food.name}</Card.Title>
                    <Card.Subtitle>
                        <input 
                            type="number" 
                            value={Number(quantity)}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={{"width": "7ch"}}
                            ></input> 
                         x {props.food.serving} | Calories: {props.food.calories*quantity} kcal</Card.Subtitle>
                    <div>
                        <span>Fat: {props.food.fat*quantity} g | </span>
                        <span>Carbs: {props.food.carbs*quantity} g | </span>
                        <span>Protein: {props.food.protein*quantity} g</span>
                    </div>
                </Card.Body>
            </Card>
    )
}


interface IsProps {
    foods:Food_Type[],
}

const MealItemsDisplay = (props:IsProps) => {
    let chunks:Food_Type[][] = [];
    for(let i=0; i<props.foods.length; i+=3) {
        chunks.push(props.foods.slice(i, i + 3));
    }

    return (
        <Container >
            {chunks.map((chunk:Food_Type[], index:number) =>
            <Row key={"display-"+index}>
                {chunk.map((f:Food_Type) => 
                <Col key={"item-row_"+f.fid} md={4}>
                    <MealItemDisplay
                        key={f.fid}
                        food={f} />
                </Col>)}
            </Row>)}
        </Container>
    )
}

export default MealItemsDisplay;
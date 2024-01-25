
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { type Food as Food_Type } from '../types/Food';

interface IProps {
    food:Food_Type,
    deleteFood:(fid:string)=>void
}

const MealItem = (props:IProps) => {

    return (
            <Card>
                <Card.Body>
                    <Card.Title>{props.food.name}</Card.Title>
                    <Card.Subtitle>{props.food.serving} x {props.food.quantity} | Calories: {props.food.calories*props.food.quantity} kcal</Card.Subtitle>
                    <div>
                        <span>Fat: {props.food.fat*props.food.quantity} g | </span>
                        <span>Carbs: {props.food.carbs*props.food.quantity} g | </span>
                        <span>Protein: {props.food.protein*props.food.quantity} g</span>
                    </div>
                </Card.Body>
            </Card>
    )
}

export default MealItem;
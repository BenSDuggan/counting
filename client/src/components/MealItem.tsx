
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Guage, { CaloriesGauge, FatGauge, CarbGauge, ProteinGauge } from './Guage'
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
                    <Card.Subtitle>{props.food.serving} x {props.food.quantity}</Card.Subtitle>
                    <Container>
                        <Row>
                            <Col md={3}><CaloriesGauge value={props.food.calories} /></Col>
                            <Col md={3}><FatGauge value={props.food.fat} /></Col>
                            <Col md={3}><CarbGauge value={props.food.carbs} /></Col>
                            <Col md={3}><ProteinGauge value={props.food.protein} /></Col>
                        </Row>
                    </Container>
                    <Card.Text>
                        
                    </Card.Text>
                    <Card.Link href="#">Edit food</Card.Link>
                    <Button variant="primary" onClick={(e) => {
                                e.preventDefault(); 
                                props.deleteFood(props.food.fid);}}>
                        Delete
                    </Button>
                </Card.Body>
            </Card>
    )
}

export default MealItem;
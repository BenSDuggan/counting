
import {useEffect, useState} from "react";

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { CaloriesGauge, FatGauge, CarbGauge, ProteinGauge } from './Guage'
import MealItemsChange from './MealItemsChange'
import { new_day, Day as Day_Type } from '../types/Day'

const meal_types = ["breakfast", "lunch", "dinner", "snack", "dessert"];

const Day = () => {
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

                if(record.data.length === 1)
                    setDay(record.data[0]);
                else
                    alert("Could not get the data for today.")
            }
        })
        .catch((error) => console.error(error));
    }

    useEffect(() => {
        let ignore = false;

        get_day(ignore);

        return () => {ignore = true;}
      }, []);

    return (
        <Container className="main" fluid="lg">
            <Row>
                <Col md={3}><h2>{new Date(day.timestamp ?? 1).toDateString()}</h2></Col>
                <Col md={6}>
                    <Container>
                        <Row>
                            <Col><CaloriesGauge value={day.calories} /></Col>
                            <Col><FatGauge value={day.fat} /></Col>
                            <Col><CarbGauge value={day.carbs} /></Col>
                            <Col><ProteinGauge value={day.protein} /></Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
            
            {meal_types.map(((type:string) => 
                <Container key={"meal-"+type}>
                    <hr />
                    <div>
                        <h3 style={{"display":"inline"}}>{type.toLocaleUpperCase()}</h3>
                        <a href={"/mealedit?type="+type}>Edit</a>
                    </div>

                    <MealItemsChange 
                        foods={day[type as "breakfast"|"lunch"|"dinner"|"snack"|"dessert"].items} 
                        did={day.did} 
                        type={type} />
                </Container>))}
        </Container>
    )
}

export default Day;
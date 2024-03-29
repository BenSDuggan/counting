
import {useEffect, useState} from "react";

import { useSearchParams } from "react-router-dom";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';

import Recent from './Recent'
import Food from './Food'
import Products from './Products'
import MealItemsChange from "./MealItemsChange";

import { new_day, Day as Day_Type } from '../types/Day'

const meal_types = ["breakfast", "lunch", "dinner", "snack", "dessert"];


const MealEdit = () => {
    const [searchParams] = useSearchParams();

    const [day, setDay] = useState(new_day() as Day_Type);
    const [type, setType] = useState<"breakfast"|"lunch"|"dinner"|"snack"|"dessert">("breakfast");
    const [missing, setMissing] = useState(true);

    const [tab, setTab] = useState("recent");

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

                if(record.data.length === 1) {
                    setDay(record.data[0]);
                    setMissing(false);
                }
                else
                    alert("Could not get the data for today.")
            }
        })
        .catch((error) => console.error(error));
    }


    useEffect(() => {
        if(meal_types.includes(searchParams.get("type") as string)) {
            setType(searchParams.get("type") as "breakfast"|"lunch"|"dinner"|"snack"|"dessert");
            let ignore = false;
            get_day(ignore);

            return () => {ignore = true;}
        }
        else {
            alert("Day and meal type must be provided")
            setMissing(true)
        }
      }, [searchParams]);

    return (
        <Container>
            {missing ? 
                <></> : 
                <MealItemsChange 
                    foods={day[type].items} 
                    did={day.did}
                    type={type} />}
            <hr />

            <Container className="main" fluid="lg">
                
                <Row>
                    <Col md={4}>
                        <Pagination>
                            <Pagination.Item key={'recent'} active={'recent' === tab} onClick={()=>setTab('recent')}>Recent</Pagination.Item>
                            <Pagination.Item key={'foods'} active={'foods' === tab} onClick={()=>setTab('foods')}>Foods</Pagination.Item>
                            <Pagination.Item key={'products'} active={'products' === tab} onClick={()=>setTab('products')}>Products</Pagination.Item>
                        </Pagination>
                    </Col>
                    
                </Row>
                
                {tab === 'recent' ? 
                    <Recent
                        did={day.did}
                        type={type}
                    ></Recent> : <></>}

                {tab === 'products' ? 
                    <Products
                        did={day.did}
                        type={type}
                    ></Products> : <></>}

                {tab === 'foods' ? 
                    <Food
                        did={day.did}
                        type={type}
                    ></Food> : <></>}
                
            </Container>
        </Container>
    )
}

export default MealEdit;
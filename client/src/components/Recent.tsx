
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import FoodNewModal from './FoodNewModal'
import MealItemsAdd from "./MealItemsAdd";
import MealItemsFood from "./MealItemsFood";
import { type Food as Food_Type, new_food } from '../types/Food';

interface IProps {
    did:string, // Day ID
    type:string // Meal Type
}

const Recent = (props:IProps) => {
    const [foods, setFoods] = useState<Food_Type[]>([]);
    const [option, setOption] = useState({
        "page":0, 
        "submit":true})

    async function get_foods(ignore:boolean) {
        if(!option.submit)
            return
        else
            setOption({...option, submit:false})

        let params = '?page=' + option.page;

        fetch("api/food/recent"+params, { 
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            if(!ignore) {
                console.log(record)

                if(option.page === 0) {
                    setFoods(record.data);
                }
                else {
                    let t = JSON.parse(JSON.stringify(foods));
                    t.push(...record.data)
                    setFoods(t);
                }
            }
        })
        .catch((error) => console.error(error));
    }

    useEffect(() => {
        let ignore = false;

        get_foods(ignore);

        return () => {ignore = true;}
      }, [option]);

    return (
        <Container className="main" fluid="lg">

            <MealItemsAdd
                    key={"mealItemsAdd-"+props.did+"-"+props.type}
                    foods={foods}
                    did={props.did as string}
                    type={props.type as string}
                ></MealItemsAdd>
            
            <hr />
            <Row>
                <Col md={2}>
                    <Button variant="secondary" onClick={()=>setOption({...option, page:option.page + 1, submit:true})}>Load more</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Recent;
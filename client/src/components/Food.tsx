
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
    did?:string, // Day ID
    type?:string // Meal Type
}

const Food = (props:IProps) => {
    const [foods, setFoods] = useState<Food_Type[]>([]);
    const [displayOnly, setDisplayOnly] = useState(true);
    const [search, setSearch] = useState("");
    const [option, setOption] = useState({
        "page":0, 
        "submit":true})

    async function get_foods(ignore:boolean) {
        if(!option.submit)
            return
        else
            setOption({...option, submit:false})

        let params = '?page=' + option.page;


        fetch("api/food"+params, { 
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

    let search_foods = async () => {
        let product_id:string = search;

        fetch("https://world.openfoodfacts.org/api/v2/product/"+product_id+".json", {
            method: 'get',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            console.log(record);
            if(record.status === 1) {
                let food:Food_Type = new_food();

                food.name = record["product"]["product_name"];
                food.serving = record["product"]["serving_size"];
                food.manual = false;
                food.off_id = product_id;

                food.calories = record["product"]["nutriments"]["energy-kcal"];
                food.fat = record["product"]["nutriments"]["fat"];
                food.carbs = record["product"]["nutriments"]["carbohydrates"];
                food.protein = record["product"]["nutriments"]["proteins"];

                console.log(food);
                //setFoods([food]);
            }
            else {
                alert("Product does not exist.")
            }
        })
        .catch((error) => {
            alert("Could not fetch product.")
            console.error(error);
        });
    }

    useEffect(() => {
        if(Object.keys(props).includes("did") && Object.keys(props).includes("type")) {
            setDisplayOnly(false);
        }

        let ignore = false;

        get_foods(ignore);

        return () => {ignore = true;}
      }, [option]);

    return (
        <Container className="main" fluid="lg">
            <h2>Food</h2>
            <Row>
                <Col md={4}>
                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}></input>
                    <Button onClick={(e) => {e.preventDefault(); search_foods();}}>Search</Button>
                </Col>
                <Col md={2}>
                    <FoodNewModal food={{}} />
                </Col>
            </Row>

            <hr />

            {displayOnly ? 
                <MealItemsFood foods={foods}></MealItemsFood> :
                <MealItemsAdd
                        key={"mealItemsAdd-"+props.did+"-"+props.type}
                        foods={foods}
                        did={props.did as string}
                        type={props.type as string}
                    ></MealItemsAdd>
            }
            
            <hr />
            <Row>
                <Col md={2}>
                    <Button variant="secondary" onClick={()=>setOption({...option, page:option.page + 1, submit:true})}>Load more</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Food;

import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import MealItemsAdd from "./MealItemsAdd";
import MealItemsDisplay from "./MealItemsDisplay";
import { type Food as Food_Type, new_food } from '../types/Food';

// 737628064502
// 041420048548

interface IProps {
    did?:string, // Day ID
    type?:string // Meal Type
}

const Products = (props:IProps) => {
    const [search, setSearch] = useState("");
    const [searchItems, setSearchItems] = useState<Food_Type[]>([]);
    const [displayOnly, setDisplayOnly] = useState(true);

    let search_product = async () => {
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
                setSearchItems([food]);
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
      }, [props]);

    return (
        <Container className="main" fluid="lg">
            <h2>Products</h2>
            
            <Row>
                <Col md={4}>
                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}></input>
                    <Button onClick={(e) => {e.preventDefault(); search_product();}}>Search</Button>
                </Col>
            </Row>
            <hr />
            {searchItems.map((value:Food_Type) => 
                displayOnly ? 
                    <MealItemsDisplay
                        key={"mealItemsAdd-"+props.did+"-"+props.type}
                        foods={[value]} 
                    ></MealItemsDisplay> :
                    <MealItemsAdd
                        key={"mealItemsAdd-"+props.did+"-"+props.type}
                        foods={[value]} 
                        did={props.did as string}
                        type={props.type as string}
                    ></MealItemsAdd>
            )}
        </Container>
    )
}

export default Products;
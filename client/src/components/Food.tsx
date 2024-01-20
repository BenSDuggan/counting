
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import FoodNewModal from './FoodNewModal'
import { type Food as Food_Type } from '../types/Food';

const Food:React.FC<{}> = ({}) => {
    const [foods, setFoods] = useState([]);
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

    async function delete_recording(id:string) {
        fetch("api/food/"+id, { 
            method: 'delete',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            console.log(record);
            setOption({...option, page:0, submit:true});
            get_foods(false);
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
            <h2>Food</h2>
            <Container className="table-responsive">
                <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Calories</th>
                        <th>Macros</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food:Food_Type) => 
                        <tr key={food.fid}>
                            <td>{food.name}</td>
                            <td>{food.calories + " kcal"}</td>
                            <td>{food.carbs + " g; " + food.protein + " g; " + food.fat + " g"}</td>
                            <td>{food.description}</td>
                            <td>{new Date(food.timestamp).toLocaleString()}</td>
                            <td>
                                <FoodNewModal food={food} />
                                <Button 
                                    variant="dark" 
                                    onClick={ () => { delete_recording(food.fid) }}>
                                    🗑️</Button>
                            </td>
                        </tr>)}
                </tbody>
                </Table>
            </Container>
            <Row>
                <Col md={2}>
                    <FoodNewModal food={{}} />
                </Col>
                <Col md={2}>
                    <Button variant="secondary" onClick={()=>setOption({...option, page:option.page + 1, submit:true})}>Load more</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Food;
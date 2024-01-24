
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { type Food as Food_Type } from '../types/Food';
import { Meal as Meal_Type } from '../types/Day'

interface IProps {
    meal:Meal_Type
}

const IntakeModal = (props:IProps) => {
    const [foods, setFoods] = useState([]);
    const [checked, setChecked] = useState<string[]>([]);
    const [show, setShow] = useState(false);
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

    let save_meal = () => {
        foods.filter((food:Food_Type) =>
            checked.includes(food.fid)
        ).map((food:Food_Type) =>
            props.meal.items.push(food)
        );
    }

    useEffect(() => {
        let ignore = false;

        get_foods(ignore);

        return () => {ignore = true;}
      }, [option]);
    

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                Add meal
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Food</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>Selected</h3>
                <Container className="table-responsive">
                <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Calories</th>
                        <th>Macros (F C P)</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.filter((food:Food_Type) => checked.includes(food.fid))
                        .map((food:Food_Type) => 
                        <tr key={food.fid+"checked"}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    name="vehicle1"
                                    checked={checked.includes(food.fid)}
                                    onChange={(e) => {
                                        if(checked.includes(food.fid))
                                            setChecked(checked.filter(c => food.fid !== c))
                                        else
                                            setChecked([...checked, food.fid])
                                    }}  />
                            </td>
                            <td>{food.name}</td>
                            <td>{food.calories + " kcal"}</td>
                            <td>{food.fat + " g; " + food.carbs + " g; " + food.protein + " g"}</td>
                        </tr>)}
                </tbody>
                </Table>
                </Container>
                <hr/>
                <Container className="table-responsive">
                <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Calories</th>
                        <th>Macros (F C P)</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map((food:Food_Type) => 
                        <tr key={food.fid+"search"}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    name="vehicle1"
                                    checked={checked.includes(food.fid)}
                                    onChange={(e) => {
                                        if(checked.includes(food.fid))
                                            setChecked(checked.filter(c => food.fid !== c))
                                        else
                                            setChecked([...checked, food.fid])
                                    }}  />
                            </td>
                            <td>{food.name}</td>
                            <td>{food.calories + " kcal"}</td>
                            <td>{food.fat + " g; " + food.carbs + " g; " + food.protein + " g"}</td>
                            <td>{food.description}</td>
                        </tr>)}
                </tbody>
                </Table>
            </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e) => {
                                e.preventDefault(); 
                                save_meal();}}>
                    Save
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default IntakeModal;
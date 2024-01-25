
import { useEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { type Food as Food_Type } from '../types/Food';
import { Meal as Meal_Type } from '../types/Day'

interface IProps {
    meal:Meal_Type,
    saveItems:(foods:Food_Type[])=>void
}

const IntakeModal = (props:IProps) => {
    console.log(props.meal.items)
    const [foods, setFoods] = useState<Food_Type[]>([]);
    const [checked, setChecked] = useState<Food_Type[]>([...props.meal.items]);
    const [unchecked, setUnchecked] = useState<Food_Type[]>([]);
    const [show, setShow] = useState(false);
    const [option, setOption] = useState({
        "page":0, 
        "submit":true})

    let change_quantity = (food:Food_Type, value:number) => {
        setChecked(prevChecked => (
            prevChecked.map(item => 
              item.fid === food.fid ? { ...item, quantity: value } : item
            )
        ))
    }

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
                
                setFoods([...foods, record.data]);
                setUnchecked([...unchecked, ...record.data]);
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
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                Edit
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Food</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="table-responsive">
                <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Servings</th>
                        <th>Calories</th>
                        <th>Macros (F C P)</th>
                    </tr>
                </thead>
                <tbody>
                    {checked.map((food:Food_Type) => 
                        <tr key={food.fid+"checked"}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    name="vehicle1"
                                    checked={true}
                                    onChange={(e) => {
                                        setChecked(checked.filter(c => food.fid !== c.fid));
                                        setUnchecked([...unchecked, food])
                                    }} />
                            </td>
                            <td>{food.name}</td>
                            <td>{<Form.Control
                                type="number" 
                                placeholder="Weight"
                                value={food.quantity}
                                onChange={(e) => change_quantity(food, Number(e.target.value))}  />}</td>
                            <td>{food.serving}</td>
                            <td>{food.calories * food.quantity + " kcal"}</td>
                            <td>{food.fat*food.quantity + " g; " + food.carbs*food.quantity + " g; " + food.protein*food.quantity + " g"}</td>
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
                    {unchecked.map((food:Food_Type) =>
                        <tr key={food.fid+"search"}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    name="vehicle1"
                                    checked={false}
                                    onChange={(e) => {
                                        setChecked([...checked, food])
                                        setUnchecked(unchecked.filter(c => food.fid !== c.fid));
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
                                props.saveItems(checked);}}>
                    Save
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default IntakeModal;
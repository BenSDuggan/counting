
import { useState, useEffect } from "react";

import { v4 as uuidv4 } from 'uuid';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { type Food as Food_Type, new_food } from '../types/Food';


const FoodNewModal = (props:any) => {
    const [foods, setFoods] = useState<Food_Type>(new_food());
    const [show, setShow] = useState(false);

    const NEW_FOOD = !props.food.hasOwnProperty("fid");

    let input_date_string = (value:string):string => {
        let d = new Date(value)
        return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") +
         "T" + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") +
        ":" + String(d.getSeconds()).padStart(2, "0");
    }

    let save_foods = () => {
        const method:string = NEW_FOOD ? "post" : "put";

        fetch("/api/food/", { 
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(foods)
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            console.log(record);
            if(record.successful) {
                setShow(false);
                window.location.reload();
            }
            else
                alert("Food not added");
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        });
    }

    useEffect(() => {
        setFoods({
            ...foods,
            "fid":props.food.fid ?? uuidv4(), 
            "name":props.food.name ?? "",
            "description":props.food.description ?? "",
            "serving":props.food.serving ?? "",
            "calories":props.food.number ?? 0,
            "carbs":props.food.carbs ?? 0,
            "fat":props.food.fat ?? 0,
            "protein":props.food.protein ?? 0,
            "photos":props.food.photos ?? [],
            "timestamp": props.food.timestamp ?? new Date().toISOString()
        });
    }, []);

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                {NEW_FOOD ? "Add new food" : "Edit"}
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Food</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="foodsName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={foods.name}
                        onChange={(e) => setFoods({...foods, "name":e.target.value})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodsDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={foods.description}
                        onChange={(e) => setFoods({...foods, "description":e.target.value})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodsServings">
                    <Form.Label>Servings</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={foods.serving}
                        onChange={(e) => setFoods({...foods, "serving":e.target.value})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodsCalories">
                    <Form.Label>Calories (kcal)</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={foods.calories}
                        onChange={(e) => setFoods({...foods, "calories":Number(e.target.value)})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodsCarbs">
                    <Form.Label>Carbs (g)</Form.Label>
                    <Form.Control 
                        type="number"
                        value={foods.carbs}
                        onChange={(e) => setFoods({...foods, "carbs":Number(e.target.value)})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodsProtein">
                    <Form.Label>Protein (g)</Form.Label>
                    <Form.Control 
                        type="number"
                        value={foods.protein}
                        onChange={(e) => setFoods({...foods, "protein":Number(e.target.value)})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="foodsFat">
                    <Form.Label>Fat (g)</Form.Label>
                    <Form.Control 
                        type="number"
                        value={foods.fat}
                        onChange={(e) => setFoods({...foods, "fat":Number(e.target.value)})}  />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                Close
                </Button>
                <Button variant="primary" onClick={(e) => {
                                e.preventDefault(); 
                                save_foods();}}>
                    Save
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default FoodNewModal;
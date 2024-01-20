
import { useState} from "react";

import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


const WeightNewModal = (props:any) => {
    const [weight, setWeight] = useState({
        "wid":props.weight.wid ?? uuidv4(), 
        "value": props.weight.value ?? 0, 
        "timestamp": props.weight.timestamp ?? new Date().toISOString(), 
        "description": props.weight.description ?? ""
    });
    const [show, setShow] = useState(false);

    const navigate = useNavigate();
    const NEW_WEIGHT = !props.weight.hasOwnProperty("wid");

    let input_date_string = (value:string):string => {
        let d = new Date(value)
        return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") +
         "T" + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") +
        ":" + String(d.getSeconds()).padStart(2, "0");
    }

    let save_weight = () => {
        const method:string = NEW_WEIGHT ? "post" : "put";

        fetch("/api/weight/", { 
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(weight)
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
                alert("Weight not added");
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        });
    }

    return (
        <>
            <Button variant="primary" onClick={() => setShow(true)}>
                {NEW_WEIGHT ? "Add new weight" : "Edit"}
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Weight</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="weightValue">
                    <Form.Label>Weight (pounds)</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Weight"
                        value={weight.value}
                        onChange={(e) => setWeight({...weight, "value":Number(e.target.value)})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="weightDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control 
                        type="datetime-local" 
                        placeholder="Date"
                        value={input_date_string(weight.timestamp)}
                        onChange={(e) => setWeight({...weight, "timestamp":new Date(e.target.value).toISOString()})}  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="weightDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Description"
                        value={weight.description}
                        onChange={(e) => setWeight({...weight, "description":e.target.value})}  />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                Close
                </Button>
                <Button variant="primary" onClick={(e) => {
                                e.preventDefault(); 
                                save_weight();}}>
                    Save
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default WeightNewModal;
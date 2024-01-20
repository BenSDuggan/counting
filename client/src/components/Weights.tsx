
import React, {useEffect, useState} from "react";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import WeightNewModal from './WeightNewModal'
import { type Weight as Weight_Type } from '../types/Weight';

const Weights:React.FC<{}> = ({}) => {
    const [weights, setWeights] = useState([]);
    const [option, setOption] = useState({
        "page":0, 
        "submit":true})

    async function get_weights(ignore:boolean) {
        if(!option.submit)
            return
        else
            setOption({...option, submit:false})

        let params = '?page=' + option.page;


        fetch("api/weight"+params, { 
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
                    setWeights(record.data);
                }
                else {
                    let t = JSON.parse(JSON.stringify(weights));
                    t.push(...record.data)
                    setWeights(t);
                }
            }
        })
        .catch((error) => console.error(error));
    }

    async function delete_recording(id:string) {
        fetch("api/weight/"+id, { 
            method: 'delete',
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            return response.json();
        })
        .then((record) => {
            console.log(record);
            setOption({...option, page:0, submit:true});
            get_weights(false);
        })
        .catch((error) => console.error(error));
    }

    useEffect(() => {
        let ignore = false;

        get_weights(ignore);

        return () => {ignore = true;}
      }, [option]);

    return (
        <Container className="main" fluid="lg">
            <h2>Weights</h2>
            <Container className="table-responsive">
                <Table>
                <thead>
                    <tr>
                        <th>Weight</th>
                        <th>Timestamp</th>
                        <th>Description</th>
                        <th>Photos</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {weights.map((weight:Weight_Type) => 
                        <tr key={weight.wid}>
                            <td>{weight.value + " lbs."}</td>
                            <td>{new Date(weight.timestamp).toLocaleString()}</td>
                            <td>{weight.description}</td>
                            <td>{weight.photos}</td>
                            <td>
                                <WeightNewModal weight={weight} />
                                <Button 
                                    variant="dark" 
                                    onClick={ () => { delete_recording(weight.wid) }}>
                                    🗑️</Button>
                            </td>
                        </tr>)}
                </tbody>
                </Table>
            </Container>
            <Row>
                <Col md={2}>
                    <WeightNewModal weight={{}} />
                </Col>
                <Col md={2}>
                    <Button variant="secondary" onClick={()=>setOption({...option, page:option.page + 1, submit:true})}>Load more</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Weights;
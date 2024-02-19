
//import React, { useState, useEffect } from "react";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Menu(props:any) {

  return( 
    <>
      <Navbar expand="md" bg="" variant="dark" className="main_nav bg-primary">
        <>
        <Navbar.Brand href="/" >Dispatch</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-navbar-nav" />
        <Navbar.Collapse id="menu-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/day">Day</Nav.Link>
          <Nav.Link href="/food">Food</Nav.Link>
          <Nav.Link href="/products">Products</Nav.Link>
          <Nav.Link href="/mealedit">Meal Edit</Nav.Link>
          <Nav.Link href="/weights">Weights</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </>
    </Navbar>
    </>
  )
}

export default Menu;

//import React, { useState, useEffect } from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Menu  from './components/Navbar'
import Day from './components/Day'
import Food from './components/Food'
import Weights from './components/Weights'
import ErrorPage from "./error-page";

import './app.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Few!</div>,
    errorElement: <ErrorPage />,
  },
  {
    path: "day",
    element: <Day></Day>
  },
  {
    path: "weights",
    element: <Weights></Weights>
  },
  {
    path: "food",
    element: <Food></Food>
  }
]);

export default function App() {
  return (
    <>
      <Menu></Menu>
      <RouterProvider router={router} />
    </>
  );
}

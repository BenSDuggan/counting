
//import React, { useState, useEffect } from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Menu  from './components/Navbar'
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
    path: "weights",
    element: <Weights></Weights>
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

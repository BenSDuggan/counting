

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Menu  from './components/Navbar'
import Day from './components/Day'
import MealEdit from './components/MealEdit'
import Food from './components/Food'
import Products from './components/Products'
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
  },
  {
    path: "products",
    element: <Products></Products>
  },
  {
    path: "mealedit",
    element: <MealEdit></MealEdit>
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

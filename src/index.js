import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import Info from './Inf'
import PhotoRecolor from './PhotoRecolor'
import "./index.css"
import 'flowbite'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/customize",
    element: <Info />,
  },
  {
    path: "/recolor",
    element: <PhotoRecolor />,
  },
]
);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);



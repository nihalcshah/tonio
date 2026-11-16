import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import Info from './Inf'
import PhotoRecolor from './PhotoRecolor'
import AgentImages, { ImageView } from './AgentImages'
import ServerlessDemo from './ServerlessDemo';
import "./index.css"
import 'flowbite'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  { path: "/agents", element: <AgentImages /> },
  { path: "/image", element: <ImageView /> },
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
  {
    path: "/serverless",
    element: <ServerlessDemo />,
  },
]
);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);



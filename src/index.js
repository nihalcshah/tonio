import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';
import Info from './Inf'
import PhotoRecolor from './PhotoRecolor'
import ServerlessDemo from './ServerlessDemo';
import AgentImages, { ImageView } from './AgentImages'
import "./index.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function NotFound() { return <main className="p-8"><h1 className="text-3xl font-bold">Page not found</h1><p className="my-4">Choose a tool to continue.</p><a className="underline" href="/customize">Color studio</a><br /><a className="underline" href="/recolor">Photo recolor</a></main>; }

function AppFailure() { return <main className="p-8"><h1 className="text-3xl font-bold">This tool could not open</h1><p className="my-4">Reload the page to try again, or return to the tools.</p><button className="secondary-action" onClick={() => window.location.reload()}>Reload page</button><a className="underline ml-4" href="/">Back to Tone.io</a></main>; }

const router = createBrowserRouter([
  { path: "*", element: <NotFound /> },
  { path: "/serverless", element: <ServerlessDemo /> },
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
].map(route => ({ ...route, errorElement: <AppFailure /> }))
);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);



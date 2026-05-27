// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import {reducer,initialstate}  from "./components/Utility/reducer.js"
// import { DataProvider } from './components/DataProvider/DataProvider.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <DataProvider reducer={reducer} initialstate={initialstate}>
//     <App />

//     </DataProvider>
//   </StrictMode>,
// )

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { reducer, initialState } from "./components/Utility/reducer.js";
import { DataProvider } from "./components/DataProvider/DataProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </StrictMode>
);
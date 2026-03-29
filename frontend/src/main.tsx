import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/global.css";

ReactDOM.createRoot( //Find <div id="root"></div> and make react
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "toastr/build/toastr.min.css";
import App from "./App";
import "./index.css";
import "./output.css";
import reportWebVitals from "./reportWebVitals";
import "./style/bootstrap/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

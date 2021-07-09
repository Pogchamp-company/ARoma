import "./scss/style.scss"
import App from "./components/App";
import React from "react";
import {render} from "react-dom";

const appDiv = document.getElementById("app");
render(<App />, appDiv);

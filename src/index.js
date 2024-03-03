"use strict";

import "./stylesheets/main.css";
import { loadFromLocalStorage } from "./app/ui.js";

window.onload = function () {
  loadFromLocalStorage();
};

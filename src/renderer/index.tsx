import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import Application from "./components/Application";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

ReactDOM.render(
  <AppContainer>
    <Application />
  </AppContainer>,
  mainElement
);

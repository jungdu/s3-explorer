import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import Application from "./components/Application";
import { s3 } from "./stores";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

ReactDOM.render(
  <AppContainer>
    <s3.Provider>
      <Application />
    </s3.Provider>
  </AppContainer>,
  mainElement
);

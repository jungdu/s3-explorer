import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import { S3Provider } from "./stores/s3";
import Application from "./components/Application";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

ReactDOM.render(
  <AppContainer>
    <S3Provider>
      <Application />
    </S3Provider>
  </AppContainer>,
  mainElement
);

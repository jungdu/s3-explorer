import * as React from "react";
import * as ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { AppContainer } from "react-hot-loader";

import theme from "./theme";
import Application from "./components/Application";
import { s3 } from "./context";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AppContainer>
      <s3.Provider>
        <Application />
      </s3.Provider>
    </AppContainer>
  </ThemeProvider>,
  mainElement
);

import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { ThemeProvider } from "styled-components";
import Application from "./components/Application";
import { s3, uiState } from "./context";
import theme from "./theme";

// Create main element
const mainElement = document.getElementById("app");

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AppContainer>
      <s3.Provider>
        <uiState.Provider>
          <Application />
        </uiState.Provider>
      </s3.Provider>
    </AppContainer>
  </ThemeProvider>,
  mainElement
);

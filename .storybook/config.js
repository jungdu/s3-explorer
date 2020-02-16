import React from "react";
import { ThemeProvider } from "styled-components";
import { addDecorator, configure } from '@storybook/react';

import GlobalStyles from "../src/renderer/components/GlobalStyles";
import theme from "../src/renderer/theme";

addDecorator(s => <>
    <ThemeProvider theme={theme}>
      <GlobalStyles />{s()}
    </ThemeProvider>
  </>
);

// automatically import all files ending in *.stories.js
configure(require.context('../src/renderer', true, /\.stories\.(js|mdx|tsx)$/), module);

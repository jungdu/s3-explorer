import React from "react";
import { addDecorator, configure } from '@storybook/react';
import GlobalStyles from "../src/renderer/components/GlobalStyles";

addDecorator(s => <><GlobalStyles />{s()}</>);

// automatically import all files ending in *.stories.js
configure(require.context('../src/renderer', true, /\.stories\.(js|mdx|tsx)$/), module);

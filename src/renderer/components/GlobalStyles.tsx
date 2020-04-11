import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const globalStyles = createGlobalStyle`
${reset};
    a{
        text-decoration:none;
        color:inherit;
    }   
    *{
        box-sizing: border-box;
    }
    body{
        font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px;
        background-color:#fff;
    }
    button {
        cursor: pointer;
        background: none;
        border: none;
        &:active, &:focus {
            outline: 0;
        }
    }
`;

export default globalStyles;

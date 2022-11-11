import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

* {
  box-sizing: border-box;
}

html {
    font-family: 'Montserrat', sans-serif;
    font-size: 20px;
    letter-spacing: -0.06em;
    color: #141414;
    min-width: 320px;
  }

  h1, p {
    margin: 0
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }

  button {
    background: inherit; 
    border:none; 
    box-shadow:none; 
    border-radius:0; 
    padding:0; 
    overflow:visible; 
    cursor:pointer;
  }
`;

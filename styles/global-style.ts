import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    box-sizing: border-box;
  }

  html {
      font-family: 'Montserrat', 'Nanum Gothic', sans-serif;
      font-size: 20px;
      letter-spacing: -0.06em;
      color: #141414;
      background-color: #141414;
      font-weight: 400;
      min-width: 350px;
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

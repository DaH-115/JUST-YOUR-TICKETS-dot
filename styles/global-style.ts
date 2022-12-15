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
      color: #141414;
      background-color: #141414;
      min-width: 350px;
    }

  h1, p {
    letter-spacing: -0.06rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  p {
    line-height: 1.4;
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

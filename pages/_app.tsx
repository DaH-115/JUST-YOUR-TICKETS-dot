import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global-style';
import { theme } from '../styles/theme';

import Header from '../components/layout/Header';

function MyApp({ Component, pageProps }: AppProps) {
  const titleText = 'JUST MY TICKETS. | 홈';

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{titleText}</title>
      </Head>
      <GlobalStyle />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

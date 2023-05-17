import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/global-style';
import { theme } from 'styles/theme';

import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import FaviconTags from 'components/common/FaviconTags';
import MetaTags from 'components/common/MetaTags';
import AuthStateProvider from 'components/store/auth-context';

function MyApp({ Component, pageProps }: AppProps) {
  const titleText = 'JUST MY TICKETS.';

  return (
    <AuthStateProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <title>{titleText}</title>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          />
          <FaviconTags />
          <MetaTags />
        </Head>
        <GlobalStyle />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </AuthStateProvider>
  );
}

export default MyApp;

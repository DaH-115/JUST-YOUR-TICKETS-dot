import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/global-style';
import { theme } from 'styles/theme';

import store from 'store';
import AuthStateProvider from 'store/auth-context';
import FaviconTags from 'components/common/FaviconTags';
import MetaTags from 'components/common/MetaTags';
import Layout from 'components/layout/Layout';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  const titleText = 'JUST MY TICKETS.';

  return (
    <AuthStateProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <title>{titleText}</title>
          <FaviconTags />
          <MetaTags />
        </Head>
        <GlobalStyle />
        <Provider store={store}>
          <Layout>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </Layout>
        </Provider>
      </ThemeProvider>
    </AuthStateProvider>
  );
}

export default MyApp;

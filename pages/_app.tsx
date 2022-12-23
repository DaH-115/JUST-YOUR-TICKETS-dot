import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global-style';
import { theme } from '../styles/theme';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingMsg from '../components/common/LoadingMsg';
import FaviconTags from '../components/common/FaviconTags';
import MetaTags from '../components/common/MetaTags';
import AuthStateProvider from '../components/store/auth-context';

function MyApp({ Component, pageProps }: AppProps) {
  const titleText = 'JUST MY TICKETS.';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsLoading(true));
    router.events.on('routeChangeComplete', () => setIsLoading(false));

    return () => {
      router.events.off('routeChangeStart', () => setIsLoading(true));
      router.events.off('routeChangeComplete', () => setIsLoading(false));
    };
  }, []);

  return (
    <AuthStateProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <title>{titleText}</title>
          <FaviconTags />
          <MetaTags />
        </Head>
        <GlobalStyle />
        <Header />
        {/* <Header isUser={isUser} /> */}
        {isLoading && <LoadingMsg />}
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </AuthStateProvider>
  );
}

export default MyApp;

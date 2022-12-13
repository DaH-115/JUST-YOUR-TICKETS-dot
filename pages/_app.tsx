import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Error from 'next/error';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global-style';
import { theme } from '../styles/theme';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Header from '../components/layout/Header';
import LoadingMsg from '../components/common/LoadingMsg';
import FaviconTags from '../components/common/FaviconTags';
import MetaTags from '../components/common/MetaTags';
import { SystemError } from 'errorType';

function MyApp({ Component, pageProps }: AppProps) {
  const titleText = 'JUST MY TICKETS.';
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsUser(true);
        }
      });
    } catch (error) {
      const err = error as SystemError;
      <Error statusCode={err.statusCode} />;
    }
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsLoading(true));
    router.events.on('routeChangeComplete', () => setIsLoading(false));

    return () => {
      router.events.off('routeChangeStart', () => setIsLoading(true));
      router.events.off('routeChangeComplete', () => setIsLoading(false));
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{titleText}</title>
        <FaviconTags />
        <MetaTags />
      </Head>
      <GlobalStyle />
      <Header isUser={isUser} />
      {isLoading && <LoadingMsg />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

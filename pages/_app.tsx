import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global-style';
import { theme } from '../styles/theme';

import Header from '../components/layout/Header';
import LoadingMsg from '../components/common/LoadingMsg';

function MyApp({ Component, pageProps }: AppProps) {
  const titleText = 'JUST MY TICKETS. | 홈';
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
    <ThemeProvider theme={theme}>
      <Head>
        <title>{titleText}</title>
      </Head>
      <GlobalStyle />
      <Header />
      {isLoading && <LoadingMsg />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

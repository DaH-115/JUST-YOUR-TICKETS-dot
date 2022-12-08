import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='true'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Nanum+Gothic:wght@400;700&display=swap'
            rel='stylesheet'
          />

          <meta
            name='description'
            content='나의 영화 감상 티켓을 모아보세요.'
          />
          <meta
            name='keywords'
            content='movie,review,moviereview,ticket,영화,감상,영화감상,리뷰,티켓'
          />

          <meta property='og:type' content='website' />
          <meta property='og:locale' content='ko_KR' />
          <meta property='og:image:width' content='1200' />
          <meta property='og:image:height' content='630' />
          <meta property='og:url' content='' />
          <meta property='og:title' content='JUST MY TICKETS.' />
          <meta property='og:image' content='' />
          <meta
            property='og:description'
            content='나의 영화 감상 티켓을 모아보세요.'
          />
          <meta property='og:site_name' content='JUST MY TICKETS.' />

          {/* Twitter Card */}
          <meta name='twitter:card' content='summary' />
          <meta name='twitter:title' content='JUST MY TICKETS.' />
          <meta
            name='twitter:description'
            content='나의 영화 감상 티켓을 모아보세요.'
          />
          <meta name='twitter:image' content='' />

          <link rel='canonical' href='' />
        </Head>
        <body>
          <Main />
          <div id='portal' />
          <NextScript />
        </body>
      </Html>
    );
  }

  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }
}

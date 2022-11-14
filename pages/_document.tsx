import Document, { Head, Html, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html lang='id'>
        <Head>
          <title>Orbit - Smeduverse</title>
          <meta name='msapplication-TileColor' content='' />
          <meta name='theme-color' content='' />
          <meta
            name='apple-mobile-web-app-status-bar-style'
            content='black-translucent'
          />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='HandheldFriendly' content='True' />
          <meta name='MobileOptimized' content='320' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

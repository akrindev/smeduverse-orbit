import Script from "next/script";

export default function Head() {
  return (
    <>
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
      <Script src='/js/tabler.min.js' strategy='afterInteractive' />
    </>
  );
}

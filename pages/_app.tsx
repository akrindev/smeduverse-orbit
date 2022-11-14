import type { AppProps } from "next/app";
import "@tabler/core/src/scss/tabler.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

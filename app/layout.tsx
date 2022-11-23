"use client";

import "@tabler/core/src/scss/tabler.scss";
import Layout from "../components/Layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

import { Inter } from "@next/font/google";
import "./globals.css";
import "@tabler/core/dist/css/tabler.css";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

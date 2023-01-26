"use client";

import { PropsWithChildren } from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='page'>
      <Header />
      <div className='page-wrapper'>
        {children}
        <Footer />
      </div>
    </div>
  );
}

Layout.Body = ({ children }: PropsWithChildren) => (
  <div className='page-body'>
    <div className='container-xl'>{children}</div>
  </div>
);

Layout.Header = ({ children }: PropsWithChildren) => (
  <div className='page-header d-print-none'>
    <div className='container-xl'>{children}</div>
  </div>
);

"use client";

import { PropsWithChildren } from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className='page'>
      <Header />
      <div className='page-wrapper'>
        <div className='page-body'>
          <div className='container-xl'>{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export const LayoutHeader = ({ children }: PropsWithChildren) => (
  <div className='mb-3'>{children}</div>
);

"use client";

import { SessionProvider } from "next-auth/react";
import { Router } from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

type Props = {
  children?: React.ReactNode;
};

const progress = new ProgressBar({
  size: 2,
  color: "#34D399",
  className: "bar-of-progress",
  delay: 200,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);
Router.events.on("hashChangeStart", progress.start);
Router.events.on("hashChangeComplete", progress.finish);

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

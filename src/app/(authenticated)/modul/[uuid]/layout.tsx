import { LayoutClient } from "./components/layout-client";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    uuid: string;
  };
}) {
  return <LayoutClient modulUuid={params.uuid}>{children}</LayoutClient>;
}

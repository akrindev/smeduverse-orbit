"use client";

import ModulClient from "./components/modul-client";

export default function ModulPage({ params }: { params: { uuid: string } }) {
  return <ModulClient modulUuid={params.uuid} />;
}

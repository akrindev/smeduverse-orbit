"use client";

import { useParams } from "next/navigation";
import ModulClient from "./components/modul-client";

export default function ModulPage() {
	const { uuid } = useParams<{ uuid: string }>();
	return <ModulClient modulUuid={uuid} />;
}

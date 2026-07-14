"use client";

import { useParams } from "next/navigation";
import KelasAjarClient from "./components/kelas-ajar-client";

export default function KelasAjarPage() {
	const { uuid } = useParams<{ uuid: string }>();
	return <KelasAjarClient modulUuid={uuid} />;
}

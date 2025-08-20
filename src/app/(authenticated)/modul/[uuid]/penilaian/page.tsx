"use client";

import { useParams } from "next/navigation";
import PenilaianClient from "./components/penilaian-client";

export default function PenilaianPage() {
	const { uuid } = useParams<{ uuid: string }>();
	return <PenilaianClient modulUuid={uuid} />;
}

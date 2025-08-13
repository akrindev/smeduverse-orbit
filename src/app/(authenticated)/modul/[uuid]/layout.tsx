import { use } from "react";
import { LayoutClient } from "./components/layout-client";

export default function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{
		uuid: string;
	}>;
}) {
	const { uuid } = use(params);
	return <LayoutClient modulUuid={uuid}>{children}</LayoutClient>;
}

// src/app/(authenticated)/dashboard/components/analytics.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type Analytics = {
	// Define the structure of your analytics data here
	// Example:
	totalUsers: number;
	totalModules: number;
};

async function getAnalytics(): Promise<Analytics[]> {
	const response = await api.get<Analytics[]>("/analytics");
	return response.data; // Assuming response.data directly contains the array
}

export default function AnalyticsCard() {
	const {
		data: analytics,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["analytics"],
		queryFn: getAnalytics,
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dashboard Analytics</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<p>Loading analytics data...</p>
				) : isError ? (
					<p>Failed to load analytics data.</p>
				) : analytics && analytics.length > 0 ? (
					<div>
						{/* Display your analytics data here */}
						<p>Total Users: {analytics[0]?.totalUsers}</p>
						<p>Total Modules: {analytics[0]?.totalModules}</p>
					</div>
				) : (
					<p>No analytics data available.</p>
				)}
			</CardContent>
		</Card>
	);
}

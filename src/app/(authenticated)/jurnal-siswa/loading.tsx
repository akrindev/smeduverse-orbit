export default function Loading() {
	return (
		<div className="flex flex-col h-full">
			<div className="flex md:flex-row flex-col justify-between">
				<div className="space-y-1 mt-5">
					<div className="bg-gray-200 rounded w-48 h-8 animate-pulse"></div>
					<div className="bg-gray-200 rounded w-64 h-4 animate-pulse"></div>
				</div>
			</div>
			<div className="bg-gray-200 my-5 rounded h-px animate-pulse"></div>

			{/* Filters skeleton */}
			<div className="gap-5 grid grid-cols-12 mb-5">
				<div className="col-span-12 md:col-span-3">
					<div className="bg-gray-200 mb-3 rounded w-32 h-4 animate-pulse"></div>
					<div className="bg-gray-200 rounded w-full h-10 animate-pulse"></div>
				</div>
				<div className="col-span-12 md:col-span-9">
					<div className="bg-gray-200 rounded w-full h-10 animate-pulse"></div>
				</div>
			</div>

			{/* Table skeleton */}
			<div className="bg-white border rounded-md">
				<div className="p-6">
					<div className="bg-gray-200 mb-2 rounded w-48 h-6 animate-pulse"></div>
					<div className="bg-gray-200 rounded w-64 h-4 animate-pulse"></div>
				</div>
				<div className="border-t">
					{/* Table header */}
					<div className="flex bg-gray-50 px-6 py-3 border-b">
						<div className="bg-gray-200 mr-4 rounded w-24 h-4 animate-pulse"></div>
						<div className="bg-gray-200 mr-4 rounded w-32 h-4 animate-pulse"></div>
						<div className="bg-gray-200 mr-4 rounded w-28 h-4 animate-pulse"></div>
						<div className="bg-gray-200 rounded w-20 h-4 animate-pulse"></div>
					</div>
					{/* Table rows */}
					{[1, 2, 3, 4, 5].map((rowId) => (
						<div
							key={`skeleton-row-${rowId}`}
							className="flex px-6 py-4 border-b"
						>
							<div className="bg-gray-200 mr-4 rounded w-32 h-4 animate-pulse"></div>
							<div className="bg-gray-200 mr-4 rounded w-40 h-4 animate-pulse"></div>
							<div className="bg-gray-200 mr-4 rounded w-24 h-4 animate-pulse"></div>
							<div className="bg-gray-200 rounded w-16 h-4 animate-pulse"></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

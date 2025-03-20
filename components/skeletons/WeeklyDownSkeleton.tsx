// components/skeletons/WeeklyDownSkeleton.tsx
export function WeeklyDownSkeleton() {
	return (
		<div className="p-4 max-w-6xl bg-secondary-90  mx-auto animate-pulse">
			<div className="h-8 bg-secondary-80 rounded w-1/3 mb-6" />

			<div className="p-6 mb-6 bg-secondary-80 rounded-lg shadow">
				<div className="h-6 bg-secondary-80 rounded w-1/4 mb-2" />
				<div className="space-y-2">
					<div className="h-4 bg-secondary-80  rounded w-full" />
					<div className="h-4 bg-secondary-80  rounded w-3/4" />
				</div>
			</div>

			<div className="p-6 bg-secondary-80  rounded-lg shadow">
				<div className="h-[400px] bg-secondary-80  rounded" />
				<div className="mt-4 flex justify-between">
					<div className="h-4 bg-secondary-80 rounded w-24" />
					<div className="h-4 bg-secondary-80  rounded w-32" />
				</div>
			</div>
		</div>
	);
}

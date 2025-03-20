// components/package-detail/google-trends/CustomTooltip.tsx
import type { CustomTooltipProps } from "@/types/google-trends";
import { Card } from "@/components/ui/card";

export function CustomTooltip({
	active,
	payload,
	label,
	average,
}: CustomTooltipProps) {
	if (active && payload && payload.length && average > 0) {
		return (
			<Card className="bg-white p-3 shadow-lg border">
				<p className="font-medium">{label}</p>
				<p className="text-blue-600">
					Interest: {payload[0].value}
					<span className="text-sm text-gray-500 ml-1">/ 100</span>
				</p>
				<p className="text-gray-600 text-sm">Average: {average.toFixed(2)}</p>
			</Card>
		);
	}
	return null;
}

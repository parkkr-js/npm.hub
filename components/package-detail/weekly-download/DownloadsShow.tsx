"use client";
import { memo, useCallback, useMemo } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	ReferenceLine,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from "recharts";
import type { DownloadsData } from "@/types/weeklydown";
import { CustomTooltip } from "./CustomTooltip";
import type { CustomTooltipProps } from "@/types/google-trends";
interface DownloadsDataprops {
	downloadsData: DownloadsData;
	calculateAverage: number;
	calculateMax: number;
}
export const DownloadsShow = memo(function DowloadsShow({
	downloadsData,
	calculateAverage,
	calculateMax,
}: DownloadsDataprops) {
	const renderTooltp = useCallback(
		(props: CustomTooltipProps) => (
			<CustomTooltip {...props} average={calculateAverage} />
		),
		[calculateAverage],
	);

	const Formatter = useCallback((value: number) => {
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(1)}M`;
		}
		if (value >= 1000) {
			return `${(value / 1000).toFixed(1)}K`;
		}
		return value.toString();
	}, []);

	interface MaxProps {
		cx: number;
		cy: number;
		value: number;
	}

	const Max = useCallback(
		(props: MaxProps) => {
			const isMax = props.value === calculateMax;
			return isMax ? (
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					x={props.cx - 7}
					y={props.cy - 7}
				>
					<title>Maximum Downloads Point</title>
					<circle cx="7" cy="7" r="6.5" fill="#4682B4" stroke="#4682B4" />
					<circle cx="7" cy="7" r="4.5" stroke="#F0F1F7" />
				</svg>
			) : (
				<circle cx={props.cx} cy={props.cy} r={0} fill="none" stroke="none" />
			);
		},
		[calculateMax],
	);

	return (
		<div className="h-[352px] w-[661px] ml-14 mt-3 rounded-[20px] bg-white">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={downloadsData?.interest || []}
					margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="formattedTime"
						angle={-45}
						textAnchor="end"
						height={90}
						tick={{ fontSize: 12 }}
					/>
					<YAxis
						domain={[0, "auto"]}
						tick={{ fontSize: 12 }}
						tickFormatter={Formatter}
						label={{
							value: "Downloads",
							angle: -90,
							position: "insideLeft",
							style: { textAnchor: "middle" },
						}}
					/>

					<Tooltip content={renderTooltp} />
					<Legend />

					<ReferenceLine
						y={calculateAverage}
						stroke="#000000"
						strokeDasharray="3 3"
						label={{
							value: "Average",
							position: "left",
							fill: "#000000",
							fontSize: 12,
							cursor: "pointer",
						}}
					/>

					<Line
						className="pt-2"
						type="monotone"
						dataKey={(d) => d.value[0]}
						name="Downloads"
						stroke="#4682B4"
						strokeWidth={2}
						dot={Max}
						activeDot={{ r: 8 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
});

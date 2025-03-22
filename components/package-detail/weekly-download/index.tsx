"use client";
import { getWeeklyDownloads } from "@/app/api/weekly-down/action";
import { WeeklyDownSkeleton } from "@/components/skeletons/WeeklyDownSkeleton";
import type { DownloadsData, WeeklyDownload } from "@/types/weeklydown";
import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { transformWeeklyDataToChartFormat } from "@/lib/utils";
import { CustomTooltip } from "./CustomTooltip";

//useones 라는 hook 만들어서 첫 렌더링 될때만 한번만 나오면됨

interface WeeklyDownloadsProps {
	packageName: string;
}

export function WeeklyDownloads({ packageName }: WeeklyDownloadsProps) {
	const [downloadsData, setDownloadsData] = useState<DownloadsData | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// 주간 다운로드 데이터 가져오기
				const weeklyData = await getWeeklyDownloads(packageName);

				// 차트용 데이터 형식으로 변환
				const transformedData = transformWeeklyDataToChartFormat(weeklyData);
				setDownloadsData(transformedData);
			} catch (err) {
				const downloadsError =
					err instanceof Error
						? err
						: new Error("Failed to fetch weekly downloads data");
				setError(downloadsError);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [packageName]);

	const calculateAverage = useMemo(() => {
		if (!downloadsData?.interest) return 0;
		const sum = downloadsData.interest.reduce(
			(acc, curr) => acc + curr.value[0],
			0,
		);
		return sum / downloadsData.interest.length;
	}, [downloadsData]);

	const calculateMax = useMemo(() => {
		if (!downloadsData?.interest) return 0;
		const max = downloadsData.interest.reduce(
			(acc, curr) => Math.max(acc, curr.value[0]),
			0,
		);
		return max;
	}, [downloadsData]);

	if (isLoading) {
		return <WeeklyDownSkeleton />;
	}

	return (
		<>
			<div className="w-[785px] h-full">
				<div className="w-full bg-secondary-90 rounded-[20px] p-6 mb-6">
					<p className="text-xl font-semibold mb-2 text-primary-50">
						Weekly Downloads Statistics
					</p>
					<p className="text-[#F6F6F6] mb-4">
						Numbers represent weekly downloads from the npm registry. Higher
						numbers indicate more frequent usage and popularity among
						developers.
					</p>
				</div>
				<div className="h-auto bg-secondary-90 rounded-[20px] p-5 w-full">
					<p className="text-xl font-semibold mb-2 text-primary-50">
						Weekly download graph
					</p>
					<p className="text-[#F6F6F6] mb-4">
						Track the usage trends of {decodeURIComponent(packageName)} over the
						past year.
					</p>

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
									tickFormatter={(value) => {
										if (value >= 1000000) {
											return `${(value / 1000000).toFixed(1)}M`;
										}
										if (value >= 1000) {
											return `${(value / 1000).toFixed(1)}K`;
										}
										return value;
									}}
									label={{
										value: "Downloads",
										angle: -90,
										position: "insideLeft",
										style: { textAnchor: "middle" },
									}}
								/>

								<Tooltip
									content={(props) => (
										<CustomTooltip {...props} average={calculateAverage} />
									)}
								/>
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
									dot={(props) => {
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
												<circle
													cx="7"
													cy="7"
													r="6.5"
													fill="#4682B4"
													stroke="#4682B4"
												/>
												<circle cx="7" cy="7" r="4.5" stroke="#F0F1F7" />
											</svg>
										) : (
											<circle
												cx={props.cx}
												cy={props.cy}
												r={0}
												fill="none"
												stroke="none"
											/>
										);
									}}
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</>
	);
}

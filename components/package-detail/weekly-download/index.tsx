"use client";
import { useEffect, useState, useMemo, memo } from "react";
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
import { transformWeeklyDataToChartFormat } from "@/lib/utils";
import { CustomTooltip } from "./CustomTooltip";
import type { WeeklyDownload, DownloadsData } from "@/types/weeklydown";
import { getWeeklyDownloads } from "@/app/api/weekly-down/route";
import { WeeklyDownSkeleton } from "@/components/skeletons/WeeklyDownSkeleton";
import { DownloadsShow } from "./DownloadsShow";

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

	//결과 값을 캐싱해서 하위 컴포넌트로 보내니까 useMemo 사용, 함수 자체가 쓰이는 것이 아니기 떄문에 useCallback 사용하지 않음

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
					{downloadsData && (
						<DownloadsShow
							downloadsData={downloadsData}
							calculateMax={calculateMax}
							calculateAverage={calculateAverage}
						/>
					)}
				</div>
			</div>
		</>
	);
}

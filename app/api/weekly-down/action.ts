import type { WeekData, WeeklyDownload } from "@/types/weeklydown";
import axios from "axios";

const NPM_API_URL = process.env.NEXT_PUBLIC_NPM_API_URL;
const NPM_DOWNLOADS_ENDPOINT =
	process.env.NEXT_PUBLIC_NPM_DOWNLOAD_YEAR_ENDPOINT;

export async function getWeeklyDownloads(
	packageName: string,
): Promise<WeeklyDownload> {
	return axios
		.get(`${NPM_API_URL}${NPM_DOWNLOADS_ENDPOINT}${packageName}`)
		.then((response) => {
			const data = response.data.downloads;
			const weeklyData: WeekData[] = [];
			for (let i = 0; i < data.length; i += 7) {
				const weekSlice = data.slice(i, i + 7);
				const startDate = weekSlice[0]?.day || "";
				const endDate = weekSlice[weekSlice.length - 1]?.day || "";
				const totalDownloads: number = weekSlice.reduce(
					(acc: number, cur: { downloads: number }) => acc + cur.downloads,
					0,
				);
				weeklyData.push({
					startDate: startDate,
					endDate: endDate,
					downloads: totalDownloads,
				});
			}

			console.log("weeklyData:", weeklyData);

			return {
				packageName: packageName,
				weeklyData: weeklyData,
			};
		})
		.catch((error) => {
			console.error("Failed to fetch weekly download data:", error);
			return {
				packageName,
				weeklyData: [],
			};
		});
}

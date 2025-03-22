import { calCulateWeek } from "@/lib/utils";
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
			return calCulateWeek(response.data.downloads, packageName);
		})
		.catch((error) => {
			console.error("Failed to fetch weekly download data:", error);
			return {
				packageName,
				weeklyData: [],
			};
		});
}

import type {
	PopularPackageInfo,
	PackageInfo,
	SuggestionPackageInfo,
	SearchResultPackageInfo,
	DetailResultPackageInfo,
} from "@/types/package";
import { extractGitHubInfo } from "@/lib/utils";
import { CacheManager } from "@/lib/cache";
import axios from "axios";

const NPM_BASE_URL = process.env.NEXT_PUBLIC_NPM_REGISTRY_URL;
const NPM_POPULAR_ENDPOINT = process.env.NEXT_PUBLIC_NPM_POPULAR_ENDPOINT;
const NPM_SEARCH_ENDPOINT = process.env.NEXT_PUBLIC_NPM_SEARCH_ENDPOINT;
const NPM_API_URL = process.env.NEXT_PUBLIC_NPM_API_URL;
const NPM_DOWNLOADS_ENDPOINT = process.env.NEXT_PUBLIC_NPM_DOWNLOAD_ENDPOINT;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const suggestionsCache = new CacheManager<Promise<SuggestionPackageInfo[]>>({
	maxSize: 100,
	expiryTime: 1000 * 60 * 5,
});

const searchResultsCache = new CacheManager<Promise<SearchResultPackageInfo[]>>(
	{
		maxSize: 100,
		expiryTime: 1000 * 60 * 5,
	},
);

const detailPackgeCache = new CacheManager<Promise<DetailResultPackageInfo[]>>({
	maxSize: 100,
	expiryTime: 1000 * 60 * 5,
});

export async function getPopularPackages(): Promise<PopularPackageInfo[]> {
	try {
		const response = await axios.get<{ objects: PackageInfo[] }>(
			`${NPM_BASE_URL}${NPM_POPULAR_ENDPOINT}`,
		);

		return response.data.objects.map(
			(item: PackageInfo): PopularPackageInfo => {
				return {
					name: item.package?.name || "Unknown Package",
					description: item.package?.description || "No description available",
					score: {
						detail: {
							popularity: item.score?.detail?.popularity || 0,
						},
					},
					author: {
						name: item.package?.author?.name || "Unknown",
						email: item.package?.author?.email || "",
					},
					publisher: {
						username: item.package?.publisher?.username || "Unknown",
						email: item.package?.publisher?.email || "",
					},
				};
			},
		);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("NPM API Error:", {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
			});
		} else {
			console.error("Unexpected error:", error);
		}
		return [];
	}
}

export async function getSuggestionPackages(
	query: string,
): Promise<SuggestionPackageInfo[]> {
	const cachedData = suggestionsCache.get(query);
	if (cachedData) {
		return cachedData;
	}
	const fetchPromise = (async () => {
		try {
			const response = await axios.get(
				`${NPM_BASE_URL}${NPM_SEARCH_ENDPOINT}${query}&size=20&from=0`,
			);

			const packageDownload = await Promise.all(
				response.data.objects.map(async (item: PackageInfo) => {
					const packageData = {
						name: item.package?.name || "Unknown Package",
						description:
							item.package?.description || "No description available",
						date: item.package?.date || "Unknown Date",
						downloadCount: 0,
					};

					try {
						const downloadsResponse = await axios.get<{ downloads: number }>(
							`${NPM_API_URL}${NPM_DOWNLOADS_ENDPOINT}${item.package.name}`,
						);
						packageData.downloadCount = downloadsResponse.data?.downloads || 0;
					} catch (downloadError) {
						console.warn(
							`Failed to fetch download count for ${item.package.name}:`,
							downloadError,
						);
					}

					return {
						package: packageData,
						score: {
							detail: {
								popularity: item.score.detail.popularity || 0,
							},
						},
					};
				}),
			);

			return packageDownload;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("NPM API Error:", {
					message: error.message,
					status: error.response?.status,
					data: error.response?.data,
				});
			} else {
				console.error("Unexpected error:", error);
			}
			return [];
		}
	})();

	suggestionsCache.set(query, fetchPromise);
	return fetchPromise;
}

export async function getSearchResultPackages(
	query: string,
): Promise<SearchResultPackageInfo[]> {
	const cachedData = searchResultsCache.get(query);
	if (cachedData) {
		return cachedData;
	}
	const fetchPromise = (async () => {
		try {
			const response = await axios.get(
				`${NPM_BASE_URL}${NPM_SEARCH_ENDPOINT}${query}&size=20&from=0`,
			);

			const mapPackageData = (item: PackageInfo, downloads = 0) => ({
				package: {
					name: item.package?.name || "Unknown Package",
					version: item.package?.version || "Unknown Version",
					description: item.package?.description || "No description available",
					keywords: item.package?.keywords || [],
					date: item.package?.date || "Unknown Date",
					author: {
						name: item.package?.author?.name || "Unknown",
						email: item.package?.author?.email || "",
					},
					publisher: {
						username: item.package?.publisher?.username || "Unknown",
						email: item.package?.publisher?.email || "",
					},
					downloadCount: downloads,
				},
				score: {
					final: item.score.final || 0,
					detail: {
						popularity: item.score.detail.popularity || 0,
					},
				},
			});

			const packageDownload = await Promise.all(
				response.data.objects.map(async (item: PackageInfo) => {
					try {
						const downloadsResponse = await axios.get<{ downloads: number }>(
							`${NPM_API_URL}${NPM_DOWNLOADS_ENDPOINT}${item.package.name}`,
						);
						return mapPackageData(item, downloadsResponse.data?.downloads || 0);
					} catch (downloadError) {
						console.warn(
							`Failed to fetch download count for ${item.package.name}:`,
							downloadError,
						);
						return mapPackageData(item);
					}
				}),
			);

			return packageDownload;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("NPM API Error:", {
					message: error.message,
					status: error.response?.status,
					data: error.response?.data,
				});
			} else {
				console.error("Unexpected error:", error);
			}
			return [
				{
					package: { name: "error", description: error },
					score: { final: 0, detail: { popularity: 0 } },
				},
			];
		}
	})();

	searchResultsCache.set(query, fetchPromise);
	return fetchPromise;
}

export async function getPackageDetail(
	query: string,
): Promise<DetailResultPackageInfo[]> {
	const cachedData = detailPackgeCache.get(query);
	if (cachedData) {
		return cachedData;
	}
	const fetchPromise = (async () => {
		try {
			const response = await axios.get(
				`${NPM_BASE_URL}${NPM_SEARCH_ENDPOINT}${query}&size=1&from=0`,
			);
			// 시간 기반 활성도 점수 계산을 위한 범위 설정
			const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000; // 5년을 밀리초로
			const dateRange: [number, number] = [Date.now() - FIVE_YEARS, Date.now()];
			const scoreRange: [number, number] = [0, 1];

			const convertRange = (
				value: number,
				[oldMin, oldMax]: [number, number],
				[newMin, newMax]: [number, number] = [0, 1],
			): number => {
				const scaledValue =
					((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
				return Math.min(newMax, Math.max(newMin, scaledValue));
			};

			const convertRangeLogarithmic = (
				value: number,
				[oldMin, oldMax]: [number, number],
				[newMin, newMax]: [number, number] = [0, 1],
			): number => {
				const logMin = Math.log(1);
				const logMax = Math.log(100);
				const scale = (logMax - logMin) / (oldMax - oldMin);
				const logValue = Math.exp((value - oldMin) * scale + logMin);
				return convertRange(logValue, [1, 100], [newMin, newMax]);
			};
			const mapPackageData = (
				item: PackageInfo,
				downloads = 0,
				githubstars = 0,
			) => {
				// 검색 점수 정규화 (1이 최대)
				const normalizedSearchScore = Math.min(
					1,
					Math.log10(item.searchScore) / 3 || 0,
				);

				// 시간 기반 활성도 점수
				const activityScore = convertRangeLogarithmic(
					new Date(item.package?.date || Date.now()).getTime(),
					dateRange,
					scoreRange,
				);

				// 다운로드 점수 (로그 스케일로 변환)
				const downloadScore = downloads
					? Math.min(1, Math.log10(downloads) / 7)
					: 0;
				// 일단 천만을 기준으로해서 점수 환산

				// 최종 점수 계산 (가중치 적용)
				// 조절 가능한 가중치
				const finalScore =
					normalizedSearchScore * (1 / 3) + // 검색 관련성
					activityScore * (1 / 3) + // 활성도
					downloadScore * (1 / 3); // 다운로드 수

				return {
					package: {
						name: item.package?.name || "Unknown Package",
						version: item.package?.version || "Unknown Version",
						description:
							item.package?.description || "No description available",
						keywords: item.package?.keywords || [],
						date: item.package?.date || "Unknown Date",
						author: {
							name: item.package?.author?.name || "Unknown",
							email: item.package?.author?.email || "",
						},
						publisher: {
							username: item.package?.publisher?.username || "Unknown",
							email: item.package?.publisher?.email || "",
						},
						downloadCount: downloads,
						starsCount: githubstars,
					},
					score: {
						final: finalScore,
					},
				};
			};

			const packageTotal = await Promise.all(
				response.data.objects.map((item: PackageInfo) => {
					// 두 API 요청을 병렬로 처리
					return Promise.all([
						// NPM 다운로드 정보 가져오기
						axios
							.get<{ downloads: number }>(
								`${NPM_API_URL}${NPM_DOWNLOADS_ENDPOINT}${encodeURIComponent(item.package.name)}`,
							)
							.catch(() => ({ data: { downloads: 0 } })),

						// GitHub 스타 정보 가져오기
						(async () => {
							const githubInfo = extractGitHubInfo(item.package.name, {
								repository: item.package.links?.repository
									? { url: item.package.links.repository }
									: undefined,
							});

							if (!githubInfo) return 0;

							const headers = process.env.GITHUB_TOKEN
								? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
								: {};

							return axios
								.get<{ stargazers_count: number }>(
									`https://api.github.com/repos/${githubInfo.owner}/${githubInfo.repo}`,
									{ headers },
								)
								.then((res) => res.data?.stargazers_count || 0)
								.catch(() => 0);
						})(),
					]).then(([downloadsResponse, githubStars]) =>
						mapPackageData(
							item,
							downloadsResponse.data?.downloads || 0,
							githubStars,
						),
					);
				}),
			).catch((error) => {
				console.error("Failed to fetch package information:", error);
				return [];
			});
			return packageTotal;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("NPM API Error:", {
					message: error.message,
					status: error.response?.status,
					data: error.response?.data,
				});
			} else {
				console.error("Unexpected error:", error);
			}
			return [];
		}
	})();

	detailPackgeCache.set(query, fetchPromise);

	return fetchPromise;
}

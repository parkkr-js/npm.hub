//app/api/google-trends/actions.ts

import { removeSpecialChars } from "@/lib/utils";
import type { TrendsData } from "@/types/google-trends";

interface ApiError extends Error {
	status: number;
}

export function fetchGoogleTrends(packageName: string): Promise<TrendsData> {
	let modifiedPackageName = decodeURIComponent(packageName);
	modifiedPackageName = removeSpecialChars(modifiedPackageName);

	const url = `/api/google-trends?keyword=${modifiedPackageName}`;

	return fetch(url)
		.then((response) => {
			if (!response.ok) {
				return response.text().then((errorText) => {
					console.error("API Error response:", errorText);

					const error = new Error(
						`API Error: ${response.status} - ${errorText}`,
					) as ApiError;
					error.status = response.status;
					throw error;
				});
			}

			const contentType = response.headers.get("content-type");
			if (!contentType?.includes("application/json")) {
				const error = new Error(`잘못된 응답 타입: ${contentType}`) as ApiError;
				error.status = 400;
				throw error;
			}

			return response.json();
		})
		.then((data) => {
			if (!data.interest || !Array.isArray(data.interest)) {
				const error = new Error("유효하지 않은 데이터 형식") as ApiError;
				error.status = 404;
				throw error;
			}

			return data as TrendsData;
		})
		.catch((error) => {
			console.error("fetchGoogleTrends 에러:", error);
			throw error;
		});
}

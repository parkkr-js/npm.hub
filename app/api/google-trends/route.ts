// app/api/google-trends/route.ts
import type { TrendsAPIResponse } from "@/types/google-trends";
import googleTrends from "google-trends-api";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const keyword = searchParams.get("keyword") || "";

		if (!keyword) {
			return NextResponse.json(
				{ error: "Keyword is required" },
				{ status: 400 },
			);
		}

		const options = {
			keyword,
			startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
			category: 31,
		};

		const interestData = await googleTrends.interestOverTime(options);

		const parsedInterest = JSON.parse(interestData) as TrendsAPIResponse;

		return NextResponse.json({
			interest: parsedInterest.default.timelineData,
		});
	} catch (error) {
		console.error("Google Trends API Error:", error);

		const errorMessage =
			error instanceof Error
				? `${error.name}: ${error.message}`
				: "Failed to fetch search results";

		return NextResponse.json(
			{
				error: errorMessage,
				stack: error instanceof Error ? error.stack : undefined,
				items: [],
			},
			{ status: 500 },
		);
	}
}

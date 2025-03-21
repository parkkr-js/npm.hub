// lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MD5 } from "crypto-js";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getPublisherAvatarUrl(
	email: string,
	size = 50,
	rating = "g",
	fallback = "retro",
): string {
	const emailHash = MD5(email?.trim()?.toLowerCase() || " ");
	return `https://www.gravatar.com/avatar/${emailHash}?d=${fallback}&r=${rating}&s=${size}`;
}

export const extractGitHubInfo = (
	packageName: string,
	packageData: { repository?: { url: string } },
): { owner: string; repo: string } | null => {
	try {
		// npm 패키지 데이터에서 repository 정보 확인
		const repoUrl = packageData?.repository?.url || "";

		// GitHub URL 패턴 확인 (git+https://github.com/owner/repo.git 또는 https://github.com/owner/repo 형식)
		const githubRegex = /github\.com\/([^\/]+)\/([^\/\.]+)(\.git)?/i;
		const match = repoUrl.match(githubRegex);
		// match = [ 'github.com/owner/repo', 'owner', 'repo', undefined, index: 0, input: 'git+
		if (match?.[1] && match?.[2]) {
			return {
				owner: match[1],
				repo: match[2],
			};
		}

		// 패키지 이름으로 대체 시도 (일부 패키지는 org/repo 형식)
		// @angular/core -> owner: angular, repo: core
		const pkgParts = packageName.split("/");
		if (pkgParts.length === 2 && pkgParts[0].startsWith("@")) {
			return {
				owner: pkgParts[0].substring(1),
				repo: pkgParts[1],
			};
		}

		return null;
	} catch (error) {
		console.warn(`Failed to extract GitHub info for ${packageName}:`, error);
		return null;
	}
};

export function calculateBadges<
	T extends {
		package: {
			name: string;
			downloadCount: number;
			date: string;
		};
		score: {
			detail: {
				popularity: number;
			};
		};
	},
>(
	packages: T[],
	originalOrder?: string[],
): (T & {
	badges: {
		isExactMatch: boolean;
		isMostDownloaded: boolean;
		isMostRecent: boolean;
		isMostPopular: boolean;
	};
})[] {
	if (!packages.length) return [];

	const mostDownloaded = packages.reduce(
		(max, curr) =>
			curr.package.downloadCount > max.package.downloadCount ? curr : max,
		packages[0],
	);

	const mostRecent = packages.reduce(
		(max, curr) =>
			new Date(curr.package.date) > new Date(max.package.date) ? curr : max,
		packages[0],
	);

	const mostPopular = packages.reduce(
		(max, curr) =>
			curr.score.detail.popularity > max.score.detail.popularity ? curr : max,
		packages[0],
	);

	const exactMatchName = originalOrder?.[0];

	return packages.map((pkg) => ({
		...pkg,
		badges: {
			isExactMatch: exactMatchName
				? pkg.package.name === exactMatchName
				: false,
			isMostDownloaded: pkg === mostDownloaded,
			isMostRecent: pkg === mostRecent,
			isMostPopular: pkg === mostPopular,
		},
	}));
}

export function getTimeAgo(date: string) {
	const now = new Date();
	const past = new Date(date);
	const diffInMs = now.getTime() - past.getTime();

	const minutes = Math.floor(diffInMs / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
	if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
	if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
	if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
}

export function slashEncoding(name: string) {
	return name.replace(/\//g, "%2F");
}

export function removeSpecialChars(str: string): string {
	return str
		.replace(/[^a-zA-Z0-9가-힣]/g, " ") // 특수문자를 공백으로
		.trim() // 앞뒤 공백 제거를 먼저하고
		.replace(/\s+/g, "-"); // 남은 공백들을 '-'로 변경
}

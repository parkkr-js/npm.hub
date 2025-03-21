// types/package.d.ts

export interface PopularPackageInfo {
	name: string;
	description: string;
	score: {
		detail: {
			popularity: number;
		};
	};
	author: {
		name: string;
		email: string;
	};
	publisher: {
		username: string;
		email: string;
	};
}

export interface PackageBadges {
	isExactMatch: boolean;
	isMostDownloaded: boolean;
	isMostRecent: boolean;
	isMostPopular: boolean;
}

export interface SuggestionPackageInfo {
	package: {
		name: string;
		description: string;
		date: string;
		downloadCount: number;
	};
	score: {
		detail: {
			popularity: number;
		};
	};
	badges?: PackageBadges;
}

// 검색 결과 패키지 정보
export interface SearchResultPackageInfo {
	package: {
		name: string;
		version: string;
		description: string;
		keywords: string[];
		date: string;
		author: {
			name: string;
			email: string;
			username?: string;
		};
		publisher: {
			username: string;
			email: string;
		};
		downloadCount: number;
	};
	score: {
		final: number;
		detail: {
			popularity: number;
		};
	};
	badges?: PackageBadges;
}
export interface PackageInfo {
	package: {
		name: string;
		scope: "unscoped" | string;
		version: string;
		description: string;
		keywords?: string[];
		date: string;
		links: {
			npm: string;
			homepage?: string;
			repository?: string;
			bugs?: string;
		};
		author: {
			name: string;
			email: string;
			username?: string;
		};
		publisher: {
			username: string;
			email: string;
		};
		maintainers: Array<{
			username: string;
			email: string;
		}>;
	};
	flags: {
		insecure: number;
	};
	score: {
		final: number;
		detail: {
			quality: number;
			popularity: number;
			maintenance: number;
		};
	};
	searchScore: number;
}

//상세페이지 패키지 정보

export interface DetailResultPackageInfo {
	package: {
		name: string;
		version: string;
		description: string;
		keywords: string[];
		date: string;
		author: {
			name: string;
			email: string;
			username?: string;
		};
		publisher: {
			username: string;
			email: string;
		};
		downloadCount: number;
		googletrends: number;
		starsCount: number;
	};
	score: {
		final: number;
	};
}

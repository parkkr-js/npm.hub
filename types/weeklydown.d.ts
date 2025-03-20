// API에서 반환되는 일별 다운로드 데이터 형식
export interface DailyDownload {
	downloads: number;
	day: string;
}

// API 전체 응답 구조
export interface DownloadResponse {
	downloads: DailyDownload[];
	start: string;
	end: string;
	package: string;
}

// 주별 데이터 항목
export interface WeekData {
	startDate: string;
	endDate: string;
	downloads: number;
}

// 패키지별 주간 다운로드 정보
export interface WeeklyDownload {
	packageName: string;
	weeklyData: WeekData[];
}

export interface DownloadsData {
	interest: {
		formattedTime: string;
		formattedAxisTime: string;
		value: number[];
	}[];
}

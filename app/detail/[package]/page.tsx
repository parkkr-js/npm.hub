// app/detail/[package]/page.tsx
import { GoogleTrends } from "@/components/package-detail/goolgle-trends";
import { GoogleSearchResults } from "@/components/package-detail/google-search-results";
import Markdown from "@/components/package-detail/mark-down";
import { DetailPackageWrapper } from "@/components/package-detail/package-introduce";
import { getPackageDetail } from "@/app/api/npm";
import { Suspense } from "react";
import { GoogleTrendsSkeleton } from "@/components/skeletons/GoogleTrendsSkeleton";
import { MarkDownSkeleton } from "@/components/skeletons/MarkDownSkeleton";
import { GoogleSearchResultSkeleton } from "@/components/skeletons/GoogleSearchSkeleton";
import { WeeklyDownloads } from "@/components/package-detail/weekly-download";
interface PageProps {
	params: {
		package: string;
	};
}

export default async function PackageDetailPage({ params }: PageProps) {
	const initialResults = await getPackageDetail(params.package);
	return (
		<main className="flex">
			<article className="flex flex-col ml-48 w-auto">
				{/* 패키지 헤더 정보 영역 */}
				<header>
					<DetailPackageWrapper initialResults={initialResults} />
				</header>

				{/* Weekly download 현황 섹션 */}
				<section aria-label="Weekly Downloads" className="p-4">
					{/* Weekly download 컴포넌트 */}
				</section>

				{/* Google Trends 섹션 */}
				<section aria-label="Google Trends">
					<Suspense fallback={<GoogleTrendsSkeleton />}>
						<WeeklyDownloads packageName={params.package} />
					</Suspense>
				</section>

				{/* 마크다운 문서 섹션 */}
				<section aria-label="Package Documentation" className="mt-4">
					<Suspense fallback={<MarkDownSkeleton />}>
						<Markdown packageName={params.package} />
					</Suspense>
				</section>
			</article>

			{/* 부가 정보 사이드바 */}
			<aside className="ml-5">
				<Suspense fallback={<GoogleSearchResultSkeleton />}>
					<GoogleSearchResults packageName={params.package} />
				</Suspense>
			</aside>
		</main>
	);
}

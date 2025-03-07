// app/search/[query]/page.tsx
import { Suspense } from 'react';
import { getSearchResultPackages } from '@/app/api/npm';
import { SearchResultsWrapper } from '@/components/search-results/SearchResultsWrapper';
import { FilterSidebar } from '@/components/search-results/FilterSidebar';
import { KeywordBox } from '@/components/search-results/KeywordBox';
import { PackageSearchSkeleton } from '@/components/skeletons/PackageSearchSkeleton';
import Link from 'next/link';
import { FilterSidekeleton } from '@/components/skeletons/FilterSideSkeleton';
import { Keywordkeleton } from '@/components/skeletons/KeywordSkeleton';
import { Errorlayout } from '@/components/search/Errorlayout';
interface SearchPageProps {
  params: {
    query: string;
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const initialResults = await getSearchResultPackages(params.query);

  if (initialResults.length === 0) {
    return <Errorlayout message="This text does not match any packages" />;
  }

  if (initialResults[0].package.name === 'error') {
    return <Errorlayout message="The text must be between 2 and 64 characters" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* 필터 사이드바 */}
        <aside className="col-span-2" aria-label="Search filters">
          <Suspense fallback={<FilterSidekeleton />}>
            <FilterSidebar />
          </Suspense>
        </aside>

        {/* 검색 결과 메인 영역 */}
        <main className="col-span-7" role="main" aria-label="Search results">
          <Suspense fallback={<PackageSearchSkeleton />}>
            <SearchResultsWrapper initialResults={initialResults} />
          </Suspense>
        </main>

        {/* 키워드 사이드바 */}
        <aside className="col-span-3" aria-label="Related keywords">
          <Suspense fallback={<Keywordkeleton />}>
            <KeywordBox />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}

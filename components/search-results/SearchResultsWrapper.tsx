//const sortedResults = useRecoilValue(sortedAndBadgedResultsSelector); =>eywordFilteredResultsSelector 안에서 사용 중이므로
// useMemo는 의존성 배열에 값이 변하면 그 변한 값 반환 아니면 기존 값 반환인데

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { searchResultsAtom } from "@/store/atoms";
import { keywordFilteredResultsSelector } from "@/store/selectors";
import { SearchResultList } from "./SearchResultList";
import type { SearchResultPackageInfo } from "@/types/package";
import { PackageCardSkeleton } from "../skeletons/PopularPackageCardSkeleton";
import { PackageSearchSkeleton } from "../skeletons/PackageSearchSkeleton";

interface SearchResultsWrapperProps {
	initialResults: SearchResultPackageInfo[];
}

export function SearchResultsWrapper({
	initialResults,
}: SearchResultsWrapperProps) {
	const setSearchResults = useSetRecoilState(searchResultsAtom);

	const keywordFilteredResults = useRecoilValue(keywordFilteredResultsSelector);
	useEffect(() => {
		setSearchResults(initialResults);
	}, [initialResults, setSearchResults]);

	const memoizedResults = useMemo(
		() => keywordFilteredResults,
		[keywordFilteredResults],
	);

	return (
		<div
			className="space-y-4 h-[calc(100vh-2rem)] overflow-y-auto pr-4
  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
			data-testid="search-results"
		>
			<SearchResultList results={memoizedResults} />
		</div>
	);
}

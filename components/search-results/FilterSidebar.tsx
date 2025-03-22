"use client";

// components/search-results/FilterSidebar.tsx

import { useSetRecoilState } from "recoil";
import { sortTypeAtom, selectedKeywordAtom } from "@/store/atoms";
import type { sortType } from "@/types/common";
import { useCallback } from "react";

export function FilterSidebar() {
	const setSortType = useSetRecoilState(sortTypeAtom);
	const setSelectedKeyword = useSetRecoilState(selectedKeywordAtom);

	const handleSort = useCallback(
		(type: sortType) => {
			setSelectedKeyword(null); // 정렬 시 키워드 필터 리셋
			setSortType(type);
		},
		[setSortType, setSelectedKeyword],
	);

	return (
		<div className="fixed w-48 space-y-2">
			{(["default", "downloads", "recent"] as sortType[]).map(
				(
					type, //"popularity" api 고쳐지면 사용 예정
				) => (
					<button
						type="button"
						key={type}
						onClick={() => handleSort(type)}
						className="w-full px-4 py-2 text-left text-sm bg-surface-90 rounded-lg text-surface-white"
					>
						{type}
					</button>
				),
			)}
		</div>
	);
}

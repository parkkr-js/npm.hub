// store/atoms.ts

import { atom } from "recoil";
import type {
	SuggestionPackageInfo,
	SearchResultPackageInfo,
	DetailResultPackageInfo,
} from "@/types/package";
import type { PopularPackageInfo } from "@/types/package";
import type { sortType } from "@/types/common";

export const popularPackagesAtom = atom<PopularPackageInfo[]>({
	key: "popularPackagesAtom",
	default: [],
});

export const searchQueryAtom = atom<string>({
	key: "searchQueryAtom",
	default: "",
});

export const GoogletrendsAtom = atom<number | null>({
	key: "GoogletrendsnumberAtom",
	default: 0,
});

export const selectedKeywordAtom = atom<string | null>({
	key: "selectedKeywordAtom",
	default: "",
});

export const suggestionsAtom = atom<SuggestionPackageInfo[]>({
	key: "suggestionsAtom",
	default: [],
});

export const searchResultsAtom = atom<SearchResultPackageInfo[]>({
	key: "searchResultsAtom",
	default: [],
});

export const detailPackageAtom = atom<DetailResultPackageInfo[]>({
	key: "detailPackageAtom",
	default: [],
});

export const sortTypeAtom = atom<sortType>({
	key: "sortTypeAtom",
	default: "default",
});

// components/layout/ClientHeader.tsx

import Link from "next/link";
import SearchBox from "@/components/search/SearchBox";
import { Suspense } from "react";
import { SuggestionSkeleton } from "@/components/skeletons/SuggestionSkeleton";
import SuggestionList from "@/components/search/suggestions/SuggestionList";
import type { PageConfig } from "@/types/common";

interface ClientHeaderProps {
	config: PageConfig;
}

export default function ClientHeader({ config }: ClientHeaderProps) {
	return (
		<header className={`container mx-auto py-4 ${config.headerLayout}`}>
			<Link href="/">
				<h1
					className={`font-bold text-primary-50 cursor-pointer ${config.logoFont} ${config.logoSize}`}
				>
					npm.hub
				</h1>
			</Link>
			<div
				className={`relative ${config.searchBarWidth} ${config.searchBarHeight} ${config.searchBarPosition}`}
			>
				<SearchBox />
				{config.showSearchSuggestions && (
					<Suspense fallback={<SuggestionSkeleton />}>
						<div className="absolute w-full">
							<SuggestionList />
						</div>
					</Suspense>
				)}
			</div>
		</header>
	);
}

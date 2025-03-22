// compoenents/search-results/SearchResultItem.tsx
import { getTimeAgo, slashEncoding } from "@/lib/utils";
import { getPublisherAvatarUrl } from "@/lib/utils";
import { Keywords } from "@/components/search-results/Keywords";
import { Badge } from "@/components/ui/Badge";
import type { SearchResultPackageInfo } from "@/types/package";
import Image from "next/image";
import Link from "next/link";

interface SearchResultItemProps {
	result: SearchResultPackageInfo;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
	const { package: pkg, badges } = result;

	return (
		<div className="p-4 border-b border-secondary-80 animate-fadeIn">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<Link
							href={`/detail/${slashEncoding(pkg.name)}`}
							className="hover:opacity-80 transition-opacity"
						>
							<h2 className="text-xl font-medium text-primary-50">
								{pkg.name}
							</h2>
						</Link>
						<span className="text-sm text-surface-medium">v{pkg.version}</span>
						{badges?.isExactMatch && (
							<Badge variant="exactMatch">exact match</Badge>
						)}
						{badges?.isMostDownloaded && (
							<Badge variant="downloads">most downloads</Badge>
						)}
						{badges?.isMostRecent && (
							<Badge variant="recent">most recent</Badge>
						)}
						{/* 			{badges?.isMostPopular && (
							<Badge variant="popular">most popular</Badge>
						)}*/}
					</div>

					<p className="mt-2 w-[30.56rem] truncate text-surface-white">
						{pkg.description}
					</p>

					<div className="mt-3">
						<Keywords keywords={pkg.keywords} />
					</div>

					<div className="mt-4 flex items-center gap-4 text-sm text-surface-medium">
						<div className="flex items-center gap-2">
							<Image
								src={getPublisherAvatarUrl(pkg.publisher.username)}
								alt={pkg.publisher.username}
								width={24}
								height={24}
								className="rounded-full"
							/>
							<span>{pkg.publisher.username}</span>
						</div>
						<span>•</span>
						<span>{getTimeAgo(pkg.date)}</span>
					</div>
				</div>

				<div className="text-right">
					<div className="text-sm text-surface-medium">Downloads/week</div>
					<div className="text-lg font-medium text-surface-white">
						{pkg.downloadCount.toLocaleString()}
					</div>
				</div>
			</div>
		</div>
	);
}

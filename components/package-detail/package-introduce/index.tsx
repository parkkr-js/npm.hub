"use client";

import type { DetailResultPackageInfo } from "@/types/package";

import { DetailPackage } from "./DetailPackagefinal";

interface DetailPackageWrapperProps {
	initialResults: DetailResultPackageInfo[];
}

export function DetailPackageWrapper({
	initialResults,
}: DetailPackageWrapperProps) {
	const packageDetail = initialResults[0];

	return <DetailPackage result={packageDetail} />;
}

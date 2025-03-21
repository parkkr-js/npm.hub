// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientRoot from "@/components/ClientRoot";
import ClientLayout from "@/components/layout/ClientLayout";
import Script from "next/script";

export const metadata: Metadata = {
	metadataBase: new URL("https://npmhub.vercel.app"),
	title: {
		template: "%s | NPM Hub",
		default: "NPM Hub - NPM Package Search & Analytics Platform",
	},
	description:
		"Discover, analyze, and compare NPM packages with real-time analytics, download trends, GitHub metrics, and dependency insights. Make data-driven decisions for your JavaScript and TypeScript projects with comprehensive package statistics and visualization tools.",
	applicationName: "NPM Hub",
	manifest: "/manifest.json",
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
		],
		apple: "/apple-touch-icon.png",
	},
	keywords: [
		"npm",
		"package search",
		"javascript packages",
		"typescript packages",
		"npm analytics",
		"package trends",
		"github metrics",
		"dependency analysis",
		"npm registry",
		"package statistics",
		"npm 검색",
		"JavaScript 패키지",
		"TypeScript 패키지",
		"npm 분석",
		"패키지 트렌드",
		"react",
		"vue",
		"angular",
	],
	authors: [
		{ name: "박지성" },
		{ name: "우병희" },
		{ name: "백예은" },
		{ name: "김현서" },
	],
	creator: "박지성 우병희",
	publisher: "라스트 댄스",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "https://npmhub.vercel.app",
	},
	openGraph: {
		title: "NPM Hub - Your Smart Package Analytics Platform",
		description:
			"Analyze NPM packages with download stats, Google Search results, and GitHub metrics. Make informed package decisions with comprehensive analytics and visualizations.",
		url: "https://npmhub.vercel.app",
		siteName: "NPM Hub",
		images: [
			{
				url: "/opengraph-image.png",
				width: 1200,
				height: 630,
				alt: "NPM Hub - Package Analytics Dashboard",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "NPM Hub - Package Analytics Made Simple",
		description:
			"Find the perfect NPM packages with comprehensive analytics, trends, and insights.",
		creator: "@npmhub",
		images: ["/twitter-image.png"],
	},
	verification: {
		google: "KKAVIyXJmhqKL0jj2c6OT8mUawJAktjzV88OUMnCm_s",
	},
	category: "Technology",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<Script
					id="schema-org-organization"
					type="application/ld+json"
					strategy="afterInteractive"
				>
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "NPM Hub",
						url: "https://npmhub.vercel.app",
						logo: "https://npmhub.vercel.app/favicon.svg",
						sameAs: [],
					})}
				</Script>
				<Script
					id="schema-org-website"
					type="application/ld+json"
					strategy="afterInteractive"
				>
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "NPM Hub",
						url: "https://npmhub.vercel.app",
						description:
							"Discover, analyze, and compare NPM packages with real-time analytics, download trends, GitHub metrics, and dependency insights.",
						publisher: {
							"@type": "Organization",
							name: "NPM Hub",
						},
					})}
				</Script>
			</head>
			<body>
				<ClientRoot>
					<ClientLayout>{children}</ClientLayout>
				</ClientRoot>
			</body>
		</html>
	);
}

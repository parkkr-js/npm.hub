"use client";
/*
        // 상대 경로로 시작하는 이미지 주소만 변환 (http나 https로 시작하지 않는 경로)
        const processReadme에서 실행하엿고

*/

import type React from "react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { MarkDownProps } from "@/types/mark-down";
import { fetchReadme } from "@/app/api/mark-down/action";
import { Card } from "@/components/ui/card";
import { MarkDownSkeleton } from "@/components/skeletons/MarkDownSkeleton";

export default function Markdown({ packageName }: MarkDownProps) {
	const [readme, setReadme] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		async function getReadmeData() {
			setIsLoading(true);
			const { readme: readmeData, error: readmeError } =
				await fetchReadme(packageName);

			if (readmeError) {
				setError(readmeError);
			} else {
				setReadme(readmeData);
			}
			setIsLoading(false);
		}

		getReadmeData();
	}, [packageName]);

	if (isLoading) {
		return <MarkDownSkeleton />;
	}

	if (error) {
		return (
			<div className="w-[785px] bg-secondary-90 rounded-[20px] p-6 mb-6">
				<p className="text-xl font-semibold mb-2 text-[#ff000083]">
					We couldn’t find any README information on this package. It may not be
					available yet.
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="w-[785px] max-h-[850px]rounded-[20px] overflow-y-auto bg-secondary-90 text-primary-60 rounded-lg shadow-lg p-4">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[rehypeRaw, rehypeSanitize]}
					components={{
						h1: ({ children }) => (
							<h1 className="text-2xl font-bold my-4 pb-2 border-b border-gray-600">
								{children}
							</h1>
						),
						h2: ({ children }) => (
							<h2 className="text-xl font-bold my-3 pb-2 border-b border-gray-600">
								{children}
							</h2>
						),
						h3: ({ children }) => (
							<h3 className="text-lg font-bold my-2 pb-2 border-b border-gray-600">
								{children}
							</h3>
						),
						p: ({ children }) => (
							<p className="my-4 text-base leading-relaxed text-gray-300">
								{children}
							</p>
						),
						ul: ({ children }) => (
							<ul className="list-disc list-inside my-4 space-y-2 text-gray-300">
								{children}
							</ul>
						),
						ol: ({ children }) => (
							<ol className="list-decimal list-inside my-4 space-y-2 text-gray-300">
								{children}
							</ol>
						),
						li: ({ children }) => <li className="ml-4">{children}</li>,
						a: ({ href, children }) => (
							<a
								href={href}
								className="items-center  h-5 mx-2 hover:opacity-80"
								target="_blank"
								rel="noopener noreferrer"
							>
								{children}
							</a>
						),
						img: ({ src, alt }) => (
							<div className="my-4 bg-slate-800 inline-block">
								<img
									src={src || ""}
									alt={alt || ""}
									className="max-w-full h-auto"
								/>
							</div>
						),
						blockquote: ({ children }) => (
							<blockquote className="border-l-4 border-gray-600 pl-4 my-4 italic text-gray-400">
								{children}
							</blockquote>
						),
						code: ({
							inline,
							className,
							children,
							...props
						}: {
							inline?: boolean;
							className?: string;
							children?: React.ReactNode;
						}) => {
							const match = /language-(\w+)/.exec(className || "");

							if (!inline && match) {
								// 코드 블록 (```)
								const lang = match[1];
								// sh를 bash로 매핑 (SyntaxHighlighter는 sh를 직접 지원하지 않음)
								const language = lang === "sh" ? "bash" : lang;
								return (
									<div className="w-full my-4">
										<SyntaxHighlighter
											style={vscDarkPlus}
											language={language}
											PreTag="div"
											className="!bg-[#1e1f22] !rounded-2xl !p-6"
											{...props}
										>
											{String(children).replace(/\n$/, "")}
										</SyntaxHighlighter>
									</div>
								);
							}

							return (
								<code
									className="bg-[#3b82f6] text-white px-[6px] py-0.5 rounded text-[0.9em] inline-block"
									{...props}
								>
									{children}
								</code>
							);
						},
						table: ({ children }) => (
							<div className="overflow-x-auto my-4">
								<table className="min-w-full border-collapse border border-gray-600">
									{children}
								</table>
							</div>
						),
						th: ({ children }) => (
							<th className="border border-gray-600 px-4 py-2 bg-[#2d2d2d]">
								{children}
							</th>
						),
						td: ({ children }) => (
							<td className="border border-gray-600 px-4 py-2">{children}</td>
						),
					}}
				>
					{readme}
				</ReactMarkdown>
			</div>
		</div>
	);
}

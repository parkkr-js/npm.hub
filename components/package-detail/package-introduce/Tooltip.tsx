"use client";
import { useState, useMemo, useCallback } from "react";

interface TooltipProps {
	name: string;
}

export function Tooltip({ name }: TooltipProps) {
	const [tooltip, setTooltip] = useState(false);
	const npmCommand = useMemo(() => `npm i ${name}`, [name]);

	//
	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(npmCommand);
		setTooltip(true);
		setTimeout(() => {
			setTooltip(false);
		}, 500);
	}, [npmCommand]);

	return (
		<div className="flex-col">
			<div className="flex-col ml-[6%] mt-[10%] max-w-[170px] ">
				<p className="text-secondary-30 font-semibold text-base mr-4">
					Command
				</p>
				<div className="flex w-full bg-gray-200 h-10 p-2 rounded-lg bg-secondary-70 ">
					<p className=" overflow-x-auto whitespace-nowrap  [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[#FFF] ">{`npm i ${name}`}</p>
					<img
						onClick={handleCopy}
						onKeyUp={(e) => {
							if (e.key === "Enter") handleCopy();
						}}
						src="/images/copyvector.svg"
						alt="copy"
						className="cursor-pointer w-4 h-5 mt-1 ml-1"
					/>
				</div>
			</div>
			{tooltip && (
				<p
					className={`text-secondary-30 font-semibold ml-3 text-base transition-all duration-500 ease-in-out
               
                `}
				>
					Copied to clipboard!
				</p>
			)}
		</div>
	);
}

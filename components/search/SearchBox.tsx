"use client";
import { useTransition, useState, useCallback, useEffect } from "react";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchQueryAtom, suggestionsAtom } from "@/store/atoms";
import { getSuggestionPackages } from "@/app/api/npm";
import { usePathname, useRouter } from "next/navigation";
import { slashEncoding } from "@/lib/utils";
export default function SearchBox() {
	const [isPending, startTransition] = useTransition();
	const [inputValue, setInputValue] = useState("");
	const router = useRouter();
	const resetAtom = useResetRecoilState(searchQueryAtom);
	const pathname = usePathname();
	const setSearchQuery = useSetRecoilState(searchQueryAtom);
	const setSuggestions = useSetRecoilState(suggestionsAtom);

	useEffect(() => {
		if (!pathname.startsWith("/search")) {
			setInputValue("");
			resetAtom();
		}
	}, [pathname]);

	const handleSearch = useDebouncedCallback(
		(value: string) => {
			if (!value.trim()) {
				setSuggestions([]);
				setSearchQuery("");
				return;
			}

			startTransition(() => {
				setSearchQuery(value);
				getSuggestionPackages(value)
					.then((results) => {
						setSuggestions(results);
					})
					.catch((error) => {
						setSuggestions([]);
					});
			});
		},
		300,
		{ maxWait: 800 },
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setInputValue(value);
			handleSearch(value);
		},
		[handleSearch],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const trimmedValue = inputValue.trim();
			if (trimmedValue) {
				router.push(`/search/${slashEncoding(trimmedValue)}`);

				resetAtom();
			}
		},
		[inputValue, router],
	);

	return (
		<form onSubmit={handleSubmit} className="relative">
			<Input
				type="search"
				placeholder="Search packages..."
				value={inputValue}
				onChange={handleInputChange}
				className="w-full h-[51.06px] rounded-[27.5px] border-2 border-secondary-80 bg-secondary-90 pl-10 pr-16 py-4 text-surface-white placeholder:text-surface-medium focus:border-primary-60 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
			<button
				type="submit"
				disabled={isPending || !inputValue.trim()}
				className="absolute right-4 top-1/2 transform -translate-y-1/2 text-surface-white disabled:opacity-50"
			>
				<Search className="h-5 w-5" />
			</button>
		</form>
	);
}

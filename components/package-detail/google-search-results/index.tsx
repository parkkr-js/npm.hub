'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { SearchResult, SearchResultsProps } from '@/types/google-search';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { fetchGoogleSearch } from '@/app/api/google-search/action';
import { GoogleSearchResultSkeleton } from '@/components/skeletons/GoogleSearchSkeleton';
import { SearchError } from '@/types/error';
import { ErrorSearch } from './ErrorSearch';
export function GoogleSearchResults({ packageName }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<SearchError | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSearchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchGoogleSearch(packageName);
        setResults(data);
      } catch (err) {
        const searchError: SearchError =
          err instanceof Error ? err : new Error('Failed to fetch search results');

        if (err instanceof Error && 'status' in err) {
          searchError.status = (err as any).status;
        }

        setError(searchError);
      } finally {
        setIsLoading(false);
      }
    };

    loadSearchResults();
  }, [packageName]);

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 150,
        behavior: 'smooth',
      });
    }
  };
  if (isLoading) {
    return <GoogleSearchResultSkeleton />;
  }

  if (error) {
    return <ErrorSearch error={error} />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-secondary-90 w-80 max-h-[460px] flex flex-col rounded-[20px]">
        <div>
          <p className="ml-8 mt-6 text-xl font-semibold text-[#F5F6F8]">Related search</p>
          <p className="ml-8 text-xs font-normal text-secondary-40">
            Preview Google search results for a package.
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex flex-col overflow-y-auto px-6 py-3 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {results.map((result, index) => (
            <div
              key={index}
              className=" w-[272px] rounded-[10px] border border-[var(--secondary-black60,#7B7C81)] hover:shadow-lg transition-shadow duration-200"
            >
              <a href={result.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="flex flex-col py-[5px] px-[6px]">
                  <div className="text-xs w-[240px] overflow-hidden text-ellipsis whitespace-nowrap mb-1">
                    <p className="font-semibold text-xs text-[var(--surface-white,#FFF)] hover:underline truncate">
                      {result.title}
                    </p>
                  </div>
                  <p className="text-sm text-secondary-40 line-clamp-2">{result.snippet}</p>
                  <div className="flex mt-1 ">
                    {result.thumbnail ? (
                      <div className="w-4 h-4 rounded-lg mt-[2px] relative flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={`/api/image-proxy?url=${encodeURIComponent(result.thumbnail.src)}`}
                          alt={result.title}
                          width={result.thumbnail.width}
                          height={result.thumbnail.height}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-lg  mt-[2px] bg-gray-100 flex items-center justify-center flex-shrink-0 rounded">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <p className="text-sm text-secondary-40 ml-1 ">{result.displayLink}</p>
                    <ExternalLink className="text-gray-400 flex-shrink-0 ml-2" size={18} />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className=" mb-4 transition-transform duration-300 hover:opacity-80"
      >
        <Image
          src="/images/화살표아래.svg"
          alt="Show next"
          width={24}
          height={24}
          className="transition-transform duration-300"
        />
      </button>
    </div>
  );
}

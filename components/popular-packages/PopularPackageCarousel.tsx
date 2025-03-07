'use client';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getPublisherAvatarUrl, slashEncoding } from '@/lib/utils';
import { PopularPackageInfo } from '@/types/package';
import Image from 'next/image';
import Link from 'next/link';
import { useResetRecoilState } from 'recoil';
import { searchQueryAtom } from '@/store/atoms';
export default function PopularPackageCarousel({ packages }: { packages: PopularPackageInfo[] }) {
  if (!packages || packages.length === 0) {
    return <div className="w-full p-4 text-center text-surface-medium">패키지 없음</div>;
  }

  const getNpmProfileUrl = (username: string) => {
    return `https://www.npmjs.com/~${username}`;
  };

  const handleProfileClick = (username: string) => {
    if (username && username !== 'Unknown') {
      window.open(getNpmProfileUrl(username), '_blank');
    }
  };
  const resetSearchQuery = useResetRecoilState(searchQueryAtom);

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 pb-4">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="flex flex-col w-[300px] h-[205px] py-[23px] rounded-[23.03px] px-[20.9px] flex-none bg-secondary-90/50 border-surface-medium"
          >
            <div>
              <p className="text-2xl font-semibold w-auto text-primary-40 truncate">
                <Link href={`/detail/${slashEncoding(pkg.name)}`} onClick={resetSearchQuery}>
                  {pkg.name || 'Unknown Package'}
                </Link>
              </p>
            </div>
            <div className="mt-4">
              <p className="text-surface-white text-base whitespace-normal h-[72px] line-clamp-3">
                {pkg.description || 'No description available'}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                {(pkg.publisher?.email || pkg.author?.email) && (
                  <>
                    <Image
                      src={getPublisherAvatarUrl(pkg.publisher?.email || pkg.author?.email || '')}
                      alt={pkg.publisher?.username || pkg.author?.name || 'Unknown'}
                      width={15.562}
                      height={15.562}
                      className="rounded-full mt-2"
                      onClick={() =>
                        handleProfileClick(pkg.publisher?.username || pkg.author?.name || 'Unknown')
                      }
                    />
                    <p className="text-base mt-2 text-surface-medium">
                      {pkg.publisher?.username !== 'Unknown' ? pkg.publisher?.username : ''}
                      {pkg.publisher?.username !== 'Unknown' && pkg.author?.name !== 'Unknown'
                        ? ' · '
                        : ''}
                      {pkg.author?.name !== 'Unknown' ? pkg.author?.name : ''}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

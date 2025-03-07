'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { FaceFrownIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';
export default function NotFound() {
  const pathname = usePathname();

  if (pathname.match(/\/search|\/detail/)) {
    redirect('/');
  }

  return (
    <main className="flex h-full flex-col mt-40 items-center justify-center gap-3">
      <p className="font-tommy text-[77.336px] text-primary-50 font-extrabold">OOPS!</p>
      <p className="font-tommy text-[77.336px] -mt-9 text-primary-50 font-extrabold">
        Page not found.
      </p>
      <p className="text-2xl font-medium text-[#FFF]">
        we can't seem to find the page you're looking for.
      </p>
      <p className="text-2xl font-medium text-[#FFF]">Try going bact to the previous page</p>
      <Link
        href="/"
        className="mt-4 rounded-[50px] bg-secondary-90 px-4 py-2 text-xl text-[#F5F6F8]"
      >
        BACK TO HOME
      </Link>
    </main>
  );
}

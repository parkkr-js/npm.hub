import Link from 'next/link';
interface Errorprops {
  message: string;
}

export function Errorlayout({ message }: Errorprops) {
  return (
    <main className="flex h-full flex-col items-center gap-3">
      <section
        className="flex flex-col mt-[10%] bg-secondary-80 justify-center items-center gap-3 p-8 rounded-lg"
        role="alert"
        aria-label="Search results not found"
      >
        <h1 className="text-6xl font-tommy text-primary-50">{message}</h1>
      </section>
      <nav>
        <Link
          href="/"
          className="mt-4 rounded-[50px] bg-secondary-90 px-4 py-2 text-xl text-[#F5F6F8]"
        >
          BACK TO HOME
        </Link>
      </nav>
    </main>
  );
}

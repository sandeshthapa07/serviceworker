import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center items-center gap-8">
      <Link
        href="/bloglist"
        className="text-white bg-gray-400 px-4 py-2 rounded"
      >
        Blog
      </Link>
      <Link
        href="/webworker"
        className="text-white bg-gray-400 px-4 py-2 rounded"
      >
        Web Worker
      </Link>
      <Link href="/blog" className="text-white bg-gray-400 px-4 py-2 rounded">
        Editor
      </Link>
    </main>
  );
}

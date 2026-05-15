import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">SilkRoad China Export</h1>
        <p className="text-xl text-gray-600">Connecting global buyers with premium Chinese suppliers.</p>
      </header>

      <main className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/supplier/dashboard"
          className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Supplier Dashboard
        </Link>
      </main>

      <footer className="mt-24 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SilkRoad China Export. All rights reserved.
      </footer>
    </div>
  );
}

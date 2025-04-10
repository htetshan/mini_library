// pages/books/index.tsx
import Link from "next/link";

export default function BooksPage() {
  return (
    <main className="min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-semibold mb-4">📖 Books</h1>

      <p>This is where you can list, add, or manage books.</p>

      <Link
        href="/maindashboard"
        className="text-blue-600 underline mt-4 inline-block"
      >
        ← Back to Dashboard
      </Link>
    </main>
  );
}

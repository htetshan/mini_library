// pages/index.tsx
import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">📚 Library Dashboard</h1>

      <div className="space-y-4">
        <Link href="/maindashboard/books">
          <div className="bg-white p-4 rounded-xl shadow hover:bg-blue-50 cursor-pointer">
            📖 Manage Books
          </div>
        </Link>

        <Link href="/maindashboard/members">
          <div className="bg-white p-4 rounded-xl shadow hover:bg-green-50 cursor-pointer">
            👤 Manage Members
          </div>
        </Link>
      </div>
    </main>
  );
}

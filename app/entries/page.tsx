"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, query, orderByChild, get } from "firebase/database";
import { useRouter } from "next/navigation";

interface Entry {
  id: string;
  date: string;
  content: string;
  categories: string[];
  timestamp: number;
}

export default function EntriesPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsAuthed(true);
      loadEntries();
    }
  }, []);

  useEffect(() => {
    filterEntries();
  }, [selectedMonth, selectedCategory, entries]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const entriesRef = ref(database, "entries");
      const q = query(entriesRef, orderByChild("timestamp"));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const entriesArray: Entry[] = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        entriesArray.reverse();
        setEntries(entriesArray);

        // 전체 카테고리 수집
        const categories = new Set<string>();
        entriesArray.forEach((entry) => {
          entry.categories?.forEach((cat) => categories.add(cat));
        });
        setAllCategories(Array.from(categories).sort());
      }
    } catch (error) {
      console.error("기록 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (selectedMonth) {
      filtered = filtered.filter((e) => e.date.startsWith(selectedMonth));
    }

    if (selectedCategory) {
      filtered = filtered.filter((e) =>
        e.categories?.includes(selectedCategory)
      );
    }

    setFilteredEntries(filtered);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      localStorage.setItem("auth", password);
      setIsAuthed(true);
      loadEntries();
      setPassword("");
    } else {
      alert("비밀번호가 틀렸습니다");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthed(false);
    setEntries([]);
    setFilteredEntries([]);
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">🔐 로그인</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  const monthEntries = filteredEntries.reduce((acc, entry) => {
    const month = entry.date.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📊 기록 조회</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
        >
          로그아웃
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">로드 중...</div>
      ) : (
        <>
          {/* 필터 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월 선택
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 필터
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">모든 카테고리</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              총 {filteredEntries.length}개 기록
            </div>
          </div>

          {/* 기록 목록 */}
          <div className="space-y-8">
            {Object.entries(monthEntries)
              .reverse()
              .map(([month, monthEnts]) => (
                <div key={month}>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    📅 {month}
                  </h2>
                  <div className="space-y-4">
                    {monthEnts.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm font-medium text-gray-500">
                            {entry.date}
                          </div>
                          {entry.categories?.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-end">
                              {entry.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              기록이 없습니다
            </div>
          )}
        </>
      )}
    </div>
  );
}

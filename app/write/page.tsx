"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, push, query, orderByChild, limitToLast, get } from "firebase/database";
import { useRouter } from "next/navigation";

const CATEGORIES = ["고객대응", "템플릿", "전략", "개발", "마케팅", "운영", "기타"];

export default function WritePage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored === process.env.NEXT_PUBLIC_PASSWORD) {
      setIsAuthed(true);
      loadRecentEntries();
    }
  }, []);

  const loadRecentEntries = async () => {
    try {
      const entriesRef = ref(database, "entries");
      const q = query(entriesRef, orderByChild("timestamp"), limitToLast(7));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const entries = Object.values(snapshot.val()).reverse();
        setRecentEntries(entries as any[]);
      }
    } catch (error) {
      console.error("최근 기록 로드 실패:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      localStorage.setItem("auth", password);
      setIsAuthed(true);
      loadRecentEntries();
      setPassword("");
    } else {
      alert("비밀번호가 틀렸습니다");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("내용을 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const entriesRef = ref(database, "entries");
      await push(entriesRef, {
        date: selectedDate,
        content: content.trim(),
        categories: selectedCategories,
        timestamp: Date.now(),
      });

      alert("기록이 저장되었습니다!");
      setContent("");
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setSelectedCategories([]);
      loadRecentEntries();
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
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

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8">✍️ 오늘의 기록</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 입력 폼 */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 (중복 선택 가능)
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selectedCategories.includes(cat)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                오늘의 기록 (최대 500자)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 500))}
                placeholder="예: VOC 5건 처리, 만족도 4.5/5 | 마케팅 프로모션 기획 회의 | 리텐션 전략 분석..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {content.length}/500
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? "저장 중..." : "기록 저장"}
            </button>
          </form>
        </div>

        {/* 최근 기록 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">📝 최근 7일 기록</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">아직 기록이 없습니다</p>
            ) : (
              recentEntries.map((entry, idx) => (
                <div
                  key={idx}
                  className="border-l-4 border-blue-500 pl-3 py-2 text-sm"
                >
                  <div className="font-medium text-gray-800">
                    {entry.date}
                  </div>
                  <div className="text-gray-600 line-clamp-2 mt-1">
                    {entry.content}
                  </div>
                  {entry.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.categories.map((cat: string) => (
                        <span
                          key={cat}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "경력 포트폴리오",
  description: "업무 성과를 기록하고 관리하는 개인 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="bg-gray-50 min-h-full">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              📊 경력 포트폴리오
            </a>
            <div className="flex gap-6">
              <a href="/write" className="text-gray-600 hover:text-blue-600 transition">
                기록하기
              </a>
              <a href="/entries" className="text-gray-600 hover:text-blue-600 transition">
                기록 보기
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

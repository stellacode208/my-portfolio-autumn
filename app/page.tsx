"use client";

export default function Home() {
  return (
    <div className="py-12">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎯 경력 포트폴리오에 오신 것을 환영합니다
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          일일 업무 기록을 통해 당신의 경력 성장을 체계적으로 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-blue-600 mb-3">✍️ 기록하기</h2>
          <p className="text-gray-600 mb-4">
            오늘의 업무 성과, 배운 점, 팀 기여도 등을 자유롭게 기록하세요.
          </p>
          <a
            href="/write"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            기록 시작하기 →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-bold text-green-600 mb-3">📊 기록 보기</h2>
          <p className="text-gray-600 mb-4">
            지난 기록들을 조회하고 주간/월간 성과를 한눈에 확인하세요.
          </p>
          <a
            href="/entries"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            기록 조회하기 →
          </a>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-2">💡 팁</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• 매일 조금씩 기록하면 포트폴리오가 자동으로 완성됩니다</li>
          <li>• 정량적인 성과(건수, 비율) + 정성적인 내용(배운 점, 개선사항)을 함께 기록하세요</li>
          <li>• 분기/연간 리포트는 자동으로 생성됩니다</li>
        </ul>
      </div>
    </div>
  );
}

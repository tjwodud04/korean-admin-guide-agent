"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import AgentDiagram from "@/components/AgentDiagram";
import { Github, ExternalLink, Code2 } from "lucide-react";

export default function Home() {
  const [activeAgent, setActiveAgent] = useState<string>("triage");

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
            <Code2 className="w-4 h-4" />
            OpenAI Agent SDK Demo
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🇰🇷 한국 행정 서비스 가이드
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            외국인과 청소년을 위한 AI 행정 안내 서비스입니다.
            <br />
            복잡한 행정 용어를 쉬운 말로 설명해 드립니다.
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* 왼쪽: 에이전트 다이어그램 */}
          <div className="lg:col-span-2 space-y-6">
            <AgentDiagram activeAgent={activeAgent} />

            {/* 기술 스택 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                기술 스택
              </h3>
              <div className="space-y-3">
                <TechItem
                  name="OpenAI Agent SDK"
                  description="멀티에이전트 핸드오프 구현"
                  color="bg-green-500"
                />
                <TechItem
                  name="GPT-4o-mini"
                  description="빠르고 효율적인 응답 생성"
                  color="bg-purple-500"
                />
                <TechItem
                  name="Next.js 14"
                  description="React 서버 컴포넌트"
                  color="bg-black"
                />
                <TechItem
                  name="Tailwind CSS"
                  description="모던 UI 스타일링"
                  color="bg-cyan-500"
                />
              </div>
            </div>

            {/* 상담 분야 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                상담 가능 분야
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <CategoryCard emoji="🛂" title="비자/출입국" items={["외국인등록", "체류자격 변경", "비자 연장"]} />
                <CategoryCard emoji="🏠" title="주거/이사" items={["전입신고", "임대차 계약", "등본 발급"]} />
                <CategoryCard emoji="💰" title="세금" items={["연말정산", "종합소득세", "홈택스 사용"]} />
                <CategoryCard emoji="🏥" title="의료/건강" items={["건강보험 가입", "병원 이용", "건강검진"]} />
              </div>
            </div>
          </div>

          {/* 오른쪽: 채팅 인터페이스 */}
          <div className="lg:col-span-3">
            <ChatInterface onAgentChange={setActiveAgent} />
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-12 text-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="https://github.com/openai/openai-agents-python"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>Agent SDK</span>
            </a>
            <a
              href="https://openai.github.io/openai-agents-python/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Documentation</span>
            </a>
          </div>
          <p className="text-sm text-gray-500">
            Made with ❤️ using OpenAI Agent SDK
          </p>
        </footer>
      </div>
    </main>
  );
}

function TechItem({
  name,
  description,
  color,
}: {
  name: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <div>
        <span className="font-medium text-gray-800">{name}</span>
        <span className="text-gray-500 text-sm ml-2">{description}</span>
      </div>
    </div>
  );
}

function CategoryCard({
  emoji,
  title,
  items,
}: {
  emoji: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
      </div>
      <ul className="text-xs text-gray-600 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

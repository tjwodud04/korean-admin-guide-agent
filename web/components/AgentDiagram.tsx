"use client";

import { motion } from "framer-motion";

interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

const agents: Agent[] = [
  {
    id: "triage",
    name: "Triage Agent",
    emoji: "🎯",
    description: "질문 분류 및 라우팅",
    color: "bg-slate-500",
  },
  {
    id: "visa",
    name: "Visa Expert",
    emoji: "🛂",
    description: "비자/출입국",
    color: "bg-blue-500",
  },
  {
    id: "housing",
    name: "Housing Expert",
    emoji: "🏠",
    description: "주거/전입신고",
    color: "bg-green-500",
  },
  {
    id: "tax",
    name: "Tax Expert",
    emoji: "💰",
    description: "세금/연말정산",
    color: "bg-yellow-500",
  },
  {
    id: "healthcare",
    name: "Healthcare Expert",
    emoji: "🏥",
    description: "건강보험/의료",
    color: "bg-red-500",
  },
];

interface AgentDiagramProps {
  activeAgent?: string;
}

export default function AgentDiagram({ activeAgent }: AgentDiagramProps) {
  const triageAgent = agents[0];
  const expertAgents = agents.slice(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        멀티에이전트 구조
      </h3>

      {/* 아키텍처 다이어그램 */}
      <div className="relative">
        {/* Triage Agent (상단 중앙) */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              agent-card relative p-4 rounded-xl border-2
              ${activeAgent === "triage" ? "border-slate-500 bg-slate-50 agent-active" : "border-gray-200 bg-white"}
            `}
          >
            <div className="text-center">
              <span className="text-3xl">{triageAgent.emoji}</span>
              <p className="font-semibold text-gray-800 mt-1">{triageAgent.name}</p>
              <p className="text-xs text-gray-500">{triageAgent.description}</p>
            </div>
          </motion.div>
        </div>

        {/* 연결선 */}
        <div className="flex justify-center mb-2">
          <div className="w-0.5 h-6 bg-gray-300"></div>
        </div>

        {/* Handoff 라벨 */}
        <div className="flex justify-center mb-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
            handoff
          </span>
        </div>

        {/* 분기선 */}
        <div className="flex justify-center mb-2">
          <div className="relative w-3/4 h-4">
            <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-gray-300 -translate-x-1/2"></div>
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-300"></div>
            <div className="absolute top-2 left-0 w-0.5 h-2 bg-gray-300"></div>
            <div className="absolute top-2 left-1/4 w-0.5 h-2 bg-gray-300 -translate-x-1/2"></div>
            <div className="absolute top-2 left-3/4 w-0.5 h-2 bg-gray-300 -translate-x-1/2"></div>
            <div className="absolute top-2 right-0 w-0.5 h-2 bg-gray-300"></div>
          </div>
        </div>

        {/* Expert Agents (하단 4개) */}
        <div className="grid grid-cols-4 gap-2">
          {expertAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`
                agent-card relative p-3 rounded-xl border-2 text-center
                ${activeAgent === agent.id
                  ? `border-current bg-opacity-10 agent-active`
                  : "border-gray-200 bg-white"
                }
              `}
              style={{
                borderColor: activeAgent === agent.id ? getAgentColor(agent.id) : undefined,
                backgroundColor: activeAgent === agent.id ? `${getAgentColor(agent.id)}15` : undefined,
              }}
            >
              <span className="text-2xl">{agent.emoji}</span>
              <p className="font-medium text-gray-800 text-xs mt-1 truncate">
                {agent.name}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{agent.description}</p>
            </motion.div>
          ))}
        </div>

        {/* 도구 영역 */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm">🔧</span>
            <span className="text-xs text-gray-600">Tools: web_search, terminology</span>
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          질문 유형에 따라 Triage Agent가 적절한 전문 Agent로 핸드오프합니다
        </p>
      </div>
    </div>
  );
}

function getAgentColor(agentId: string): string {
  const colors: Record<string, string> = {
    triage: "#64748b",
    visa: "#3b82f6",
    housing: "#22c55e",
    tax: "#eab308",
    healthcare: "#ef4444",
  };
  return colors[agentId] || "#64748b";
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Bot, Sparkles } from "lucide-react";
import ApiKeyInput from "./ApiKeyInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onAgentChange?: (agentType: string) => void;
  language: "ko" | "en";
}

const EXAMPLE_QUESTIONS_KO = [
  { text: "외국인등록증 갱신하려면요?", category: "visa" },
  { text: "이사했는데 뭐 해야 해요?", category: "housing" },
  { text: "연말정산이 뭐예요?", category: "tax" },
  { text: "건강보험료 납부 방법은?", category: "healthcare" },
];

const EXAMPLE_QUESTIONS_EN = [
  { text: "How do I renew my alien registration card?", category: "visa" },
  { text: "I just moved. What should I do?", category: "housing" },
  { text: "What is year-end tax settlement?", category: "tax" },
  { text: "How do I pay health insurance?", category: "healthcare" },
];

export default function ChatInterface({ onAgentChange, language }: ChatInterfaceProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserNearBottomRef = useRef(true);

  const scrollToBottom = (force = false) => {
    if (force || isUserNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 사용자가 스크롤 위치를 변경했는지 확인
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // 하단에서 100px 이내면 "near bottom"으로 간주
      isUserNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    isUserNearBottomRef.current = true; // 새 메시지 전송 시 항상 하단으로 스크롤

    // 스트리밍을 위한 assistant 메시지 미리 추가
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-OpenAI-API-Key": apiKey,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      // 에이전트 타입 가져오기
      const agentType = response.headers.get("X-Agent-Type");
      if (onAgentChange && agentType) {
        onAgentChange(agentType);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "요청 실패");
      }

      // 스트리밍 응답 처리
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          // 메시지 업데이트
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: accumulatedContent }
                : m
            )
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content:
                  language === "en"
                    ? "Sorry, an error occurred. Please try again."
                    : "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const exampleQuestions = language === "en" ? EXAMPLE_QUESTIONS_EN : EXAMPLE_QUESTIONS_KO;

  // API Key가 없으면 입력 화면 표시
  if (!apiKey) {
    return <ApiKeyInput onApiKeySet={setApiKey} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[600px]">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">
              {language === "en" ? "Admin Service Guide" : "행정 서비스 가이드"}
            </h2>
            <p className="text-xs text-gray-500">
              {language === "en" ? "Ask me anything" : "무엇이든 물어보세요"}
            </p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {language === "en" ? "Hello! 👋" : "안녕하세요! 👋"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              {language === "en"
                ? "Ask me anything about Korean administrative services. I'll explain it simply."
                : "한국 행정 서비스에 대해 무엇이든 물어보세요. 쉬운 말로 설명해 드릴게요."}
            </p>

            {/* 예시 질문 */}
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  disabled={isLoading}
                  className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  <span className="text-gray-700">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* 아바타 */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-blue-500"
                        : "bg-gradient-to-br from-purple-500 to-pink-500"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* 메시지 버블 */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content || (
                        <span className="text-gray-400">...</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* 로딩 인디케이터 */}
        {isLoading && messages[messages.length - 1]?.content === "" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === "en" ? "Type your question..." : "질문을 입력하세요..."}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {language === "en" ? "Press Enter to send • GPT-5.1" : "Enter로 전송 • GPT-5.1"}
        </p>
      </div>
    </div>
  );
}

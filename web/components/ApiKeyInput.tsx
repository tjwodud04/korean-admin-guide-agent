"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export default function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateAndSetKey = async () => {
    if (!apiKey.trim()) {
      setError("API 키를 입력해주세요");
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      setError("올바른 OpenAI API 키 형식이 아닙니다 (sk-로 시작해야 합니다)");
      return;
    }

    setIsValidating(true);
    setError("");

    // 간단한 유효성 검사 (실제 API 호출로 확인)
    try {
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (data.valid) {
        onApiKeySet(apiKey);
      } else {
        setError(data.error || "유효하지 않은 API 키입니다");
      }
    } catch {
      // 검증 API가 없어도 일단 키 형식이 맞으면 통과
      if (apiKey.length > 20) {
        onApiKeySet(apiKey);
      } else {
        setError("API 키가 너무 짧습니다");
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      validateAndSetKey();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          OpenAI API 키 입력
        </h2>
        <p className="text-sm text-gray-500">
          서비스 이용을 위해 OpenAI API 키가 필요합니다.
          <br />
          키는 브라우저에만 저장되며 서버에 저장되지 않습니다.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="sk-..."
              className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <button
          onClick={validateAndSetKey}
          disabled={isValidating || !apiKey.trim()}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isValidating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              검증 중...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              시작하기
            </>
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          API 키 발급 방법
        </h3>
        <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
          <li>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenAI Platform
            </a>
            에 접속
          </li>
          <li>로그인 후 &quot;Create new secret key&quot; 클릭</li>
          <li>생성된 키를 복사하여 위에 입력</li>
        </ol>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        💡 API 키는 세션 동안만 유지됩니다. 새로고침 시 다시 입력해야 합니다.
      </p>
    </div>
  );
}

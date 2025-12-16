import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// 에이전트 정의
const AGENTS = {
  triage: {
    name: "안내",
    description: "질문을 분류하고 적절한 전문가에게 연결합니다",
  },
  visa: {
    name: "비자",
    description: "비자, 체류자격, 출입국 관련 전문",
  },
  housing: {
    name: "주거",
    description: "전입신고, 임대차, 주민등록 전문",
  },
  tax: {
    name: "세금",
    description: "세금, 연말정산, 홈택스 전문",
  },
  healthcare: {
    name: "의료",
    description: "건강보험, 의료 서비스 전문",
  },
};

// 한국어 시스템 프롬프트
const SYSTEM_PROMPT_KO = `당신은 한국 행정 서비스 안내 도우미입니다.
외국인과 청소년이 복잡한 한국 행정 서비스를 쉽게 이해할 수 있도록 도와줍니다.

## 상담 가능 분야
1. 비자/출입국: 외국인등록, 체류자격, 비자 연장, 귀화
2. 주거/전입신고: 이사, 전입신고, 임대차 계약, 등본 발급
3. 세금: 연말정산, 종합소득세, 홈택스 사용법
4. 건강보험/의료: 국민건강보험, 외국인 보험, 병원 이용

## 답변 규칙
1. 어려운 행정 용어는 쉬운 말로 풀어서 설명
2. 영어 병기 제공 (예: 전입신고 (Moving-in report))
3. 단계별로 명확하게 안내
4. 필요한 서류, 비용, 소요 시간 정보 포함
5. 관련 공식 사이트 안내 (정부24, 하이코리아 등)

## 응답 형식
- 반드시 한국어로 답변
- 친절하고 따뜻한 말투 사용
- 불필요한 이모지 사용 금지
- 바로 본론으로 들어가서 답변 (별도의 담당자 표시 불필요)`;

// 영어 시스템 프롬프트
const SYSTEM_PROMPT_EN = `You are a Korean Administrative Service Guide Assistant.
You help foreigners and young people easily understand complex Korean administrative services.

## Available Consultation Areas
1. Visa/Immigration: Alien registration, residence status, visa extension, naturalization
2. Housing/Moving: Moving-in report, lease contracts, resident registration certificate
3. Tax: Year-end tax settlement, income tax, HomeTax usage
4. Healthcare: National Health Insurance, foreigner insurance, hospital usage

## Response Rules
1. Explain difficult administrative terms in simple words
2. Provide Korean terms with English translations (e.g., 전입신고 (Moving-in report))
3. Guide step by step clearly
4. Include required documents, costs, and processing time
5. Provide official website information (Gov24, HiKorea, etc.)

## Response Format
- Always respond in English
- Use friendly and warm tone
- Do not use unnecessary emojis
- Get straight to the point (no expert label needed)`;

// 질문 분류 함수
function classifyQuestion(question: string): string {
  const q = question.toLowerCase();

  if (
    /비자|visa|체류|외국인등록|입국|출국|귀화|여권|passport|f-4|f-6|e-7|d-2|immigration|alien/i.test(q)
  ) {
    return "visa";
  }

  if (
    /이사|전입|등본|초본|주민등록|전세|월세|계약|부동산|housing|move|rent|lease|moving/i.test(q)
  ) {
    return "housing";
  }

  if (
    /세금|tax|연말정산|소득세|홈택스|납세|부가세|재산세|위택스|income|settlement/i.test(q)
  ) {
    return "tax";
  }

  if (
    /건강보험|병원|의료|보험료|건강검진|국민건강|healthcare|hospital|insurance|medical/i.test(q)
  ) {
    return "healthcare";
  }

  return "triage";
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // 헤더에서 API Key 가져오기
    const apiKey = request.headers.get("X-OpenAI-API-Key");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key가 필요합니다" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages: chatMessages, language = "ko" } = await request.json();

    if (!chatMessages || chatMessages.length === 0) {
      return new Response(JSON.stringify({ error: "메시지가 필요합니다" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 마지막 사용자 메시지로 분류
    const lastUserMessage = chatMessages
      .filter((m: { role: string }) => m.role === "user")
      .pop();
    const agentType = lastUserMessage
      ? classifyQuestion(lastUserMessage.content)
      : "triage";
    const currentAgent = AGENTS[agentType as keyof typeof AGENTS];

    // 시스템 프롬프트 선택
    const systemPrompt = language === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_KO;

    // OpenAI 클라이언트 생성
    const openai = createOpenAI({
      apiKey: apiKey,
    });

    // 스트리밍 응답 생성
    const result = streamText({
      model: openai("gpt-5.1"),
      system: systemPrompt,
      messages: chatMessages,
      maxOutputTokens: 2000,
      temperature: 0.7,
      onFinish: ({ usage }) => {
        // 로깅
        console.log({
          timestamp: new Date().toISOString(),
          model: "gpt-5.1",
          language,
          agentType,
          tokensUsed: usage?.totalTokens,
          latency: Date.now() - startTime,
        });
      },
    });

    // 에이전트 정보를 헤더에 포함하여 스트리밍 응답 반환
    const response = result.toTextStreamResponse();
    response.headers.set("X-Agent-Name", encodeURIComponent(currentAgent.name));
    response.headers.set("X-Agent-Type", agentType);
    return response;
  } catch (error: unknown) {
    console.error("API Error:", error);

    // Rate limit 에러 처리
    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message?: string };
      if (apiError.status === 429) {
        return new Response(
          JSON.stringify({
            error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(JSON.stringify({ error: "서버 오류가 발생했습니다" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

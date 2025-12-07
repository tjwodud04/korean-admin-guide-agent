import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 에이전트 정의 (Python 버전과 동일한 구조)
const AGENTS = {
  triage: {
    name: "Admin Guide",
    emoji: "🎯",
    description: "질문을 분류하고 적절한 전문가에게 연결합니다",
  },
  visa: {
    name: "Visa Expert",
    emoji: "🛂",
    description: "비자, 체류자격, 출입국 관련 전문",
  },
  housing: {
    name: "Housing Expert",
    emoji: "🏠",
    description: "전입신고, 임대차, 주민등록 전문",
  },
  tax: {
    name: "Tax Expert",
    emoji: "💰",
    description: "세금, 연말정산, 홈택스 전문",
  },
  healthcare: {
    name: "Healthcare Expert",
    emoji: "🏥",
    description: "건강보험, 의료 서비스 전문",
  },
};

// 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 한국 행정 서비스 안내 도우미입니다.
외국인과 청소년이 복잡한 한국 행정 서비스를 쉽게 이해할 수 있도록 도와줍니다.

## 상담 가능 분야
1. 🛂 비자/출입국: 외국인등록, 체류자격, 비자 연장, 귀화
2. 🏠 주거/전입신고: 이사, 전입신고, 임대차 계약, 등본 발급
3. 💰 세금: 연말정산, 종합소득세, 홈택스 사용법
4. 🏥 건강보험/의료: 국민건강보험, 외국인 보험, 병원 이용

## 답변 규칙
1. 어려운 행정 용어는 쉬운 말로 풀어서 설명
2. 영어 병기 제공 (예: 전입신고 (Moving-in report))
3. 단계별로 명확하게 안내
4. 필요한 서류, 비용, 소요 시간 정보 포함
5. 관련 공식 사이트 안내 (정부24, 하이코리아 등)

## 응답 형식
- 한국어 질문 → 한국어 답변
- 영어 질문 → 영어 답변
- 친절하고 따뜻한 말투 사용

응답 시작 시 [현재 담당: 에이전트명] 형식으로 어떤 전문가가 답변하는지 표시해주세요.
예: [현재 담당: 🛂 Visa Expert]`;

// 질문 분류 함수
function classifyQuestion(question: string): string {
  const q = question.toLowerCase();

  // 비자/출입국 키워드
  if (
    /비자|visa|체류|외국인등록|입국|출국|귀화|여권|passport|f-4|f-6|e-7|d-2|immigration/i.test(
      q
    )
  ) {
    return "visa";
  }

  // 주거/전입신고 키워드
  if (
    /이사|전입|등본|초본|주민등록|전세|월세|계약|부동산|housing|move|rent|lease/i.test(
      q
    )
  ) {
    return "housing";
  }

  // 세금 키워드
  if (
    /세금|tax|연말정산|소득세|홈택스|납세|부가세|재산세|위택스/i.test(q)
  ) {
    return "tax";
  }

  // 의료/건강보험 키워드
  if (
    /건강보험|병원|의료|보험료|건강검진|국민건강|healthcare|hospital|insurance/i.test(
      q
    )
  ) {
    return "healthcare";
  }

  return "triage";
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "메시지가 필요합니다" },
        { status: 400 }
      );
    }

    // 질문 분류
    const agentType = classifyQuestion(message);
    const currentAgent = AGENTS[agentType as keyof typeof AGENTS];

    // 메시지 히스토리 구성
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content || "응답을 생성할 수 없습니다.";

    return NextResponse.json({
      response,
      agent: currentAgent,
      agentType,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

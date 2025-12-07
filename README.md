# 🇰🇷 한국 행정 서비스 가이드 에이전트 | Korean Admin Guide Agent

[한국어](#한국어) | [English](#english)

---

# 한국어

OpenAI Agent SDK를 활용한 멀티에이전트 시스템 예제입니다.
외국인과 청소년이 복잡한 한국 행정 서비스를 쉽게 이해할 수 있도록 도와줍니다.

## 📌 프로젝트 개요

### 주요 기능

- 🛂 **비자/출입국**: 외국인등록, 체류자격, 비자 연장, 귀화
- 🏠 **주거/전입신고**: 이사, 전입신고, 임대차 계약, 등본 발급
- 💰 **세금**: 연말정산, 종합소득세, 홈택스 사용법
- 🏥 **건강보험/의료**: 국민건강보험, 외국인 보험, 병원 이용

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                      User Input                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Triage Agent                          │
│  • 질문 분류 및 라우팅                                    │
│  • 간단한 인사/일반 질문 직접 답변                         │
└────────┬────────┬────────┬────────┬─────────────────────┘
         │        │        │        │
    handoff  handoff  handoff  handoff
         │        │        │        │
         ▼        ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│  Visa  │ │House │ │ Tax  │ │Healthcare│
│ Agent  │ │Agent │ │Agent │ │  Agent   │
└────┬───┘ └───┬──┘ └───┬──┘ └────┬─────┘
     │         │        │         │
     └─────────┴────────┴─────────┘
                    │
                    ▼
         ┌─────────────────┐
         │     Tools       │
         │ • web_search    │
         │ • terminology   │
         └─────────────────┘
```

## 🚀 빠른 시작

### Python CLI 버전

```bash
git clone https://github.com/tjwodud04/korean-admin-guide-agent.git
cd korean-admin-guide-agent
pip install -r requirements.txt
cp .env.example .env  # API 키 설정
python main.py
```

### 🌐 웹 버전 (Next.js)

```bash
cd web
npm install
cp .env.example .env  # API 키 설정
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 📁 프로젝트 구조

```
korean-admin-guide-agent/
├── main.py              # 메인 실행 파일 (대화형 세션)
├── examples.py          # 다양한 사용 예제
├── requirements.txt     # 의존성 목록
├── .env.example         # 환경 변수 템플릿
│
├── agents/              # 에이전트 모듈
│   ├── __init__.py
│   ├── triage.py        # 트리아지 에이전트 (라우터)
│   ├── visa.py          # 비자/출입국 전문
│   ├── housing.py       # 주거/전입신고 전문
│   ├── tax.py           # 세금 전문
│   └── healthcare.py    # 의료/건강보험 전문
│
├── tools/               # 도구 모듈
│   ├── __init__.py
│   └── web_search.py    # 정부 사이트 검색, 용어 설명
│
└── web/                 # 🌐 웹 프론트엔드 (Next.js)
    ├── app/
    │   ├── api/chat/    # 챗봇 API 엔드포인트
    │   ├── page.tsx     # 메인 페이지
    │   └── layout.tsx   # 루트 레이아웃
    ├── components/
    │   ├── AgentDiagram.tsx    # 에이전트 구조 시각화
    │   └── ChatInterface.tsx   # 채팅 인터페이스
    └── README.md        # 웹 배포 가이드
```

## 🌐 Vercel 배포

```bash
cd web
npx vercel
```

또는 GitHub 연동 후 Vercel Dashboard에서:

1. Root Directory: `web` 설정
2. 환경 변수 `OPENAI_API_KEY` 추가

## 📚 참고 자료

### OpenAI Agent SDK

- [공식 문서](https://openai.github.io/openai-agents-python/)
- [GitHub](https://github.com/openai/openai-agents-python)
- [핸드오프 가이드](https://openai.github.io/openai-agents-python/handoffs/)

### 한국 행정 정보

- [정부24](https://www.gov.kr) - 통합 민원 서비스
- [하이코리아](https://www.hikorea.go.kr) - 외국인 출입국
- [국립국어원](https://korean.go.kr) - 행정용어 순화
- [홈택스](https://www.hometax.go.kr) - 국세
- [국민건강보험공단](https://www.nhis.or.kr) - 건강보험

---

# English

A multi-agent system example built with OpenAI Agent SDK.
Helps foreigners and young people easily understand complex Korean administrative services.

## 📌 Project Overview

### Key Features

- 🛂 **Visa/Immigration**: Alien registration, status of stay, visa extension, naturalization
- 🏠 **Housing/Moving**: Moving-in report, lease contracts, resident registration
- 💰 **Tax**: Year-end tax settlement, income tax, HomeTax guide
- 🏥 **Healthcare**: National Health Insurance, foreigner insurance, hospital usage

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      User Input                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   Triage Agent                          │
│  • Classifies and routes questions                      │
│  • Directly answers greetings/general questions         │
└────────┬────────┬────────┬────────┬─────────────────────┘
         │        │        │        │
    handoff  handoff  handoff  handoff
         │        │        │        │
         ▼        ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│  Visa  │ │House │ │ Tax  │ │Healthcare│
│ Agent  │ │Agent │ │Agent │ │  Agent   │
└────┬───┘ └───┬──┘ └───┬──┘ └────┬─────┘
     │         │        │         │
     └─────────┴────────┴─────────┘
                    │
                    ▼
         ┌─────────────────┐
         │     Tools       │
         │ • web_search    │
         │ • terminology   │
         └─────────────────┘
```

## 🚀 Quick Start

### Python CLI Version

```bash
git clone https://github.com/tjwodud04/korean-admin-guide-agent.git
cd korean-admin-guide-agent
pip install -r requirements.txt
cp .env.example .env  # Set your API key
python main.py
```

### 🌐 Web Version (Next.js)

```bash
cd web
npm install
cp .env.example .env  # Set your API key
npm run dev
```

Open http://localhost:3000 in your browser

## 📁 Project Structure

```
korean-admin-guide-agent/
├── main.py              # Main entry (interactive session)
├── examples.py          # Various usage examples
├── requirements.txt     # Dependencies
├── .env.example         # Environment variable template
│
├── agents/              # Agent modules
│   ├── __init__.py
│   ├── triage.py        # Triage agent (router)
│   ├── visa.py          # Visa/Immigration expert
│   ├── housing.py       # Housing/Moving expert
│   ├── tax.py           # Tax expert
│   └── healthcare.py    # Healthcare expert
│
├── tools/               # Tool modules
│   ├── __init__.py
│   └── web_search.py    # Government site search, terminology
│
└── web/                 # 🌐 Web frontend (Next.js)
    ├── app/
    │   ├── api/chat/    # Chatbot API endpoint
    │   ├── page.tsx     # Main page
    │   └── layout.tsx   # Root layout
    ├── components/
    │   ├── AgentDiagram.tsx    # Agent structure visualization
    │   └── ChatInterface.tsx   # Chat interface
    └── README.md        # Web deployment guide
```

## 🌐 Vercel Deployment

```bash
cd web
npx vercel
```

Or connect GitHub and configure in Vercel Dashboard:

1. Set Root Directory: `web`
2. Add environment variable `OPENAI_API_KEY`

## 📚 References

### OpenAI Agent SDK

- [Official Documentation](https://openai.github.io/openai-agents-python/)
- [GitHub](https://github.com/openai/openai-agents-python)
- [Handoffs Guide](https://openai.github.io/openai-agents-python/handoffs/)

### Korean Government Services

- [Government 24](https://www.gov.kr) - Integrated civil service portal
- [HiKorea](https://www.hikorea.go.kr) - Immigration services for foreigners
- [National Institute of Korean Language](https://korean.go.kr) - Administrative term simplification
- [HomeTax](https://www.hometax.go.kr) - National tax service
- [National Health Insurance](https://www.nhis.or.kr) - Health insurance

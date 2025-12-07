# 🇰🇷 한국 행정 서비스 가이드 - 웹 프론트엔드

OpenAI Agent SDK 데모를 위한 Next.js 웹 애플리케이션입니다.

## ✨ 주요 기능

- 🎯 **멀티에이전트 시각화**: 질문 유형에 따라 활성화되는 에이전트를 실시간으로 보여줍니다
- 💬 **대화형 인터페이스**: 챗봇 형태로 자연스럽게 질문하고 답변받을 수 있습니다
- 🌐 **한/영 지원**: 한국어와 영어 모두 지원합니다
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 🚀 로컬 실행

### 1. 의존성 설치

```bash
cd web
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 OpenAI API 키를 설정합니다:

```
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 🌍 Vercel 배포

### 방법 1: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd web
vercel
```

### 방법 2: GitHub 연동

1. GitHub에 프로젝트를 푸시합니다
2. [Vercel](https://vercel.com)에서 새 프로젝트 생성
3. GitHub 저장소 연결
4. 환경 변수 설정:
   - `OPENAI_API_KEY`: OpenAI API 키

### 환경 변수 설정 (Vercel Dashboard)

1. Vercel 프로젝트 설정으로 이동
2. "Environment Variables" 탭 클릭
3. 다음 변수 추가:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-your-api-key`
   - Environment: Production, Preview, Development 모두 선택

## 📁 프로젝트 구조

```
web/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # 챗봇 API 엔드포인트
│   ├── globals.css         # 전역 스타일
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
├── components/
│   ├── AgentDiagram.tsx    # 에이전트 구조 시각화
│   └── ChatInterface.tsx   # 채팅 인터페이스
├── public/                 # 정적 파일
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json            # Vercel 배포 설정
```

## 🔧 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o-mini

## 🎨 UI 구성 요소

### 1. AgentDiagram (에이전트 다이어그램)

```
        ┌─────────────┐
        │   Triage    │
        │   Agent     │
        └──────┬──────┘
               │ handoff
    ┌──────┬───┴───┬──────┐
    ▼      ▼       ▼      ▼
  Visa  Housing   Tax  Healthcare
```

- 현재 활성화된 에이전트가 하이라이트됩니다
- 핸드오프 흐름을 시각적으로 표현합니다

### 2. ChatInterface (채팅 인터페이스)

- 예시 질문 버튼으로 빠르게 시작
- 실시간 타이핑 인디케이터
- 에이전트별 아바타 표시

## 📝 API 엔드포인트

### POST `/api/chat`

**Request Body:**
```json
{
  "message": "외국인등록증 갱신하려면요?",
  "history": []
}
```

**Response:**
```json
{
  "response": "외국인등록증 갱신 절차를 안내해드릴게요...",
  "agent": {
    "name": "Visa Expert",
    "emoji": "🛂"
  },
  "agentType": "visa"
}
```

## 🔒 보안 주의사항

- `.env` 파일을 절대 Git에 커밋하지 마세요
- Vercel 환경 변수는 암호화되어 안전하게 저장됩니다
- API 키는 서버 사이드에서만 사용됩니다

## 📄 라이선스

MIT License

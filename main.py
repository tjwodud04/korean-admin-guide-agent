"""
한국 행정 서비스 가이드 에이전트
Korean Administrative Service Guide Agent

OpenAI Agent SDK를 활용한 멀티에이전트 시스템 예제
Multi-agent system example using OpenAI Agent SDK
"""

import asyncio
import os
from dotenv import load_dotenv

from agents import Runner
from agents.triage import triage_agent, setup_handoffs

# 환경 변수 로드
load_dotenv()


def check_api_key():
    """API 키 확인"""
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY가 설정되지 않았습니다.")
        print("   .env 파일을 생성하고 API 키를 설정해주세요.")
        print("   예: OPENAI_API_KEY=sk-...")
        return False
    return True


async def run_agent(user_input: str) -> str:
    """
    에이전트 실행

    Args:
        user_input: 사용자 입력

    Returns:
        에이전트 응답
    """
    result = await Runner.run(triage_agent, user_input)
    return result.final_output


def run_agent_sync(user_input: str) -> str:
    """
    에이전트 실행 (동기 버전)

    Args:
        user_input: 사용자 입력

    Returns:
        에이전트 응답
    """
    result = Runner.run_sync(triage_agent, user_input)
    return result.final_output


async def interactive_session():
    """대화형 세션 실행"""
    print("=" * 60)
    print("🇰🇷 한국 행정 서비스 가이드")
    print("   Korean Administrative Service Guide")
    print("=" * 60)
    print()
    print("안녕하세요! 한국 행정 서비스에 대해 무엇이든 물어보세요.")
    print("Hello! Ask me anything about Korean administrative services.")
    print()
    print("📌 상담 가능 분야:")
    print("   🛂 비자/출입국 (Visa/Immigration)")
    print("   🏠 주거/전입신고 (Housing/Moving)")
    print("   💰 세금/연말정산 (Tax)")
    print("   🏥 건강보험/의료 (Healthcare)")
    print()
    print("종료하려면 'quit' 또는 '종료'를 입력하세요.")
    print("-" * 60)

    while True:
        try:
            user_input = input("\n👤 You: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ["quit", "exit", "종료", "끝"]:
                print("\n감사합니다. 좋은 하루 되세요! 👋")
                print("Thank you. Have a great day! 👋")
                break

            print("\n🤖 Assistant: ", end="")
            response = await run_agent(user_input)
            print(response)

        except KeyboardInterrupt:
            print("\n\n세션이 종료되었습니다.")
            break
        except Exception as e:
            print(f"\n❌ 오류가 발생했습니다: {e}")


def main():
    """메인 함수"""
    if not check_api_key():
        return

    # 핸드오프 설정
    setup_handoffs()

    # 대화형 세션 실행
    asyncio.run(interactive_session())


if __name__ == "__main__":
    main()

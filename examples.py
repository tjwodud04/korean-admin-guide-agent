"""
예제 코드 - 다양한 사용 방법 데모
Example code - Various usage demonstrations
"""

import asyncio
import os
from dotenv import load_dotenv

from agents import Runner
from agents.triage import triage_agent, setup_handoffs

load_dotenv()


# ============================================================
# 예제 1: 단일 질문 처리 (동기)
# Example 1: Single question (sync)
# ============================================================

def example_single_question():
    """단일 질문 예제"""
    setup_handoffs()

    questions = [
        "외국인등록증 갱신하려면 어떻게 해야 하나요?",
        "I just moved to a new apartment. What should I do?",
        "연말정산이 뭐예요?",
        "건강보험료 납부 방법 알려주세요",
    ]

    print("=" * 60)
    print("📝 단일 질문 예제")
    print("=" * 60)

    for q in questions:
        print(f"\n👤 질문: {q}")
        print("-" * 40)
        result = Runner.run_sync(triage_agent, q)
        print(f"🤖 답변: {result.final_output[:200]}...")
        print()


# ============================================================
# 예제 2: 비동기 병렬 처리
# Example 2: Async parallel processing
# ============================================================

async def example_parallel_questions():
    """여러 질문 병렬 처리 예제"""
    setup_handoffs()

    questions = [
        "E-7 비자 연장 조건이 뭐예요?",
        "전입신고 기한이 며칠이에요?",
        "종합소득세 신고 기간이 언제예요?",
    ]

    print("=" * 60)
    print("⚡ 병렬 처리 예제")
    print("=" * 60)

    # 모든 질문을 동시에 처리
    tasks = [Runner.run(triage_agent, q) for q in questions]
    results = await asyncio.gather(*tasks)

    for q, r in zip(questions, results):
        print(f"\n👤 질문: {q}")
        print(f"🤖 답변: {r.final_output[:150]}...")


# ============================================================
# 예제 3: 행정 용어 설명
# Example 3: Terminology explanation
# ============================================================

def example_terminology():
    """행정 용어 설명 예제"""
    from tools import get_terminology_explanation

    terms = ["전입신고", "등본", "체류자격", "귀화"]

    print("=" * 60)
    print("📚 행정 용어 설명 예제")
    print("=" * 60)

    for term in terms:
        # function_tool로 정의된 함수는 직접 호출 가능
        result = get_terminology_explanation(term)
        print(result)


# ============================================================
# 예제 4: 특정 에이전트 직접 호출
# Example 4: Direct agent call
# ============================================================

def example_direct_agent():
    """특정 에이전트 직접 호출 예제"""
    from agents.visa import visa_agent

    print("=" * 60)
    print("🎯 비자 에이전트 직접 호출 예제")
    print("=" * 60)

    question = "F-4 비자로 한국에서 일할 수 있나요?"
    print(f"\n👤 질문: {question}")

    result = Runner.run_sync(visa_agent, question)
    print(f"🤖 답변: {result.final_output}")


# ============================================================
# 메인
# ============================================================

def main():
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY가 설정되지 않았습니다.")
        return

    print("\n" + "=" * 60)
    print("🚀 OpenAI Agent SDK 예제 실행")
    print("=" * 60 + "\n")

    # 예제 선택
    print("실행할 예제를 선택하세요:")
    print("1. 단일 질문 처리")
    print("2. 병렬 질문 처리")
    print("3. 행정 용어 설명")
    print("4. 비자 에이전트 직접 호출")
    print("5. 전체 실행")

    choice = input("\n선택 (1-5): ").strip()

    if choice == "1":
        example_single_question()
    elif choice == "2":
        asyncio.run(example_parallel_questions())
    elif choice == "3":
        example_terminology()
    elif choice == "4":
        example_direct_agent()
    elif choice == "5":
        example_single_question()
        asyncio.run(example_parallel_questions())
        example_terminology()
        example_direct_agent()
    else:
        print("잘못된 선택입니다.")


if __name__ == "__main__":
    main()

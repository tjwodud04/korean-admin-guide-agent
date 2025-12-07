"""
웹 검색 도구 - 정부 공식 사이트 검색용
Web search tool for official government sites
"""

import httpx
from agents import function_tool


@function_tool
def search_government_info(query: str, category: str = "general") -> str:
    """
    한국 정부 공식 정보를 검색합니다.

    Args:
        query: 검색할 내용 (예: "외국인등록증 갱신", "전입신고 방법")
        category: 검색 카테고리 (visa, housing, tax, healthcare, general)

    Returns:
        검색 결과 요약 텍스트
    """
    # 카테고리별 추천 공식 사이트
    official_sites = {
        "visa": [
            "https://www.hikorea.go.kr - 하이코리아 (출입국외국인정책본부)",
            "https://www.immigration.go.kr - 출입국관리사무소",
        ],
        "housing": [
            "https://www.gov.kr - 정부24",
            "https://www.easylaw.go.kr - 찾기쉬운생활법령정보",
        ],
        "tax": [
            "https://www.nts.go.kr - 국세청",
            "https://www.hometax.go.kr - 홈택스",
            "https://www.wetax.go.kr - 위택스 (지방세)",
        ],
        "healthcare": [
            "https://www.nhis.or.kr - 국민건강보험공단",
            "https://www.mohw.go.kr - 보건복지부",
        ],
        "general": [
            "https://www.gov.kr - 정부24",
            "https://www.korean.go.kr - 국립국어원 (행정용어 순화)",
            "https://www.minwon.go.kr - 민원24",
        ],
    }

    sites = official_sites.get(category, official_sites["general"])

    # 실제 구현에서는 여기서 웹 검색 API 호출
    # 예: Tavily, Serper, Google Custom Search 등

    return f"""
[검색 쿼리]: {query}
[카테고리]: {category}

[추천 공식 사이트]:
{chr(10).join(f"- {site}" for site in sites)}

[안내]
위 공식 사이트에서 "{query}"를 검색하시면 정확한 정보를 확인할 수 있습니다.
실제 서비스에서는 이 도구가 자동으로 공식 사이트를 검색하여 최신 정보를 제공합니다.
"""


@function_tool
def get_terminology_explanation(term: str) -> str:
    """
    어려운 행정 용어를 쉬운 말로 설명합니다.

    Args:
        term: 설명이 필요한 행정 용어 (예: "전입신고", "등본", "인감증명")

    Returns:
        쉬운 설명
    """
    # 자주 사용되는 행정 용어 사전 (국립국어원 순화어 기반)
    terminology_dict = {
        "전입신고": {
            "쉬운말": "이사 신고",
            "설명": "새로운 주소지로 이사했을 때 동주민센터에 알리는 것",
            "영어": "Moving-in report / Address change notification",
        },
        "등본": {
            "쉬운말": "증명서 사본",
            "설명": "공식 문서의 내용을 그대로 옮겨 적은 증명서",
            "영어": "Certified copy",
        },
        "초본": {
            "쉬운말": "요약 증명서",
            "설명": "공식 문서에서 필요한 부분만 뽑아 적은 증명서",
            "영어": "Abstract / Extract",
        },
        "인감증명": {
            "쉬운말": "도장 확인서",
            "설명": "관공서에 미리 등록한 도장이 본인 것임을 증명하는 서류",
            "영어": "Seal certificate",
        },
        "주민등록": {
            "쉬운말": "주민 신고",
            "설명": "대한민국 국민이 어디에 사는지 나라에 알리고 등록하는 제도",
            "영어": "Resident registration",
        },
        "체류자격": {
            "쉬운말": "비자 종류",
            "설명": "외국인이 한국에 머물 수 있는 자격/이유 (예: 취업, 유학, 결혼 등)",
            "영어": "Status of stay / Visa type",
        },
        "재외동포": {
            "쉬운말": "해외 거주 한국인",
            "설명": "외국 국적을 가졌지만 한국계인 사람, 또는 외국에 오래 사는 한국인",
            "영어": "Overseas Korean",
        },
        "귀화": {
            "쉬운말": "국적 바꾸기",
            "설명": "외국인이 한국 국적을 취득하는 것",
            "영어": "Naturalization",
        },
    }

    if term in terminology_dict:
        info = terminology_dict[term]
        return f"""
[용어]: {term}
[쉬운 말]: {info['쉬운말']}
[설명]: {info['설명']}
[영어]: {info['영어']}
"""
    else:
        return f"""
[용어]: {term}
[안내]: 이 용어에 대한 정보가 사전에 없습니다.
일반적인 설명을 드리겠습니다. 더 정확한 정보는 국립국어원(korean.go.kr)의
'알기 쉬운 행정용어'를 참고해주세요.
"""

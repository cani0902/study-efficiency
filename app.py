import streamlit as st

# ==========================================
# 페이지 설정
# ==========================================

st.set_page_config(
    page_title="AI 학습 효율 진단 시스템",
    page_icon="📚",
    layout="wide"
)

# ==========================================
# 제목
# ==========================================

st.title("📚 AI 학습 효율 진단 시스템")

st.markdown("""
머신러닝 분석 결과를 기반으로

**당신의 생활 습관이 학습 효율에 어떤 영향을 미치는지 분석합니다.**

입력한 공부 시간과 생활 습관을 바탕으로
실질적인 공부 효과를 계산합니다.
""")

st.divider()

# ==========================================
# 입력 영역
# ==========================================

col1, col2 = st.columns(2)

with col1:

    st.subheader("📖 공부 습관")

    study = st.slider(
        "하루 공부 시간",
        0.0,
        12.0,
        4.0,
        0.5
    )

    sleep = st.slider(
        "하루 수면 시간",
        4.0,
        10.0,
        7.0,
        0.5
    )

    attendance = st.slider(
        "출석률 (%)",
        50,
        100,
        90
    )

with col2:

    st.subheader("📱 생활 습관")

    sns = st.slider(
        "SNS 사용 시간",
        0.0,
        8.0,
        2.0,
        0.5
    )

    ott = st.slider(
        "OTT 시청 시간",
        0.0,
        8.0,
        1.0,
        0.5
    )

    exercise = st.slider(
        "주간 운동 횟수",
        0,
        7,
        3
    )

diet = st.radio(
    "식습관 수준",
    ["Good", "Fair", "Poor"],
    horizontal=True
)

st.divider()

# ==========================================
# 분석 버튼
# ==========================================

if st.button("🚀 AI 분석 시작", use_container_width=True):

    score = 0

    strengths = []
    improvements = []

    # ======================================
    # 변수 중요도 기반 반영
    # ======================================

    # 수면 (22.8%)

    if 7 <= sleep <= 8:
        score += 22.8
        strengths.append("충분한 수면 시간을 유지하고 있습니다.")
    elif sleep < 6:
        score -= 22.8
        improvements.append("수면 시간이 부족합니다.")

    # SNS (23.2%)

    if sns <= 1:
        score += 23.2
        strengths.append("SNS 사용 시간을 잘 관리하고 있습니다.")
    elif sns >= 5:
        score -= 23.2
        improvements.append("SNS 사용 시간이 많습니다.")

    # OTT (20.0%)

    if ott <= 1:
        score += 20.0
    elif ott >= 4:
        score -= 20.0
        improvements.append("OTT 시청 시간이 많습니다.")

    # 출석률 (14.9%)

    if attendance >= 95:
        score += 14.9
        strengths.append("출석률이 매우 우수합니다.")
    elif attendance < 80:
        score -= 14.9
        improvements.append("출석률이 낮습니다.")

    # 운동 (13.6%)

    if exercise >= 3:
        score += 13.6
        strengths.append("규칙적인 운동 습관이 있습니다.")
    elif exercise == 0:
        score -= 13.6
        improvements.append("운동량이 부족합니다.")

    # 식습관 (3.6%)

    if diet == "Good":
        score += 3.6
    elif diet == "Poor":
        score -= 3.6
        improvements.append("식습관 개선이 필요합니다.")

    # ======================================
    # 효율 계산
    # ======================================

    efficiency = 100 + score

    efficiency = max(50, min(150, efficiency))

    effective_study = study * (efficiency / 100)

    st.divider()

    # ======================================
    # 결과 카드
    # ======================================

    st.subheader("📊 분석 결과")

    col1, col2 = st.columns(2)

    with col1:
        st.metric(
            "학습 효율",
            f"{efficiency:.1f}%"
        )

    with col2:
        st.metric(
            "실질적 공부 시간",
            f"{effective_study:.2f} 시간"
        )

    # ======================================
    # 효율 게이지
    # ======================================

    st.progress(min(efficiency / 150, 1.0))

    if efficiency >= 110:
        st.success("현재 생활 습관이 학습 효율 향상에 긍정적으로 작용하고 있습니다.")
    elif efficiency >= 90:
        st.info("보통 수준의 학습 효율입니다.")
    else:
        st.warning("생활 습관 개선을 통해 학습 효율을 높일 수 있습니다.")

    # ======================================
    # 학습 시간 비교
    # ======================================

    st.subheader("⏱ 공부 시간 분석")

    st.write(
        f"""
        현재 입력한 공부 시간은 **{study:.1f}시간**입니다.

        생활 습관을 반영한 결과

        실질적인 학습 효과는 **{effective_study:.2f}시간**으로 분석되었습니다.
        """
    )

    # ======================================
    # 강점
    # ======================================

    st.subheader("✅ 강점")

    if strengths:
        for item in strengths:
            st.success(item)
    else:
        st.write("특별히 강점으로 분석된 항목이 없습니다.")

    # ======================================
    # 개선 필요
    # ======================================

    st.subheader("⚠ 개선이 필요한 부분")

    if improvements:
        for item in improvements:
            st.warning(item)
    else:
        st.success("생활 습관이 매우 우수합니다.")

    # ======================================
    # AI 추천
    # ======================================

    st.subheader("🤖 AI 추천")

    recommendation = []

    if sleep < 7:
        recommendation.append("수면 시간을 7시간 이상 확보해보세요.")

    if sns >= 3:
        recommendation.append("SNS 사용 시간을 줄여보세요.")

    if ott >= 3:
        recommendation.append("OTT 시청 시간을 줄여보세요.")

    if attendance < 95:
        recommendation.append("출석률을 높이면 학습 효과 향상에 도움이 됩니다.")

    if exercise < 3:
        recommendation.append("주 3회 이상 운동을 권장합니다.")

    if diet == "Poor":
        recommendation.append("식습관 개선이 필요합니다.")

    if recommendation:
        for r in recommendation:
            st.write("•", r)
    else:
        st.success("현재 생활 습관이 매우 우수합니다.")

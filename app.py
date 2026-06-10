import streamlit as st

st.set_page_config(page_title="학습 효율 분석기")

st.title("📚 학습 효율 분석기")

study = st.number_input(
    "하루 공부 시간(시간)",
    0.0,
    24.0,
    4.0
)

sleep = st.number_input(
    "하루 수면 시간",
    0.0,
    12.0,
    7.0
)

sns = st.number_input(
    "SNS 사용 시간",
    0.0,
    12.0,
    2.0
)

ott = st.number_input(
    "OTT 시청 시간",
    0.0,
    12.0,
    1.0
)

attendance = st.slider(
    "출석률",
    0,
    100,
    90
)

exercise = st.slider(
    "주간 운동 횟수",
    0,
    7,
    3
)

diet = st.selectbox(
    "식습관",
    ["Poor", "Fair", "Good"]
)

extra = st.selectbox(
    "비교과 활동 참여",
    ["No", "Yes"]
)

if st.button("분석하기"):

    score = 0

    # 수면
    if 7 <= sleep <= 8:
        score += 22.8
    elif sleep < 6:
        score -= 22.8

    # SNS
    if sns <= 1:
        score += 23.2
    elif sns >= 5:
        score -= 23.2

    # OTT
    if ott <= 1:
        score += 20.0
    elif ott >= 4:
        score -= 20.0

    # 출석률
    if attendance >= 95:
        score += 14.9
    elif attendance < 80:
        score -= 14.9

    # 운동
    if exercise >= 3:
        score += 13.6
    elif exercise == 0:
        score -= 13.6

    # 식습관
    if diet == "Good":
        score += 3.6
    elif diet == "Poor":
        score -= 3.6

    # 비교과
    if extra == "Yes":
        score += 1.9

    efficiency = 100 + score

    efficiency = max(50, min(150, efficiency))

    effective_study = study * (efficiency / 100)

    st.subheader("분석 결과")

    st.metric(
        "학습 효율",
        f"{efficiency:.1f}%"
    )

    st.metric(
        "실질적 공부 시간",
        f"{effective_study:.2f} 시간"
    )

    st.write(
        f"""
        현재 공부 시간은 {study:.1f}시간입니다.

        생활 습관을 반영한 결과

        실질적인 학습 효과는

        약 {effective_study:.2f}시간으로 분석되었습니다.
        """
    )

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Google GenAI
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// API endpoint for AI Coaching Feedback
app.post("/api/coach", async (req, res) => {
  try {
    const { input, result } = req.body;

    if (!input || !result) {
      return res.status(400).json({ error: "Missing calculation data" });
    }

    const ai = getAiClient();

    if (!ai) {
      // Return high-quality, personalized fallback analysis if API key is not configured
      console.log("GEMINI_API_KEY is not configured. Using rule-based coaching feedback.");
      return res.json({
        feedback: generateFallbackCoaching(input, result),
        isFallback: true
      });
    }

    const prompt = `
당신은 학생들의 공부 습관과 수면, 디지털 매체 사용 등을 분석해 조언해주는 친절하고 지혜로운 'AI 학습 코치'입니다.
다음은 사용자의 생활 습관 및 머신러닝 기반 학습 효율 분석 결과 데이터입니다.

- 입력 공부 시간: ${input.studyHours}시간
- 계산된 학습 효율: ${result.efficiency}%
- 실질 공부 시간: ${result.effectiveStudyHours}시간
- 수면 시간: ${input.sleepHours}시간 (중요도 22.8%)
- SNS 사용 시간: ${input.snsHours}시간 (중요도 23.2%)
- OTT 시청 시간: ${input.ottHours}시간 (중요도 20.0%)
- 학교 출석률: ${input.attendanceRate}% (중요도 14.9%)
- 운동 빈도: 주 ${input.exerciseFrequency}회 (중요도 13.6%)
- 식습관 진단: ${input.eatingHabit === 'good' ? '좋음 (대뇌 혈류 안정)' : input.eatingHabit === 'normal' ? '보통 (일반적)' : '나쁨 (불규칙/식곤증 유발)'} (중요도 3.6%)
- 비교과 활동 참여: ${input.coActivity === 'yes' ? '참여' : '미참여'} (중요도 1.9%)

위 수치들은 머신러닝의 다차원 변수 분석 결과입니다. 학습 효율에 가장 부정적 요인을 끼치는 상위 1-2개 나쁜 버릇과, 가장 호재가 되는 활기찬 습관 1-2개를 지목해 주세요.

다음 형식을 준수하여 부드럽고 설득력 넘치는 한국어(Apple/Notion 풍의 어조)로 마크다운 형식의 답변을 작성해주세요. 하트를 섞거나 장난스러운 말투보단 영감을 주며 학생이 내일 당장 움직이게 만드는 '실천 요령'에 집중하세요.

[요청 양식]:
### 🌟 학습 코치의 총평
(현재 실질 공부 시간인 ${result.effectiveStudyHours}시간을 늘리기 위해 오늘의 지저분한 시간을 밀어내고 효율 상태를 더 높일 수 있도록 따뜻하면서 지적인 분석과 응원을 한 문단으로 작성해주세요.)

### 🔍 결정적 병목 현상 (개선이 시급한 점)
* **(SNS 등 지목)**: (머신러닝 중요도 기반으로 분석하여, 수면 부족이나 미디어 시청 등이 집중 뇌파에 어떤 악영향을 주는지 팩트로 전달.)
* **(또 다른 병목)**: (개선이 시급한 두 번째 요인 기재. 습관이 다 깨끗하다면 유지에 관한 글을 써주세요.)

### 🚀 학습 습관 부스팅을 위한 3단계 실천 플랜
1. **1단계: (기상 1시간 폰 안 보거나 낮잠 등 구체적 미션)**: 구체적인 시간 제한과 실행 방식을 제시하세요.
2. **2단계: (예시: 뽀모도로, 기차 루틴)**: 학습의 흐름을 만드는 법을 알려주세요.
3. **3단계: (식습관이나 눈의 피로 관리)**: 몸과 위장의 건강을 함께 관리하는 법입니다.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    res.json({
      feedback: response.text || generateFallbackCoaching(input, result),
      isFallback: false
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "AI 생성 중 오류가 발생했습니다.",
      details: error.message
    });
  }
});

// Fallback rule-based feedback generator
function generateFallbackCoaching(input: any, result: any): string {
  let primaryWarning = "";
  if (input.snsHours >= 3 || input.ottHours >= 3) {
    primaryWarning = `가장 방해가 되는 요인은 **도파민 과부하를 일으키는 미디어 사용(SNS ${input.snsHours}시간, OTT ${input.ottHours}시간)**입니다. 뇌에 쏟아지는 자극적인 시각 잔상은 책을 펼쳤을 때 인지적 집중력을 순간적으로 급락시켜 실질 공부 시간을 약화시킵니다.`;
  } else if (input.sleepHours < 6) {
    primaryWarning = `현재 **부족한 수면량(${input.sleepHours}시간)**이 든든한 학습 컨디션의 최대 저해 요소입니다. 잠이 줄면 판단을 담당하는 대뇌 전두엽 활성도가 떨어져 같은 2시간 공부를 하더라도 효율이 극도로 고갈됩니다.`;
  } else {
    primaryWarning = `전체적으로 규칙적인 삶을 살고자 애쓰고 계십니다. 다만 운동이나 식습관처럼 뇌 혈류 공급을 유도하는 미세 가점을 조금 더 자극한다면 현재의 효율을 100% 한계치까지 돌파할 수 있습니다.`;
  }

  const step1 = input.snsHours > 200/60 || input.snsHours > 1.5 
    ? "공부하기 30분 전 스마트폰을 보이지 않는 수납함에 보관하고 타이머 설정하기" 
    : "수면 기상 시간의 일관성을 높이기 위해 수면 루틴을 매일 15분씩 늘리기";

  const step2 = input.exerciseFrequency < 3 
    ? "의자에 90분 앉아있었다면 일어나서 가벼운 스쿼트나 스트레칭 3분 하기 (주 2-3회 유산소 추천)" 
    : "학습 루틴 중 뽀모도로(25분 몰입, 5분 휴식) 기법을 4세트 도입해 뇌 피로 환기하기";

  return `### 🌟 학습 코치의 총평
사용자님의 현재 학습 효율은 **${result.efficiency}%**이며, 계획하신 ${input.studyHours}시간 중 실제로 뇌에 온전히 흡수된 공부 시간은 **${result.effectiveStudyHours}시간**입니다. 생활 습관은 단순한 체력 유지를 넘어 무의식적 인지 기능을 조절하는 가장 중요한 변수입니다. 잔여 피로를 걷어내면 순수 효율을 최대 수준으로 부스팅할 수 있습니다.

### 🔍 결정적 병목 현상 (개선이 시급한 점)
* ${primaryWarning}
* **루틴 정량성 부족**: 출석, 식사의 규칙성, 혈당 변동 주기는 대뇌 전반적인 각성 마비를 좌우합니다. 일관된 사이클 수립이 전보다 더 강력한 집약 공부를 도출할 것입니다.

### 🚀 학습 습관 부스팅을 위한 3단계 실천 플랜
1. **1단계 [강성 차단]**: ${step1}
2. **2단계 [두뇌 활성]**: ${step2}
3. **3단계 [식단 관리]**: 점심 학업 전 단 음식이나 탄당질 간식을 배제하고 통곡물이나 비자극적인 단백질 식단을 채용해 저녁 식곤증을 예방할 것.`;
}

// Vite and Single-Page Application setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started. Web interface running on http://localhost:${PORT}`);
  });
}

startServer();

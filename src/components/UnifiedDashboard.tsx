import { useMemo } from 'react';
import { LifestyleInput, CalculationResult } from '../types';
import { calculateEfficiency } from '../utils/calculator';
import { 
  BookOpen, 
  Moon, 
  Smartphone, 
  Tv, 
  School, 
  Activity, 
  Utensils, 
  Award, 
  RotateCcw,
  Zap,
  Brain,
  ArrowRight
} from 'lucide-react';

interface UnifiedDashboardProps {
  input: LifestyleInput;
  onChange: (field: keyof LifestyleInput, value: any) => void;
  onReset: () => void;
}

export default function UnifiedDashboard({ 
  input, 
  onChange, 
  onReset 
}: UnifiedDashboardProps) {

  // Auto-calculate on every state change
  const result: CalculationResult = useMemo(() => {
    return calculateEfficiency(input);
  }, [input]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Premium Header Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo only with Korean text, no secondary subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">학습 효율 측정기</h1>
          </div>

          <button
            onClick={onReset}
            className="px-3 py-1.5 border border-slate-200 text-xs text-slate-600 rounded-xl flex items-center gap-1.5 hover:bg-slate-50 font-bold transition-all cursor-pointer shadow-xs"
            title="습관 값들을 모두 초기화합니다."
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 초기화</span>
          </button>
        </div>
      </header>

      {/* Main Single Screen Balanced Layout */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT PANEL: Clean Inputs Panel (5 columns) */}
          <section className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-100/40 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">하루 생활 습관 입력</h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">슬라이더를 편하게 움직여 하루 일정과 습관을 반영해주세요.</p>
              </div>

              {/* Sliders Container */}
              <div className="space-y-6 mt-6">
                
                {/* 1. 하루 공부 시간 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      하루 공부 시간
                    </span>
                    <span className="font-extrabold text-indigo-600 text-sm">{input.studyHours}시간</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={input.studyHours}
                    onChange={(e) => onChange('studyHours', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0시간</span>
                    <span>12시간</span>
                  </div>
                </div>

                {/* 2. 하루 수면 시간 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-blue-500" />
                      하루 수면 시간
                    </span>
                    <span className="font-extrabold text-blue-500 text-sm">{input.sleepHours}시간</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={input.sleepHours}
                    onChange={(e) => onChange('sleepHours', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>4시간 (최소)</span>
                    <span>10시간 (최대)</span>
                  </div>
                </div>

                {/* 3. SNS 사용 시간 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-pink-500" />
                      SNS 사용 시간
                    </span>
                    <span className="font-extrabold text-pink-500 text-sm">{input.snsHours}시간</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={input.snsHours}
                    onChange={(e) => onChange('snsHours', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>추천 0시간</span>
                    <span>최대 8시간</span>
                  </div>
                </div>

                {/* 4. OTT 미디어 시청 시간 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Tv className="w-4 h-4 text-amber-500" />
                      유튜브 / OTT 시청 시간
                    </span>
                    <span className="font-extrabold text-amber-500 text-sm">{input.ottHours}시간</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={input.ottHours}
                    onChange={(e) => onChange('ottHours', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>추천 0시간</span>
                    <span>최대 8시간</span>
                  </div>
                </div>

                {/* 5. 학교 출석률 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <School className="w-4 h-4 text-emerald-500" />
                      학교 출석률
                    </span>
                    <span className="font-extrabold text-emerald-500 text-sm">{input.attendanceRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={input.attendanceRate}
                    onChange={(e) => onChange('attendanceRate', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>50%</span>
                    <span>100% (권장)</span>
                  </div>
                </div>

                {/* 6. 신체 운동 빈도 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-500" />
                      주간 운동 빈도
                    </span>
                    <span className="font-extrabold text-purple-500 text-sm">주 {input.exerciseFrequency}회</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="7"
                    step="1"
                    value={input.exerciseFrequency}
                    onChange={(e) => onChange('exerciseFrequency', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0회</span>
                    <span>매일 (7회)</span>
                  </div>
                </div>

                {/* 7. 식습관과 비교과 결합하여 심플한 grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* 식습관 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-teal-500" />
                      식습관 상태
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: '좋음', value: 'good' },
                        { label: '보통', value: 'normal' },
                        { label: '불량', value: 'bad' }
                      ].map(eat => (
                        <button
                          key={eat.value}
                          onClick={() => onChange('eatingHabit', eat.value as any)}
                          type="button"
                          className={`py-2 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                            input.eatingHabit === eat.value
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {eat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 비교과 활동 */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-sky-500" />
                      비교과 활동 여부
                    </label>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: '참여함', value: 'yes' },
                        { label: '참여안함', value: 'no' }
                      ].map(co => (
                        <button
                          key={co.value}
                          onClick={() => onChange('coActivity', co.value as any)}
                          type="button"
                          className={`py-2 rounded-xl border text-center text-xs font-bold cursor-pointer transition-all ${
                            input.coActivity === co.value
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {co.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {input.studyHours === 0 && (
                <div className="mt-5 p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-xs text-center font-bold">
                  * 하루 공부 시간이 0시간이면 실질적 공부 시간은 0시간으로 측정됩니다.
                </div>
              )}
            </div>
          </section>

          {/* RIGHT PANEL: Super Clean Analytics & Score Results (7 columns) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            {/* KPI 1: 학습 효율 스코어 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-100/40 flex flex-col justify-center items-center text-center">
              <div className="my-4">
                <span className="block text-xs font-bold text-slate-400 tracking-wider uppercase">현재 학습 효율 스코어</span>
                <span className="block text-7xl sm:text-8xl font-black text-indigo-600 tracking-tighter mt-2">
                  {result.efficiency}%
                </span>
              </div>
            </div>

            {/* KPI 2: 실질적 공부 시간 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-100/40 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">실질적 공부 시간</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center my-6">
                {/* Desk hours */}
                <div className="sm:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-150 text-center">
                  <span className="block text-2xl font-black text-slate-500">{result.inputStudyHours}시간</span>
                  <span className="text-xs text-slate-400 font-bold mt-1 block">기존 공부 시간</span>
                </div>

                {/* Conversion arrows */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shadow-xs">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Genuine hours */}
                <div className="sm:col-span-2 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 py-1 px-2.5 bg-indigo-600 text-white text-[9px] font-black tracking-wider uppercase rounded-bl-xl">
                    실제
                  </div>
                  <span className="block text-3xl font-black text-indigo-600">{result.effectiveStudyHours}시간</span>
                  <span className="text-xs text-indigo-500 font-bold mt-1 block">실질적 공부 시간</span>
                </div>
              </div>
            </div>

          </section>

        </div>
      </main>
    </div>
  );
}

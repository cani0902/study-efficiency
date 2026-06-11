import { LifestyleInput, CalculationResult, FactorAnalysis } from '../types';

export const ML_WEIGHTS = {
  sns: 23.2,
  sleep: 22.8,
  ott: 20.0,
  attendance: 14.9,
  exercise: 13.6,
  eating: 3.6,
  coActivity: 1.9,
};

// Sleep score mapping
export function getSleepScore(hours: number): number {
  if (hours <= 0) return 0.0;
  
  // Proportional increase below 8 hours
  if (hours <= 4.0) {
    return (hours / 4.0) * 0.2;
  }
  if (hours > 4.0 && hours <= 5.0) {
    return 0.2 + (hours - 4.0) * 0.2; // 4h: 0.2, 5h: 0.4
  }
  if (hours > 5.0 && hours <= 6.0) {
    return 0.4 + (hours - 5.0) * 0.3; // 5h: 0.4, 6h: 0.7
  }
  if (hours > 6.0 && hours <= 7.0) {
    return 0.7 + (hours - 6.0) * 0.2; // 6h: 0.7, 7h: 0.9
  }
  if (hours > 7.0 && hours <= 8.0) {
    return 0.9 + (hours - 7.0) * 0.1; // 7h: 0.9, 8h: 1.0
  }
  
  // Above 8 hours retains maximum efficiency (1.0) without penalty
  return 1.0;
}

// SNS score mapping (smoothly decreases all the way to 0.0 for high usage)
export function getSnsScore(hours: number): number {
  if (hours <= 0.0) return 1.0;
  
  if (hours > 0.0 && hours <= 1.0) {
    return 1.0 - hours * 0.1; // 0h: 1.0, 1h: 0.9
  }
  if (hours > 1.0 && hours <= 2.0) {
    return 0.9 - (hours - 1.0) * 0.1; // 1h: 0.9, 2h: 0.8
  }
  if (hours > 2.0 && hours <= 3.0) {
    return 0.8 - (hours - 2.0) * 0.2; // 2h: 0.8, 3h: 0.6
  }
  if (hours > 3.0 && hours <= 4.0) {
    return 0.6 - (hours - 3.0) * 0.2; // 3h: 0.6, 4h: 0.4
  }
  if (hours > 4.0 && hours <= 5.0) {
    return 0.4 - (hours - 4.0) * 0.2; // 4h: 0.4, 5h: 0.2
  }
  
  // Continually decreases past 5 hours down to 0.0 at maximum 8 hours
  const pastFiveSNS = (hours - 5.0) * (0.2 / 3.0);
  return Math.max(0.0, 0.2 - pastFiveSNS);
}

// OTT score mapping (smoothly decreases all the way to 0.0 for high usage)
export function getOttScore(hours: number): number {
  if (hours <= 0.0) return 1.0;
  
  if (hours > 0.0 && hours <= 1.0) {
    return 1.0 - hours * 0.1; // 0h: 1.0, 1h: 0.9
  }
  if (hours > 1.0 && hours <= 2.0) {
    return 0.9 - (hours - 1.0) * 0.2; // 1h: 0.9, 2h: 0.7
  }
  if (hours > 2.0 && hours <= 3.0) {
    return 0.7 - (hours - 2.0) * 0.2; // 2h: 0.7, 3h: 0.5
  }
  if (hours > 3.0 && hours <= 4.0) {
    return 0.5 - (hours - 3.0) * 0.3; // 3h: 0.5, 4h: 0.2
  }
  
  // Continually decreases past 4 hours down to 0.0 at maximum 8 hours
  const pastFourOTT = (hours - 4.0) * (0.2 / 4.0);
  return Math.max(0.0, 0.2 - pastFourOTT);
}

// Attendance score mapping (0 to 1)
export function getAttendanceScore(rate: number): number {
  return Math.min(1.0, Math.max(0.0, rate / 100));
}

// Exercise score mapping (strictly increasing all the way to 7 sessions)
export function getExerciseScore(freq: number): number {
  if (freq <= 0) return 0.2;
  
  if (freq > 0 && freq <= 1) {
    return 0.2 + freq * 0.3; // 0회: 0.2, 1회: 0.5
  }
  if (freq > 1 && freq <= 3) {
    return 0.5 + ((freq - 1) / 2) * 0.3; // 1회: 0.5, 3회: 0.8 (slope: 0.15/회)
  }
  if (freq > 3 && freq <= 5) {
    return 0.8 + ((freq - 3) / 2) * 0.13; // 3회: 0.8, 5회: 0.93 (keeps increasing!)
  }
  if (freq > 5 && freq <= 7) {
    return 0.93 + ((freq - 5) / 2) * 0.07; // 5회: 0.93, 7회: 1.00 (keeps increasing!)
  }
  
  return 1.0;
}

// Eating score mapping
export function getEatingScore(habit: 'good' | 'normal' | 'bad'): number {
  if (habit === 'good') return 1.0;
  if (habit === 'normal') return 0.6;
  return 0.2;
}

// Extracurricular score mapping
export function getCoActivityScore(activity: 'yes' | 'no'): number {
  return activity === 'yes' ? 1.0 : 0.5;
}

export function calculateEfficiency(input: LifestyleInput): CalculationResult {
  const snsScore = getSnsScore(input.snsHours);
  const sleepScore = getSleepScore(input.sleepHours);
  const ottScore = getOttScore(input.ottHours);
  const attendanceScore = getAttendanceScore(input.attendanceRate);
  const exerciseScore = getExerciseScore(input.exerciseFrequency);
  const eatingScore = getEatingScore(input.eatingHabit);
  const coActivityScore = getCoActivityScore(input.coActivity);

  // Weight Calculation:
  // (Sleep * 22.8) + (SNS * 23.2) + (OTT * 20.0) + (Attendance * 14.9) + (Exercise * 13.6) + (Eating * 3.6) + (CoActivity * 1.9)
  const rawEfficiency = 
    (sleepScore * 22.8) +
    (snsScore * 23.2) +
    (ottScore * 20.0) +
    (attendanceScore * 14.9) +
    (exerciseScore * 13.6) +
    (eatingScore * 3.6) +
    (coActivityScore * 1.9);

  // Result between 0 and 100
  const efficiency = Math.round(Math.min(100, Math.max(0, rawEfficiency)));

  // Real study hours = Study hours * (Efficiency / 100), rounded to 1 decimal place
  const effectiveStudyHours = Math.round((input.studyHours * (efficiency / 100)) * 10) / 10;

  // Keep format compatible with types
  const factors: FactorAnalysis[] = [
    {
      name: 'SNS 사용 시간',
      weight: 23.2,
      rating: snsScore,
      scoreImpact: snsScore * 23.2,
      status: snsScore >= 0.8 ? 'excellent' : snsScore >= 0.6 ? 'good' : 'warning',
      feedback: `점수: ${snsScore.toFixed(2)}`
    },
    {
      name: '수면 시간',
      weight: 22.8,
      rating: sleepScore,
      scoreImpact: sleepScore * 22.8,
      status: sleepScore >= 0.9 ? 'excellent' : sleepScore >= 0.7 ? 'good' : 'warning',
      feedback: `점수: ${sleepScore.toFixed(2)}`
    },
    {
      name: 'OTT 시청 시간',
      weight: 20.0,
      rating: ottScore,
      scoreImpact: ottScore * 20.0,
      status: ottScore >= 0.9 ? 'excellent' : ottScore >= 0.6 ? 'good' : 'warning',
      feedback: `점수: ${ottScore.toFixed(2)}`
    },
    {
      name: '출석률',
      weight: 14.9,
      rating: attendanceScore,
      scoreImpact: attendanceScore * 14.9,
      status: attendanceScore >= 0.95 ? 'excellent' : attendanceScore >= 0.85 ? 'good' : 'warning',
      feedback: `점수: ${attendanceScore.toFixed(2)}`
    },
    {
      name: '운동 빈도',
      weight: 13.6,
      rating: exerciseScore,
      scoreImpact: exerciseScore * 13.6,
      status: exerciseScore >= 0.8 ? 'excellent' : exerciseScore >= 0.5 ? 'good' : 'warning',
      feedback: `점수: ${exerciseScore.toFixed(2)}`
    },
    {
      name: '식습관',
      weight: 3.6,
      rating: eatingScore,
      scoreImpact: eatingScore * 3.6,
      status: eatingScore >= 1.0 ? 'excellent' : eatingScore >= 0.6 ? 'good' : 'warning',
      feedback: `점수: ${eatingScore.toFixed(2)}`
    },
    {
      name: '비교과 활동',
      weight: 1.9,
      rating: coActivityScore,
      scoreImpact: coActivityScore * 1.9,
      status: coActivityScore >= 1.0 ? 'excellent' : 'good',
      feedback: `점수: ${coActivityScore.toFixed(2)}`
    }
  ];

  return {
    efficiency,
    inputStudyHours: input.studyHours,
    effectiveStudyHours,
    factors,
    strengths: [],
    improvements: []
  };
}

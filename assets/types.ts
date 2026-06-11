export interface LifestyleInput {
  studyHours: number;       // 0 ~ 12
  sleepHours: number;       // 4 ~ 10
  snsHours: number;         // 0 ~ 8
  ottHours: number;         // 0 ~ 8
  attendanceRate: number;    // 50 ~ 100
  exerciseFrequency: number; // 0 ~ 7
  eatingHabit: 'good' | 'normal' | 'bad';
  coActivity: 'yes' | 'no';
}

export interface FactorAnalysis {
  name: string;
  weight: number;         // ML Weight %
  rating: number;         // -1 to 1 rating of user's habit
  scoreImpact: number;    // rating * weight
  status: 'excellent' | 'good' | 'average' | 'warning' | 'critical';
  feedback: string;
}

export interface CalculationResult {
  efficiency: number;        // display efficiency (e.g. 92%)
  inputStudyHours: number;   // study hours entered by user
  effectiveStudyHours: number; // study hours * efficiency
  factors: FactorAnalysis[];
  strengths: string[];
  improvements: string[];
}

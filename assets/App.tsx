import { useState, useEffect } from 'react';
import { LifestyleInput } from './types';
import UnifiedDashboard from './components/UnifiedDashboard';

const INITIAL_INPUT: LifestyleInput = {
  studyHours: 5,
  sleepHours: 7.5,
  snsHours: 1.5,
  ottHours: 1.0,
  attendanceRate: 98,
  exerciseFrequency: 3,
  eatingHabit: 'good',
  coActivity: 'yes'
};

export default function App() {
  const [input, setInput] = useState<LifestyleInput>(() => {
    const saved = localStorage.getItem('student-habits');
    return saved ? JSON.parse(saved) : INITIAL_INPUT;
  });

  // Sync habits with localstorage
  useEffect(() => {
    localStorage.setItem('student-habits', JSON.stringify(input));
  }, [input]);

  const handleInputChange = (field: keyof LifestyleInput, value: any) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
  };

  return (
    <UnifiedDashboard 
      input={input}
      onChange={handleInputChange}
      onReset={handleReset}
    />
  );
}

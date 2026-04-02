import { useState } from 'react';
import { mockMonthlyData } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function BalanceChart() {
  const { darkMode } = useApp();
  const [activePeriod, setActivePeriod] = useState('WEEK');
  const maxValue = Math.max(...mockMonthlyData.map(d => Math.max(d.balance, d.income, d.expenses)));

  const periods = ['WEEK', 'MONTH', 'YEAR'];
  
  return (
    <div className={`rounded-xl p-8 relative overflow-hidden ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <h4 className={`text-lg font-bold font-headline ${darkMode ? 'text-white' : 'text-on-surface'}`}>Balance Trends</h4>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Q4 Performance Overview</p>
        </div>
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                activePeriod === period
                  ? darkMode
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-primary-container text-on-primary-container'
                  : `${darkMode ? 'bg-[#262a31] text-slate-400 hover:bg-slate-700' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest'}`
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 w-full relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
          <defs>
            <lineargradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={darkMode ? "#b2c5ff" : "#003d9b"} stopOpacity="0.3"></stop>
              <stop offset="100%" stopColor={darkMode ? "#b2c5ff" : "#003d9b"} stopOpacity="0"></stop>
            </lineargradient>
          </defs>
          <path 
            d="M0,150 Q100,140 200,100 T400,120 T600,60 T800,80 L800,200 L0,200 Z" 
            fill="url(#chartGradient)"
          />
          <path 
            d="M0,150 Q100,140 200,100 T400,120 T600,60 T800,80" 
            fill="none" 
            stroke={darkMode ? "#b2c5ff" : "#003d9b"} 
            strokeLinecap="round" 
            strokeWidth="4"
          />
          <circle cx="200" cy="100" fill={darkMode ? "#b2c5ff" : "#003d9b"} r="5" className="animate-pulse" />
          <circle cx="600" cy="60" fill={darkMode ? "#b2c5ff" : "#003d9b"} r="5" />
        </svg>
        <div className={`absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold tracking-widest pt-4 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>
          <span>OCT</span><span>NOV</span><span>DEC</span><span>JAN</span>
        </div>
      </div>
    </div>
  );
}

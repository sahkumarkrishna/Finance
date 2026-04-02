import { useApp, calculateCategorySpending } from '../context/AppContext';

export function CategoryChart() {
  const { transactions, darkMode } = useApp();
  const data = calculateCategorySpending(transactions);
  const topCategories = data.slice(0, 5);
  
  const colors = darkMode ? [
    { bg: 'bg-blue-500', text: 'text-blue-400', bar: 'bg-blue-500' },
    { bg: 'bg-orange-500', text: 'text-orange-400', bar: 'bg-orange-500' },
    { bg: 'bg-green-500', text: 'text-green-400', bar: 'bg-green-500' },
    { bg: 'bg-purple-500', text: 'text-purple-400', bar: 'bg-purple-500' },
    { bg: 'bg-pink-500', text: 'text-pink-400', bar: 'bg-pink-500' },
  ] : [
    { bg: 'bg-primary', text: 'text-primary', bar: 'bg-primary' },
    { bg: 'bg-tertiary', text: 'text-tertiary', bar: 'bg-tertiary' },
    { bg: 'bg-secondary', text: 'text-secondary', bar: 'bg-secondary' },
    { bg: 'bg-orange-600', text: 'text-orange-600', bar: 'bg-orange-600' },
    { bg: 'bg-pink-600', text: 'text-pink-600', bar: 'bg-pink-600' },
  ];

  return (
    <div className={`rounded-xl p-8 h-full ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
      <h4 className={`font-headline font-bold text-lg mb-8 text-center ${darkMode ? 'text-white' : 'text-on-surface'}`}>Structural Allocation</h4>
      
      {topCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-3">pie_chart</span>
          <p className="text-sm font-medium">No expense data</p>
        </div>
      ) : (
        <>
          <div className="relative h-48 w-48 mx-auto mb-10">
            <svg className="transform -rotate-90 w-full h-full">
              <circle 
                className={darkMode ? 'text-[#31353c]' : 'text-surface-container-highest'} 
                cx="96" cy="96" 
                fill="transparent" 
                r="80" 
                stroke="currentColor" 
                strokeWidth="12"
              />
              <circle 
                className={darkMode ? 'text-blue-500' : 'text-primary'} 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="80" 
                stroke="currentColor" 
                strokeDasharray="502" 
                strokeDashoffset="150" 
                strokeWidth="14"
              />
              <circle 
                className={darkMode ? 'text-orange-400' : 'text-tertiary'} 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="80" 
                stroke="currentColor" 
                strokeDasharray="502" 
                strokeDashoffset="400" 
                strokeWidth="14"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Diversified</span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>{topCategories.length}</span>
              <span className={`text-[10px] uppercase font-bold ${darkMode ? 'text-blue-400' : 'text-primary'}`}>ASSETS</span>
            </div>
          </div>

          <div className="space-y-3">
            {topCategories.map((cat, index) => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors[index % colors.length].bar}`}></div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{cat.category}</span>
                </div>
                <span className={`text-sm font-bold ${colors[index % colors.length].text}`}>
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className={`mt-8 p-6 rounded-xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-primary to-primary-container'} text-white relative overflow-hidden shadow-xl`}>
        <div className="relative z-10">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Audit Status</div>
          <div className="text-lg font-bold font-headline mb-4">Monthly Report Ready</div>
          <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/30 transition-all">
            Review Now
          </button>
        </div>
        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10">fact_check</span>
      </div>
    </div>
  );
}

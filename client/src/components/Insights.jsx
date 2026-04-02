import { useApp, generateInsights } from '../context/AppContext';

export function Insights() {
  const { transactions, darkMode } = useApp();
  const insights = generateInsights(transactions);

  const icons = {
    highest: 'trending_up',
    comparison: 'bar_chart',
    savings: 'savings',
  };

  const getConfig = (type) => {
    if (darkMode) {
      return {
        highest: { bg: 'bg-orange-500/10 text-orange-400', icon: 'bg-orange-500 text-white' },
        comparison: { bg: 'bg-blue-500/10 text-blue-400', icon: 'bg-blue-500 text-white' },
        savings: { bg: 'bg-green-500/10 text-green-400', icon: 'bg-green-500 text-white' },
      };
    }
    return {
      highest: { bg: 'bg-tertiary-container/20 text-tertiary', icon: 'bg-tertiary text-white' },
      comparison: { bg: 'bg-primary-container/20 text-primary', icon: 'bg-primary text-white' },
      savings: { bg: 'bg-secondary-container/20 text-secondary', icon: 'bg-secondary text-white' },
    };
  };

  if (insights.length === 0) {
    return (
      <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
        <h3 className={`font-headline font-bold text-lg mb-4 ${darkMode ? 'text-white' : 'text-on-surface'}`}>Financial Insights</h3>
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-4">insights</span>
          <p className="text-center font-medium">Add more transactions to see insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`font-headline font-bold text-lg ${darkMode ? 'text-white' : 'text-on-surface'}`}>Financial Insights</h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>AI-powered recommendations</p>
        </div>
        <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-primary/10'}`}>
          <span className={`material-symbols-outlined ${darkMode ? 'text-blue-400' : 'text-primary'}`}>auto_awesome</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const config = getConfig(insight.type)[insight.type] || getConfig(insight.type).comparison;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                darkMode ? 'border-slate-800' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${config.icon} shadow-md`}>
                  <span className="material-symbols-outlined text-lg text-white">{icons[insight.type]}</span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${config.bg}`}>{insight.type}</span>
              </div>
              
              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-slate-200' : 'text-on-surface'}`}>
                {insight.title}
              </p>
              
              <p className={`text-2xl font-bold font-headline tracking-tight ${
                insight.type === 'comparison' 
                  ? (parseFloat(insight.value) >= 0 ? (darkMode ? 'text-red-400' : 'text-error') : (darkMode ? 'text-green-400' : 'text-tertiary'))
                  : (darkMode ? 'text-white' : 'text-on-surface')
              }`}>
                {insight.value}
              </p>
              
              <p className={`text-xs mt-3 leading-relaxed ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>
                {insight.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

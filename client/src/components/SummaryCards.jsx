import { useApp, calculateSummary } from '../context/AppContext';

export function SummaryCards() {
  const { transactions, darkMode } = useApp();
  const { totalBalance, income, expenses } = calculateSummary(transactions);

  const cards = [
    { 
      label: 'Total Balance', 
      value: totalBalance, 
      icon: 'account_balance_wallet',
      trend: '+4.2%',
      trendUp: true,
      color: 'primary',
      span: 'lg:col-span-4'
    },
    { 
      label: 'Monthly Income', 
      value: income, 
      icon: 'trending_up',
      trend: '+18.2%',
      trendUp: true,
      color: 'tertiary',
      span: 'lg:col-span-4'
    },
    { 
      label: 'Expenses', 
      value: expenses, 
      icon: 'payments',
      trend: '-4.1%',
      trendUp: false,
      color: 'error',
      span: 'lg:col-span-4'
    },
  ];

  const colorClasses = {
    primary: {
      bg: darkMode ? 'bg-[#262a31] hover:bg-[#31353c]' : 'bg-surface-container hover:bg-surface-container-high',
      icon: darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-primary-container/20 text-primary',
      text: darkMode ? 'text-blue-400' : 'text-primary',
      value: darkMode ? 'text-white' : 'text-slate-900',
      badge: darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary',
      label: darkMode ? 'text-slate-400' : 'text-on-surface-variant',
    },
    tertiary: {
      bg: darkMode ? 'bg-[#262a31] hover:bg-[#31353c]' : 'bg-surface-container hover:bg-surface-container-high',
      icon: darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-tertiary-container/20 text-tertiary-fixed-dim',
      text: darkMode ? 'text-orange-400' : 'text-tertiary',
      value: darkMode ? 'text-white' : 'text-slate-900',
      badge: darkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-tertiary/10 text-tertiary',
      label: darkMode ? 'text-slate-400' : 'text-on-surface-variant',
    },
    error: {
      bg: darkMode ? 'bg-[#262a31] hover:bg-[#31353c]' : 'bg-surface-container hover:bg-surface-container-high',
      icon: darkMode ? 'bg-red-500/20 text-red-400' : 'bg-error-container/20 text-error',
      text: darkMode ? 'text-red-400' : 'text-error',
      value: darkMode ? 'text-white' : 'text-slate-900',
      badge: darkMode ? 'bg-red-500/10 text-red-400' : 'bg-error/10 text-error',
      label: darkMode ? 'text-slate-400' : 'text-on-surface-variant',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const colors = colorClasses[card.color];
        return (
          <div
            key={card.label}
            className={`
              ${colors.bg} rounded-xl p-6 flex flex-col justify-between h-48 group transition-all duration-300
              ${card.span}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-lg ${colors.icon}`}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                {card.trend}
              </span>
            </div>
            
            <div>
              <p className={`text-sm font-medium mb-1 ${colors.label}`}>{card.label}</p>
              <h3 className={`text-3xl font-extrabold tracking-tight ${colors.value}`}>
                ${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

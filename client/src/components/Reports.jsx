import { useApp } from '../context/AppContext';

export function Reports() {
  const { transactions, darkMode } = useApp();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const monthlyData = [
    { month: 'January', income: 8500, expenses: 5200, color: 'from-blue-500 to-blue-400' },
    { month: 'February', income: 9200, expenses: 5800, color: 'from-blue-500 to-blue-400' },
    { month: 'March', income: 8800, expenses: 6100, color: 'from-blue-500 to-blue-400' },
    { month: 'April', income: 10500, expenses: 5400, color: 'from-blue-500 to-blue-400' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight font-headline ${darkMode ? 'text-white' : 'text-slate-900'}`}>Financial Reports</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Detailed analytics and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-[#262a31]' : 'bg-surface-container'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-primary-container/20'}`}>
              <span className={`material-symbols-outlined ${darkMode ? 'text-blue-400' : 'text-primary'} text-xl`}>arrow_downward</span>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>Income</span>
          </div>
          <p className={`text-2xl md:text-3xl font-bold font-headline ${darkMode ? 'text-white' : 'text-slate-900'}`}>${totalIncome.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <span className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
            </span>
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>85% of target</p>
        </div>

        <div className={`rounded-xl p-6 ${darkMode ? 'bg-[#262a31]' : 'bg-surface-container'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-500/20' : 'bg-error-container/20'}`}>
              <span className={`material-symbols-outlined ${darkMode ? 'text-red-400' : 'text-error'} text-xl`}>arrow_upward</span>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${darkMode ? 'bg-red-500/10 text-red-400' : 'bg-error/10 text-error'}`}>Expenses</span>
          </div>
          <p className={`text-2xl md:text-3xl font-bold font-headline ${darkMode ? 'text-white' : 'text-slate-900'}`}>${totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <span className="h-full bg-red-500 rounded-full" style={{ width: '62%' }} />
            </span>
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>62% of budget</p>
        </div>

        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-primary to-primary-container'} text-white shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <span className="material-symbols-outlined text-xl text-white">account_balance</span>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-lg text-[10px] font-bold">
              Net Balance
            </span>
          </div>
          <p className="text-2xl md:text-3xl font-bold font-headline">
            ${netBalance.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <span className="h-full bg-white rounded-full" style={{ width: netBalance >= 0 ? '75%' : '25%' }} />
            </span>
          </div>
          <p className="text-xs text-white/60 mt-2">{netBalance >= 0 ? 'Positive flow' : 'Negative flow'}</p>
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
        <div className={`px-8 py-6 border-b ${darkMode ? 'bg-[#1c2026] border-slate-800' : 'bg-surface-container border-slate-100'}`}>
          <h2 className={`text-lg font-bold font-headline ${darkMode ? 'text-white' : 'text-on-surface'}`}>Monthly Breakdown</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Detailed financial performance by month</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-[10px] font-extrabold uppercase tracking-widest border-b ${darkMode ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-100'}`}>
                <th className="px-8 py-4 text-left">Month</th>
                <th className="px-8 py-4 text-right">Income</th>
                <th className="px-8 py-4 text-right">Expenses</th>
                <th className="px-8 py-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {monthlyData.map((data) => (
                <tr key={data.month} className={`border-b last:border-0 transition-colors ${darkMode ? 'border-slate-800 hover:bg-[#262a31]' : 'border-slate-50 hover:bg-slate-50'}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${data.color}`} />
                      <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{data.month}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-blue-400">${data.income.toLocaleString()}</td>
                  <td className="px-8 py-5 text-right font-bold text-red-400">${data.expenses.toLocaleString()}</td>
                  <td className={`px-8 py-5 text-right font-bold ${data.income - data.expenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${(data.income - data.expenses).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

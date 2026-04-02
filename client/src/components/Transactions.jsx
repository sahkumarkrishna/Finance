import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';

export function Transactions() {
  const { 
    filteredTransactions, 
    filters, 
    setFilter, 
    isAdmin, 
    deleteTransaction,
    darkMode 
  } = useApp();

  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-8 ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className={`text-xl font-bold font-headline ${darkMode ? 'text-white' : 'text-on-surface'}`}>Recent Ledger Entries</h2>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Real-time settlement activity</p>
          </div>
          <button className={`font-bold text-xs uppercase tracking-widest hover:underline ${darkMode ? 'text-blue-400' : 'text-primary'}`}>
            View All Entries
          </button>
        </div>

        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">receipt_long</span>
              <p className="text-slate-500 font-medium">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.slice(0, 5).map((t) => (
              <div 
                key={t.id} 
                className={`flex items-center justify-between p-4 rounded-lg group transition-all ${
                  darkMode 
                    ? 'bg-[#262a31] hover:bg-[#31353c]' 
                    : 'bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-[#181c22]' : 'bg-surface-container-highest'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      darkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-on-surface-variant group-hover:text-primary'
                    } transition-colors`}>
                      {t.type === 'income' ? 'diamond' : 'shopping_bag'}
                    </span>
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>{t.description}</h5>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>
                      {t.category} • {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-extrabold ${
                    t.type === 'income' 
                      ? (darkMode ? 'text-blue-400' : 'text-primary')
                      : (darkMode ? 'text-red-400' : 'text-error')
                  }`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-tighter ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>
                    {t.type === 'income' ? 'Verified' : 'Settled'}
                  </p>
                </div>
                {isAdmin && (
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-slate-400 hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <span className="material-symbols-outlined text-sm">search</span>
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 text-sm border-none rounded-xl focus:ring-1 focus:ring-primary/30 transition-all ${
              darkMode 
                ? 'bg-[#262a31] text-white placeholder-slate-500' 
                : 'bg-surface-container text-slate-900'
            }`}
          />
        </div>
        
        <select
          value={filters.type}
          onChange={(e) => setFilter('type', e.target.value)}
          className={`px-4 py-3 text-sm rounded-xl focus:ring-1 focus:ring-primary/30 cursor-pointer transition-all ${
            darkMode 
              ? 'bg-[#262a31] text-white' 
              : 'bg-surface-container text-slate-900'
          }`}
        >
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className={`px-4 py-3 text-sm rounded-xl focus:ring-1 focus:ring-primary/30 cursor-pointer transition-all ${
            darkMode 
              ? 'bg-[#262a31] text-white' 
              : 'bg-surface-container text-slate-900'
          }`}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

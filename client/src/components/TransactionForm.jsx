import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';

export function TransactionForm({ transaction, onClose }) {
  const { addTransaction, editTransaction, darkMode } = useApp();
  const [formData, setFormData] = useState({
    date: transaction?.date || new Date().toISOString().split('T')[0],
    amount: transaction?.amount?.toString() || '',
    category: transaction?.category || categories[0],
    type: transaction?.type || 'expense',
    description: transaction?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) return;

    if (transaction) {
      editTransaction(transaction.id, {
        date: formData.date,
        amount,
        category: formData.category,
        type: formData.type,
        description: formData.description,
      });
    } else {
      addTransaction({
        date: formData.date,
        amount,
        category: formData.category,
        type: formData.type,
        description: formData.description,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className={`rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 ${
          darkMode ? 'bg-[#1c2026]' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              darkMode ? 'bg-blue-500/20' : 'bg-primary-container/20'
            }`}>
              <span className={`material-symbols-outlined ${darkMode ? 'text-blue-400' : 'text-primary'}`}>
                {transaction ? 'edit_note' : 'add_circle'}
              </span>
            </div>
            <h2 className={`text-xl font-bold font-headline ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {transaction ? 'Edit Transaction' : 'New Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`px-4 py-4 text-sm font-bold rounded-xl border-2 transition-all duration-300 ${
                formData.type === 'expense'
                  ? darkMode
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-error bg-error-container/20 text-error'
                  : darkMode
                    ? 'border-slate-600 text-slate-400 hover:border-red-500/50'
                    : 'border-slate-200 text-slate-500 hover:border-error/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">arrow_upward</span> 
                <span className="hidden sm:inline">Expense</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`px-4 py-4 text-sm font-bold rounded-xl border-2 transition-all duration-300 ${
                formData.type === 'income'
                  ? darkMode
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-tertiary bg-tertiary-container/20 text-tertiary'
                  : darkMode
                    ? 'border-slate-600 text-slate-400 hover:border-green-500/50'
                    : 'border-slate-200 text-slate-500 hover:border-tertiary/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">arrow_downward</span>
                <span className="hidden sm:inline">Income</span>
              </span>
            </button>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                darkMode 
                  ? 'bg-[#262a31] border-slate-700 text-white' 
                  : 'bg-surface-container-low border-slate-200 text-slate-900'
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Amount
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 text-lg font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  darkMode 
                    ? 'bg-[#262a31] border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-surface-container-low border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Category
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined">category</span>
              </span>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full pl-11 pr-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer ${
                  darkMode 
                    ? 'bg-[#262a31] border-slate-700 text-white' 
                    : 'bg-surface-container-low border-slate-200 text-slate-900'
                }`}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Description
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined">notes</span>
              </span>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                className={`w-full pl-11 pr-4 py-3 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  darkMode 
                    ? 'bg-[#262a31] border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-surface-container-low border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3.5 border-2 rounded-xl font-bold transition-all ${
                darkMode 
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3.5 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98 ${
                darkMode
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

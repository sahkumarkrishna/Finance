import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { mockTransactions, categoryColors } from '../data/mockData';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : mockTransactions;
  });
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('finance_role');
    return saved || 'viewer';
  });
  const [filters, setFilters] = useState({ category: 'All', type: 'All', search: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('finance_darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const editTransaction = (id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => filters.category === 'All' || t.category === filters.category)
      .filter(t => filters.type === 'All' || t.type === filters.type)
      .filter(t => 
        filters.search === '' || 
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase())
      )
      .sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          default:
            comparison = 0;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [transactions, filters, sortBy, sortOrder]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const value = {
    transactions,
    role,
    filters,
    sortBy,
    sortOrder,
    setRole,
    setFilter,
    setSortBy,
    toggleSortOrder,
    addTransaction,
    editTransaction,
    deleteTransaction,
    filteredTransactions,
    isAdmin: role === 'admin',
    darkMode,
    toggleDarkMode,
    showForm,
    setShowForm,
    editingTransaction,
    setEditingTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function calculateSummary(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  return { totalBalance, income, expenses };
}

export function calculateCategorySpending(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  const byCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: categoryColors[category] || '#6b7280'
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function generateInsights(transactions) {
  const insights = [];
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  const categorySpending = calculateCategorySpending(expenses);
  if (categorySpending.length > 0) {
    const highest = categorySpending[0];
    insights.push({
      type: 'highest',
      title: 'Highest Spending Category',
      value: highest.category,
      detail: `$${highest.amount.toFixed(2)} (${highest.percentage.toFixed(1)}% of total)`
    });
  }

  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const year = now.getFullYear();
  const lastMonthYear = thisMonth === 0 ? year - 1 : year;

  const thisMonthExpenses = expenses
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === year;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = expenses
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (lastMonthExpenses > 0) {
    const change = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    insights.push({
      type: 'comparison',
      title: 'Monthly Comparison',
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      detail: change >= 0 ? 'spending increased' : 'spending decreased'
    });
  }

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    insights.push({
      type: 'savings',
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      detail: savingsRate >= 20 ? 'Great job saving!' : 'Try to save more'
    });
  }

  return insights;
}

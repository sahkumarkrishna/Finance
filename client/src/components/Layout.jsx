import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export function Layout() {
  const { isAdmin, showForm, setShowForm, editingTransaction, setEditingTransaction, darkMode, transactions, deleteTransaction, toggleDarkMode, role, setRole } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    setPageLoaded(false);
    const timer = setTimeout(() => setPageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const { totalBalance, income, expenses } = calculateSummary(transactions);
  const categoryData = calculateCategorySpending(transactions);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#10141a]' : 'bg-[#faf9ff]'}`}>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 flex-shrink-0 flex flex-col z-50 py-4 px-4
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${darkMode ? 'bg-slate-900' : 'bg-[#f1f3ff]'}
        border-r ${darkMode ? 'border-slate-800' : 'border-slate-200/10'}
      `}>
        {/* Logo */}
        <div className="mb-6">
          <div className={`text-xl font-extrabold tracking-tighter font-headline ${
            darkMode ? 'text-blue-400' : 'text-[#0052CC]'
          }`}>Architectural Ledger</div>
        </div>

        {/* Role Switcher - Admin / Viewer Toggle */}
        <div className="mb-4">
          <div className={`text-[10px] uppercase tracking-widest text-slate-500 mb-2 px-1`}>Switch Role</div>
          <div className={`flex items-center gap-1 p-1 rounded-xl ${
            darkMode ? 'bg-slate-800/50' : 'bg-white/60 backdrop-blur-sm shadow-sm'
          }`}>
            <button 
              onClick={() => setRole('viewer')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                role === 'viewer'
                  ? darkMode
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-green-100 text-green-700 border border-green-300'
                  : darkMode
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-base">{role === 'viewer' ? 'visibility' : 'visibility_off'}</span>
              <span>Viewer</span>
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                role === 'admin'
                  ? darkMode
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                  : darkMode
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span>
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 ${darkMode ? 'bg-slate-800/50' : 'bg-white/40'}`}>
          <div className="relative">
            <img 
              alt="User" 
              className="w-10 h-10 rounded-lg object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            />
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
              role === 'admin' ? 'bg-blue-500 border-slate-900' : 'bg-green-500 border-slate-300'
            } ${role === 'viewer' ? 'animate-pulse' : ''}`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-bold truncate ${darkMode ? 'text-slate-200' : ''}`}>Julian Thorne</div>
            <div className={`text-[10px] ${role === 'admin' ? 'text-blue-400' : 'text-green-500'}`}>
              {role === 'admin' ? 'Administrator' : 'Viewer'}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
            { id: 'transactions', label: 'Transactions', icon: 'receipt_long' },
            { id: 'insights', label: 'Insights', icon: 'analytics' },
            { id: 'settings', label: 'Settings', icon: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (!isDesktop) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                activeTab === item.id
                  ? darkMode
                    ? 'bg-slate-800 text-blue-400 font-semibold shadow-lg shadow-blue-500/10'
                    : 'bg-white text-[#0052CC] font-semibold shadow-md shadow-blue-500/10'
                  : darkMode
                    ? 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-white/70 hover:text-[#0052CC]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
              {activeTab === item.id && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full animate-pulse ${
                  darkMode ? 'bg-blue-400' : 'bg-[#0052CC]'
                }`}></span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className={`p-3 rounded-xl mb-3 ${darkMode ? 'bg-slate-800/50' : 'bg-white/40'}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Quick Stats</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Balance</span>
              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400">Transactions</span>
              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>{transactions.length}</span>
            </div>
          </div>
        </div>

        {/* Dark/Light Mode Toggle */}
        <div className={`flex items-center justify-between p-3 rounded-xl mb-3 ${darkMode ? 'bg-slate-800/50' : 'bg-white/40'}`}>
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${darkMode ? 'text-yellow-400' : 'text-slate-500'}`}>
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-blue-500/30' 
                : 'bg-slate-300'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
              darkMode 
                ? 'left-6 bg-blue-400 text-slate-900' 
                : 'left-0.5 bg-white text-slate-500'
            }`}>
              <span className="material-symbols-outlined text-xs">
                {darkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-1">
          <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-600 hover:bg-white/50'
          }`}>
            <span className="material-symbols-outlined">help</span>
            Help & Support
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-red-400' : 'text-slate-600 hover:bg-white/50 hover:text-red-600'
          }`}>
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className={`sticky top-0 h-16 flex justify-between items-center px-4 lg:px-10 z-40 ${
          darkMode 
            ? 'bg-[#10141a]/95 backdrop-blur-md border-b border-slate-800/50' 
            : 'bg-[#faf9ff]/95 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#f1f3ff]'}`}
            >
              <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
            </button>
            <h1 className={`text-xl lg:text-2xl font-extrabold tracking-tight font-headline ${darkMode ? 'text-white' : 'text-on-surface'}`}>
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'transactions' ? 'Transaction Ledger' : activeTab === 'insights' ? 'Financial Insights' : 'System Preferences'}
            </h1>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
              darkMode ? 'bg-slate-800 text-blue-400' : 'bg-secondary-container text-on-secondary-fixed-variant'
            }`}>
              {isAdmin ? 'Admin' : 'Viewer'}
            </span>
          </div>
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-sm">search</span>
              </span>
              <input 
                className={`border-none rounded-lg pl-10 pr-4 py-2 text-sm w-40 lg:w-64 focus:ring-2 focus:ring-primary/20 ${
                  darkMode 
                    ? 'bg-[#181c22] text-white placeholder-slate-500' 
                    : 'bg-surface-container-low'
                }`} 
                placeholder="Search..." 
                type="text"
              />
            </div>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${
              darkMode ? 'bg-blue-500/10' : 'bg-primary-container/10'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-blue-400' : 'bg-primary'}`}></span>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${darkMode ? 'text-blue-400' : 'text-primary'}`}>
                {isAdmin ? 'Admin Role' : 'Viewer'}
              </span>
            </div>
            <button className={`p-2 transition-colors rounded-full relative ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-[#f1f3ff]'}`}>
              <span className="material-symbols-outlined">notifications</span>
              <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${darkMode ? 'bg-red-400 border-[#10141a]' : 'bg-error border-surface'}`}></span>
            </button>
            <div className={`flex items-center gap-3 pl-2 lg:pl-4 border-l ${darkMode ? 'border-slate-700' : 'border-slate-200/50'}`}>
              <div className="hidden sm:block text-right">
                <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>Julian Thorne</p>
                <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>System Architect</p>
              </div>
              <img 
                alt="Profile" 
                className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 p-4 lg:p-10 space-y-8 lg:space-y-10 transition-all duration-300 ease-out ${
          pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {activeTab === 'dashboard' && (
            <DashboardView 
              transactions={transactions} 
              categoryData={categoryData} 
              totalBalance={totalBalance} 
              income={income} 
              expenses={expenses}
              darkMode={darkMode}
              deleteTransaction={deleteTransaction}
              setEditingTransaction={setEditingTransaction}
              setShowForm={setShowForm}
              isAdmin={isAdmin}
              pageLoaded={pageLoaded}
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionsView 
              transactions={transactions}
              darkMode={darkMode}
              deleteTransaction={deleteTransaction}
              setEditingTransaction={setEditingTransaction}
              setShowForm={setShowForm}
              isAdmin={isAdmin}
              pageLoaded={pageLoaded}
            />
          )}
          {activeTab === 'insights' && (
            <InsightsView darkMode={darkMode} transactions={transactions} isAdmin={isAdmin} pageLoaded={pageLoaded} />
          )}
          {activeTab === 'settings' && (
            <SettingsView darkMode={darkMode} toggleDarkMode={toggleDarkMode} isAdmin={isAdmin} pageLoaded={pageLoaded} />
          )}
        </main>
      </div>

      {showForm && <TransactionForm transaction={editingTransaction} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function DashboardView({ transactions, categoryData, totalBalance, income, expenses, darkMode, deleteTransaction, setEditingTransaction, setShowForm, isAdmin, pageLoaded }) {
  return (
    <>
      {!isAdmin && (
        <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all duration-300 ${
          darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-primary-container/10 border border-primary-container/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-sm font-medium">You are in Viewer Mode. Contact an admin for edit access.</p>
          </div>
          <button className="text-xs font-bold uppercase tracking-wider underline underline-offset-4 decoration-2 hover:scale-105 transition-transform">Find Admin</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 md:gap-4 lg:gap-6">
        <div className={`md:col-span-2 xl:col-span-7 rounded-xl p-4 md:p-6 lg:p-8 flex flex-col justify-between min-h-[160px] md:min-h-[200px] border transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
          darkMode ? 'bg-[#181c22] border-slate-800 hover:border-blue-500/30' : 'bg-surface-container-lowest border-outline-variant/15 hover:border-primary/30'
        }`}>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Portfolio Balance</span>
              <span className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-1 w-fit animate-pulse ${
                darkMode ? 'bg-green-500/10 text-green-400' : 'bg-tertiary-container/10 text-tertiary'
              }`}>
                <span className="material-symbols-outlined text-[10px] md:text-xs">trending_up</span> +4.2%
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl lg:text-[3.5rem] font-bold font-headline tracking-tighter ${darkMode ? 'text-white' : 'text-on-surface'}`}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex gap-4 mt-3 md:mt-4">
            <div className={`h-1 w-full rounded-full ${darkMode ? 'bg-blue-500 opacity-20' : 'bg-primary opacity-20'}`}></div>
            <div className={`h-1 w-1/3 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-primary'}`}></div>
          </div>
        </div>

        <div className={`col-span-1 md:col-span-1 xl:col-span-3 rounded-xl p-4 md:p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
          darkMode ? 'bg-[#181c22] border-slate-800 hover:border-green-500/30' : 'bg-surface-container-low border-outline-variant/5 hover:border-tertiary/30'
        }`}>
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className={`p-1.5 md:p-2 rounded-lg transition-transform duration-300 hover:rotate-12 ${darkMode ? 'bg-green-500/20 text-green-400' : 'bg-tertiary-container/20 text-tertiary'}`}>
              <span className="material-symbols-outlined text-sm md:text-base">arrow_downward</span>
            </div>
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Income</span>
          </div>
          <div className={`text-lg sm:text-xl md:text-2xl font-bold font-headline ${darkMode ? 'text-white' : ''}`}>
            ${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-[10px] md:text-xs mt-1 md:mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>vs last month</div>
        </div>

        <div className={`col-span-1 md:col-span-1 xl:col-span-2 rounded-xl p-4 md:p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
          darkMode ? 'bg-[#181c22] border-slate-800 hover:border-red-500/30' : 'bg-surface-container-low border-outline-variant/5 hover:border-error/30'
        }`}>
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className={`p-1.5 md:p-2 rounded-lg transition-transform duration-300 hover:-rotate-12 ${darkMode ? 'bg-red-500/20 text-red-400' : 'bg-error-container/20 text-error'}`}>
              <span className="material-symbols-outlined text-sm md:text-base">arrow_upward</span>
            </div>
            <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Expenses</span>
          </div>
          <div className={`text-lg sm:text-xl md:text-2xl font-bold font-headline ${darkMode ? 'text-white' : ''}`}>
            ${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`text-[10px] md:text-xs mt-1 md:mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Within budget</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-8">
        <div className={`xl:col-span-8 rounded-xl p-6 lg:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
          darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'
        }`}>
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h3 className={`font-headline font-bold text-lg ${darkMode ? 'text-white' : ''}`}>Financial Performance</h3>
            <div className="flex gap-2">
              <button className={`px-3 py-1 text-xs font-bold rounded-lg shadow-sm transition-all duration-200 hover:scale-105 ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-white text-on-surface'
              }`}>1M</button>
              <button className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 hover:scale-105 ${
                darkMode ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-500 hover:bg-white/50'
              }`}>6M</button>
            </div>
          </div>
          
          <div className="w-full h-48 lg:h-64 flex items-end justify-between gap-1">
            {[40, 55, 45, 70, 50, 85, 60, 75, 40, 95, 65, 100].map((height, i) => (
              <div 
                key={i}
                className={`w-full rounded-t transition-all duration-500 ease-out hover:opacity-100 hover:scale-y-105 ${
                  darkMode ? 'bg-blue-500' : 'bg-primary'
                }`}
                style={{ 
                  height: pageLoaded ? `${height}%` : '0%',
                  opacity: pageLoaded ? (height > 80 ? 1 : height > 50 ? 0.6 : 0.2) : 0,
                  transitionDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
          
          <div className={`flex justify-between mt-4 text-[10px] font-bold uppercase tracking-widest px-1 ${
            darkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span className="hidden sm:inline">Jul</span><span className="hidden sm:inline">Aug</span>
            <span className="hidden md:inline">Sep</span><span className="hidden md:inline">Oct</span>
            <span className="hidden lg:inline">Nov</span><span className="hidden lg:inline">Dec</span>
          </div>
        </div>

        <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 lg:gap-6">
          <div className={`rounded-xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
            darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-low'
          }`}>
            <h4 className={`text-xs font-extrabold uppercase tracking-widest mb-6 ${darkMode ? 'text-slate-300' : 'text-on-surface'}`}>Expense Distribution</h4>
            <DonutChart data={categoryData} darkMode={darkMode} pageLoaded={pageLoaded} />
          </div>

          <div className={`p-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
            darkMode ? '' : ''
          }`}>
            <div className="relative z-10">
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Audit Status</div>
              <div className="text-lg font-bold font-headline mb-4">Monthly Report</div>
              {isAdmin && (
                <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/30 transition-all">Review Now</button>
              )}
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10">fact_check</span>
          </div>
        </div>
      </div>

      <RecentLedgerEntries 
        transactions={transactions} 
        darkMode={darkMode} 
        deleteTransaction={deleteTransaction}
        setEditingTransaction={setEditingTransaction}
        setShowForm={setShowForm}
        isAdmin={isAdmin}
      />
    </>
  );
}

function TransactionsView({ transactions, darkMode, deleteTransaction, setEditingTransaction, setShowForm, isAdmin }) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    return filter === 'all' || t.type === filter;
  });

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-6 lg:mb-12">
        <div>
          <h2 className={`text-2xl lg:text-4xl font-extrabold tracking-tight font-headline mb-1 lg:mb-2 ${darkMode ? 'text-white' : 'text-on-surface'}`}>Transaction Ledger</h2>
          <p className={`text-xs lg:text-sm ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Real-time audit log of all financial movements</p>
        </div>
        <div className="flex gap-2 lg:gap-4">
          <div className={`flex items-center gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[10px] lg:text-sm ${darkMode ? 'bg-[#181c22] text-slate-300' : 'bg-surface-container-low text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-sm lg:text-lg hidden sm:block">calendar_month</span>
            <span className="hidden md:inline">Oct 01 - Oct 31</span>
            <span className="md:hidden">Date</span>
          </div>
          <button className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg text-[10px] lg:text-sm font-semibold ${
            darkMode ? 'bg-[#262a31] hover:bg-slate-700 text-white' : 'bg-surface-container-highest hover:bg-surface-variant text-on-surface'
          } transition-colors`}>
            <span className="material-symbols-outlined text-sm lg:text-lg">filter_list</span>
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-12">
        <div className={`p-3 lg:p-6 rounded-xl border ${darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-low'}`}>
          <p className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Total Volume</p>
          <h3 className={`text-base lg:text-2xl font-bold font-headline ${darkMode ? 'text-white' : 'text-primary'}`}>${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
        </div>
        <div className={`p-3 lg:p-6 rounded-xl border ${darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-low'}`}>
          <p className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Pending</p>
          <h3 className={`text-base lg:text-2xl font-bold font-headline ${darkMode ? 'text-white' : ''}`}>{transactions.filter(t => t.status === 'pending').length}</h3>
        </div>
        <div className={`p-3 lg:p-6 rounded-xl border ${darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-low'}`}>
          <p className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Error Rate</p>
          <h3 className={`text-base lg:text-2xl font-bold font-headline ${darkMode ? 'text-white' : 'text-error'}`}>0.02%</h3>
        </div>
        <div className={`p-3 lg:p-6 rounded-xl border ${darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-low'}`}>
          <p className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Verified</p>
          <h3 className={`text-base lg:text-2xl font-bold font-headline ${darkMode ? 'text-green-400' : 'text-tertiary'}`}>94%</h3>
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden ring-1 ${darkMode ? 'bg-[#181c22] ring-slate-700' : 'bg-surface-container-lowest ring-outline-variant/15'}`}>
        <div className={`p-3 lg:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b ${darkMode ? 'border-slate-800' : 'border-surface-container-low'}`}>
          <h3 className={`font-bold text-sm lg:text-lg ${darkMode ? 'text-white' : ''}`}>Ledger Entries</h3>
          <div className="flex gap-1 lg:gap-2">
            <button onClick={() => setFilter('all')} className={`text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-1 rounded transition-colors ${filter === 'all' ? 'bg-primary text-white' : `${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-on-surface-variant hover:bg-surface-container-high'}`}`}>All</button>
            <button onClick={() => setFilter('expense')} className={`text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-1 rounded transition-colors ${filter === 'expense' ? 'bg-primary text-white' : `${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-on-surface-variant hover:bg-surface-container-high'}`}`}>Out</button>
            <button onClick={() => setFilter('income')} className={`text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-1 rounded transition-colors ${filter === 'income' ? 'bg-primary text-white' : `${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-on-surface-variant hover:bg-surface-container-high'}`}`}>In</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className={`${darkMode ? 'bg-[#262a31] text-slate-500' : 'bg-surface-container-low/50 text-on-surface-variant'}`}>
                <th className="px-3 lg:px-6 py-2 lg:py-4 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest">Date</th>
                <th className="px-3 lg:px-6 py-2 lg:py-4 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest">Recipient</th>
                <th className="px-3 lg:px-6 py-2 lg:py-4 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest hidden sm:table-cell">Category</th>
                <th className="px-3 lg:px-6 py-2 lg:py-4 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-right">Amount</th>
                <th className="px-3 lg:px-6 py-2 lg:py-4 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-surface-container-low'}`}>
              {filteredTransactions.slice(0, 8).map((t, index) => {
                const icons = ['apartment', 'person', 'design_services', 'home_repair_service', 'shopping_cart', 'local_hospital', 'flight', 'restaurant'];
                return (
                  <tr key={t.id} className={`hover:${darkMode ? 'bg-[#262a31]/50' : 'bg-surface-container-low'} transition-colors group`}>
                    <td className="px-3 lg:px-6 py-3 lg:py-5">
                      <p className={`text-[10px] lg:text-sm font-semibold ${darkMode ? 'text-white' : ''}`}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-primary-container/10 text-primary'}`}>
                          <span className="material-symbols-outlined text-[12px] lg:text-sm">{icons[index % icons.length]}</span>
                        </div>
                        <p className={`text-[10px] lg:text-sm font-bold ${darkMode ? 'text-white' : ''}`}>{t.description.substring(0, 20)}</p>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-5 hidden sm:table-cell">
                      <span className={`px-1.5 lg:px-2 py-0.5 lg:py-1 text-[8px] lg:text-[10px] font-bold rounded uppercase ${darkMode ? 'bg-[#262a31] text-blue-400' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {t.category.substring(0, 10)}
                      </span>
                    </td>
                    <td className={`px-3 lg:px-6 py-3 lg:py-5 text-right font-mono font-bold text-[10px] lg:text-sm ${t.type === 'income' ? (darkMode ? 'text-green-400' : 'text-tertiary') : (darkMode ? 'text-white' : '')}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-5 text-right">
                      {isAdmin ? (
                        <>
                          <button onClick={() => { setEditingTransaction(t); setShowForm(true); }} className={`p-1 lg:p-2 transition-colors ${darkMode ? 'text-slate-500 hover:text-blue-400' : 'text-on-surface-variant hover:text-primary'}`}>
                            <span className="material-symbols-outlined text-base lg:text-xl">edit</span>
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className={`p-1 lg:p-2 transition-colors ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-on-surface-variant hover:text-error'}`}>
                            <span className="material-symbols-outlined text-base lg:text-xl">delete</span>
                          </button>
                        </>
                      ) : <span className={`text-[8px] lg:text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Read-only</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={`p-3 lg:p-6 flex flex-col sm:flex-row justify-between items-center gap-2 border-t ${darkMode ? 'bg-[#181c22]/50 border-slate-800' : 'bg-surface-container-low/30 border-surface-container-low'}`}>
          <p className={`text-[10px] lg:text-xs ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Showing {filteredTransactions.slice(0, 8).length} of {filteredTransactions.length}</p>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1 text-[10px] lg:text-xs font-bold ${darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-on-surface-variant hover:text-primary'}`}>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className={`w-6 lg:w-8 h-6 lg:h-8 flex items-center justify-center rounded text-[10px] lg:text-xs font-bold ${darkMode ? 'bg-blue-500 text-white' : 'bg-primary text-white'}`}>1</span>
            <button className={`flex items-center gap-1 text-[10px] lg:text-xs font-bold ${darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-on-surface-variant hover:text-primary'}`}>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {isAdmin && (
        <aside className={`fixed bottom-4 right-4 lg:bottom-10 lg:right-10 w-auto lg:w-80 p-3 lg:p-6 rounded-xl shadow-2xl z-50 ${darkMode ? 'bg-slate-800/95 backdrop-blur-xl ring-1 ring-slate-700' : 'bg-surface-variant/95 backdrop-blur-xl ring-1 ring-white/20'}`}>
          <div className={`flex items-center justify-between mb-2 lg:mb-6`}>
            <h4 className={`font-bold text-xs lg:text-sm uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-on-surface'}`}>Audit Checklist</h4>
            <span className={`material-symbols-outlined text-sm lg:text-lg ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>verified_user</span>
          </div>
          <div className="space-y-2 lg:space-y-4 hidden sm:block">
            <div className="flex gap-2 lg:gap-3">
              <span className={`material-symbols-outlined text-sm lg:text-lg ${darkMode ? 'text-green-400' : 'text-tertiary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className={`text-[10px] lg:text-xs font-bold ${darkMode ? 'text-white' : ''}`}>Daily reconciliation</p>
                <p className={`text-[8px] lg:text-[10px] ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>Verified at 08:00 AM</p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

function InsightsView({ darkMode, transactions, isAdmin }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { month: 'Jan', target: 65, actual: 75 },
    { month: 'Feb', target: 70, actual: 85 },
    { month: 'Mar', target: 68, actual: 62 },
    { month: 'Apr', target: 72, actual: 95 },
    { month: 'May', target: 75, actual: 78 },
    { month: 'Jun', target: 80, actual: 88 },
    { month: 'Jul', target: 78, actual: 92 },
    { month: 'Aug', target: 82, actual: 85 },
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.target, d.actual)));

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-8 lg:mb-10">
        <div>
          <h2 className={`text-2xl lg:text-4xl font-extrabold tracking-tight font-headline ${darkMode ? 'text-white' : 'text-on-background'}`}>Financial Insights</h2>
          <p className={`mt-1 lg:mt-2 text-xs lg:text-sm ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Real-time oversight of institutional liquidity</p>
        </div>
        <div className="flex gap-2 lg:gap-3">
          <button className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-bold text-[10px] lg:text-sm transition-all duration-200 hover:scale-105 ${
            darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-surface-container-high text-primary hover:bg-surface-container-highest'
          }`}>
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="hidden sm:inline ml-1">Export</span>
          </button>
          {isAdmin && (
            <button className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-bold text-[10px] lg:text-sm flex items-center gap-1 lg:gap-2 transition-all duration-200 hover:scale-105 ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-primary text-on-primary'
            }`}>
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span className="hidden sm:inline">Parameters</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
        <div className={`lg:col-span-8 rounded-xl p-4 lg:p-8 border transition-all duration-300 ${
          darkMode ? 'bg-[#181c22] border-slate-800 hover:border-blue-500/30' : 'bg-surface-container-lowest border-outline-variant/10 hover:border-primary/30'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 lg:mb-6">
            <div>
              <h3 className={`text-base lg:text-lg font-bold font-headline ${darkMode ? 'text-white' : 'text-on-background'}`}>Operating Capital</h3>
              <p className={`text-[10px] lg:text-xs ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>Quarterly comparison vs Target</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-blue-500' : 'bg-primary'}`}></span>
                <span className="text-[10px] lg:text-xs font-medium text-slate-500">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${darkMode ? 'bg-slate-600' : 'bg-surface-container-highest'}`}></span>
                <span className="text-[10px] lg:text-xs font-medium text-slate-500">Target</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Chart */}
          <div className="relative h-48 lg:h-72">
            {/* Y-axis labels */}
            <div className={`absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-medium ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              <span>{maxValue}%</span>
              <span>{Math.round(maxValue * 0.75)}%</span>
              <span>{Math.round(maxValue * 0.5)}%</span>
              <span>{Math.round(maxValue * 0.25)}%</span>
              <span>0%</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute left-8 right-0 top-0 h-full flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-full h-px ${darkMode ? 'bg-slate-800/50' : 'bg-slate-200/50'}`}></div>
              ))}
            </div>
            
            {/* Chart bars */}
            <div className="absolute left-8 right-0 bottom-8 h-[calc(100%-2rem)] flex items-end justify-between gap-2 lg:gap-4">
              {chartData.map((data, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {hoveredIndex === i && (
                    <div className={`absolute -top-16 px-3 py-2 rounded-lg shadow-xl z-10 whitespace-nowrap animate-fadeIn ${
                      darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                    }`}>
                      <div className="text-[10px] font-bold mb-1">{data.month} 2024</div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-primary'}`}></span>
                        <span>Actual: {data.actual}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] mt-1">
                        <span className={`w-2 h-2 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-slate-400'}`}></span>
                        <span>Target: {data.target}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="w-full flex items-end gap-1 h-full">
                    {/* Target bar */}
                    <div 
                      className={`flex-1 rounded-t transition-all duration-700 ease-out ${
                        darkMode ? 'bg-slate-700/60' : 'bg-slate-300'
                      }`} 
                      style={{ 
                        height: pageLoaded ? `${(data.target / maxValue) * 100}%` : '0%',
                        transitionDelay: `${i * 50}ms`
                      }}
                    ></div>
                    {/* Actual bar */}
                    <div 
                      className={`flex-1 rounded-t transition-all duration-700 ease-out group-hover:brightness-110 ${
                        data.actual >= data.target 
                          ? (darkMode ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-primary to-blue-400') 
                          : (darkMode ? 'bg-gradient-to-t from-red-600 to-red-400' : 'bg-gradient-to-t from-error to-red-400')
                      }`} 
                      style={{ 
                        height: pageLoaded ? `${(data.actual / maxValue) * 100}%` : '0%',
                        transitionDelay: `${i * 100}ms`
                      }}
                    >
                      {/* Success/Fail indicator */}
                      {data.actual >= data.target && (
                        <div className="w-full h-full relative">
                          <div className={`absolute -top-1 right-0 w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`mt-2 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{data.month}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-lg">trending_up</span>
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>Avg: 82.5%</span>
                <span className={`text-[10px] ml-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>+12.5%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500 text-lg">emoji_events</span>
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>Best: Apr</span>
                <span className={`text-[10px] ml-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>95%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500 text-lg">speed</span>
              <div>
                <span className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>Consistency</span>
                <span className={`text-[10px] ml-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>87%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-4 rounded-xl p-4 lg:p-8 flex flex-col shadow-xl relative overflow-hidden ${
          darkMode ? 'bg-gradient-to-br from-blue-600 to-blue-900 text-white' : 'bg-gradient-to-br from-primary to-primary-container text-white shadow-primary/20'
        }`}>
          <div className="absolute top-0 right-0 w-20 lg:w-32 h-20 lg:h-32 bg-white/5 rounded-full -mr-10 lg:-mr-16 -mt-10 lg:-mt-16"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4 lg:mb-10">
              <h3 className="text-base lg:text-lg font-bold font-headline">Tax Projections</h3>
              <span className="material-symbols-outlined opacity-60 text-lg lg:text-xl">calculate</span>
            </div>
            <div className="space-y-3 lg:space-y-6">
              <div>
                <p className="text-[8px] lg:text-[10px] uppercase tracking-widest opacity-70 font-bold mb-1">Estimated Liability (Q3)</p>
                <p className="text-xl lg:text-3xl font-extrabold tracking-tight font-headline">$1,240,500</p>
              </div>
              <div className="space-y-2 lg:space-y-3">
                <div className="bg-white/10 rounded-lg p-2 lg:p-3 flex justify-between items-center text-[10px] lg:text-sm">
                  <span className="opacity-80">Effective Rate</span>
                  <span className="font-bold">21.4%</span>
                </div>
                <div className="bg-white/10 rounded-lg p-2 lg:p-3 flex justify-between items-center text-[10px] lg:text-sm">
                  <span className="opacity-80">Reserved</span>
                  <span className="font-bold">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-12">
          <div className="flex items-center gap-3 mb-2 lg:mb-4">
            <h3 className={`text-base lg:text-xl font-bold font-headline ${darkMode ? 'text-white' : 'text-on-background'}`}>Unusual Activity</h3>
            <span className={`text-[8px] lg:text-[10px] font-black px-1.5 lg:px-2 py-0.5 rounded uppercase ${
              darkMode ? 'bg-red-500/20 text-red-400' : 'bg-error-container text-on-error-container'
            }`}>2 Urgent</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
            {[
              { icon: 'warning', title: 'High Velocity Withdrawal', desc: '$450k withdrawal requests', color: 'error', time: '2m ago' },
              { icon: 'shield_person', title: 'New Admin Logic', desc: 'Tax logic parameters updated', color: 'primary', time: '14m ago' },
              { icon: 'language', title: 'Anomalous IP Access', desc: 'Login from Frankfurt, DE', color: 'tertiary', time: '1h ago' },
            ].map((alert, i) => (
              <div key={i} className={`p-3 lg:p-6 rounded-xl border-l-4 transition-colors ${
                darkMode ? 'bg-[#181c22] border-l-red-500 hover:bg-slate-800' : `bg-surface-container-low border-l-${alert.color === 'error' ? 'error' : alert.color === 'primary' ? 'primary' : 'tertiary-container'} hover:bg-surface-container`
              }`}>
                <div className="flex justify-between items-start mb-2 lg:mb-4">
                  <span className={`material-symbols-outlined text-${alert.color === 'error' ? 'error' : alert.color === 'primary' ? 'primary' : 'tertiary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{alert.icon}</span>
                  <span className={`text-[8px] lg:text-[10px] font-bold uppercase ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{alert.time}</span>
                </div>
                <h4 className={`font-bold text-[10px] lg:text-sm mb-1 ${darkMode ? 'text-white' : 'text-on-background'}`}>{alert.title}</h4>
                <p className={`text-[8px] lg:text-xs mb-3 lg:mb-6 ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>{alert.desc}</p>
                {isAdmin && (
                  <div className="flex gap-1 lg:gap-2">
                    <button className={`flex-1 py-1 lg:py-2 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest rounded-lg ${
                      darkMode ? 'bg-red-500 text-white' : 'bg-error text-white'
                    }`}>Review</button>
                    <button className={`px-2 lg:px-3 py-1 lg:py-2 text-[8px] lg:text-[10px] font-bold uppercase tracking-widest rounded-lg ${
                      darkMode ? 'bg-slate-700 text-white' : 'bg-surface-container-highest text-on-surface'
                    }`}>Dismiss</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`col-span-1 lg:col-span-12 rounded-xl overflow-hidden ${
          darkMode ? 'bg-[#181c22] border border-slate-800' : 'bg-surface border border-outline-variant/10'
        }`}>
          <div className={`p-4 lg:p-8 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
            darkMode ? 'border-slate-800 bg-slate-800/50' : 'border-outline-variant/10 bg-surface-container-low'
          }`}>
            <h3 className={`text-base lg:text-lg font-bold font-headline ${darkMode ? 'text-white' : 'text-on-background'}`}>System Logs</h3>
            <div className={`flex items-center gap-2 text-[10px] lg:text-xs font-bold ${darkMode ? 'text-blue-400' : 'text-primary'}`}>
              <span className="material-symbols-outlined text-sm">sync</span>
              Live Streaming
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className={darkMode ? 'bg-slate-800/50' : 'bg-surface-container-low/50'}>
                  <th className={`px-3 lg:px-8 py-2 lg:py-4 text-[8px] lg:text-[10px] font-extrabold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Time</th>
                  <th className={`px-3 lg:px-8 py-2 lg:py-4 text-[8px] lg:text-[10px] font-extrabold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Event</th>
                  <th className={`px-3 lg:px-8 py-2 lg:py-4 text-[8px] lg:text-[10px] font-extrabold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-outline-variant/10'}`}>
                {[
                  { time: '14:22:01', event: 'ACCESS_GRANTED', user: 'adm_r_chen@zorvyn.io', status: 'Success' },
                  { time: '14:20:15', event: 'API_KEY_ROTATION', user: 'System_Worker_33', status: 'Success' },
                  { time: '14:18:44', event: 'UNAUTHORIZED_ACCESS', user: 'anon_ip_88.1.12.3', status: 'Failed' },
                ].map((log, i) => (
                  <tr key={i} className={`hover:${darkMode ? 'bg-slate-800/50' : 'bg-surface-container-low'} transition-colors`}>
                    <td className={`px-3 lg:px-8 py-2 lg:py-5 text-[10px] lg:text-xs font-mono ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{log.time}</td>
                    <td className={`px-3 lg:px-8 py-2 lg:py-5 text-[10px] lg:text-xs font-bold ${darkMode ? 'text-white' : 'text-on-background'}`}>{log.event}</td>
                    <td className="px-3 lg:px-8 py-2 lg:py-5">
                      <span className={`text-[8px] lg:text-[10px] px-1.5 lg:px-2 py-0.5 rounded font-black uppercase ${
                        log.status === 'Success' 
                          ? (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-tertiary-container text-on-tertiary-container')
                          : (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-error-container text-on-error-container')
                      }`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsView({ darkMode, toggleDarkMode, isAdmin }) {
  const { role, setRole } = useApp();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <>
      <header className="mb-8 lg:mb-12">
        <h2 className={`text-2xl lg:text-4xl font-extrabold tracking-tight font-headline mb-1 lg:mb-2 ${darkMode ? 'text-white' : 'text-on-surface'}`}>System Preferences</h2>
        <p className={`text-xs lg:text-sm ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Manage your workspace and security settings</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-8">
        <section className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
          <div className={`col-span-1 md:col-span-2 rounded-xl p-4 lg:p-8 border ${
            darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-lowest border-outline-variant/10'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 lg:mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img alt="Profile" className="w-16 lg:w-24 h-16 lg:h-24 rounded-xl object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                  {isAdmin && (
                    <button className={`absolute -bottom-1.5 -right-1.5 p-1.5 lg:p-2 rounded-lg shadow-lg hover:scale-110 transition-transform ${
                      darkMode ? 'bg-blue-500 text-white' : 'bg-primary text-white'
                    }`}>
                      <span className="material-symbols-outlined text-[10px] lg:text-sm">edit</span>
                    </button>
                  )}
                </div>
                <div>
                  <h3 className={`text-lg lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>Julian Thorne</h3>
                  <p className={`flex items-center gap-1 text-xs ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[10px] lg:text-xs">verified</span>
                    julian.thorne@zorvyn.io
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6">
              <div className="space-y-1">
                <label className={`text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>First Name</label>
                <input className={`w-full rounded-lg p-2 lg:p-3 text-sm focus:ring-1 outline-none ${
                  darkMode ? 'bg-slate-800 text-white focus:ring-blue-500' : 'bg-surface-container-low focus:ring-primary'
                }`} type="text" defaultValue="Julian"/>
              </div>
              <div className="space-y-1">
                <label className={`text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Last Name</label>
                <input className={`w-full rounded-lg p-2 lg:p-3 text-sm focus:ring-1 outline-none ${
                  darkMode ? 'bg-slate-800 text-white focus:ring-blue-500' : 'bg-surface-container-low focus:ring-primary'
                }`} type="text" defaultValue="Thorne"/>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 lg:p-8 ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
            <div className="flex items-center gap-3 mb-4 lg:mb-8">
              <div className={`w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined text-base lg:text-xl">tune</span>
              </div>
              <h3 className={`text-base lg:text-xl font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>Preferences</h3>
            </div>
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className={`text-xs lg:text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Base Currency</p>
                  <p className={`text-[10px] lg:text-xs ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>Default ledger view</p>
                </div>
                <select className={`rounded-lg text-xs font-bold py-1.5 px-3 min-w-[120px] ${darkMode ? 'bg-slate-800 text-white' : 'bg-surface-container-lowest'}`}>
                  <option value="USD">🇺🇸 USD ($)</option>
                  <option value="EUR">🇪🇺 EUR (€)</option>
                  <option value="GBP">🇬🇧 GBP (£)</option>
                  <option value="JPY">🇯🇵 JPY (¥)</option>
                  <option value="INR">🇮🇳 INR (₹)</option>
                  <option value="CAD">🇨🇦 CAD ($)</option>
                  <option value="AUD">🇦🇺 AUD ($)</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 lg:pt-4 border-t border-outline-variant/20">
                <div>
                  <p className={`text-xs lg:text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Interface Mode</p>
                  <p className={`text-[10px] lg:text-xs ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>Switch themes</p>
                </div>
                <div className={`p-1 rounded-full flex ${darkMode ? 'bg-slate-700' : 'bg-surface-container-highest'}`}>
                  <button onClick={() => !darkMode && toggleDarkMode()} className={`w-7 lg:w-8 h-7 lg:h-8 rounded-full flex items-center justify-center transition-colors ${
                    !darkMode ? 'bg-white shadow-sm' : 'text-slate-500 hover:text-white'
                  }`}>
                    <span className="material-symbols-outlined text-sm">light_mode</span>
                  </button>
                  <button onClick={() => darkMode && toggleDarkMode()} className={`w-7 lg:w-8 h-7 lg:h-8 rounded-full flex items-center justify-center transition-colors ${
                    darkMode ? 'bg-blue-500 text-white' : 'text-slate-500 hover:text-on-surface'
                  }`}>
                    <span className="material-symbols-outlined text-sm">dark_mode</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 lg:p-8 ${darkMode ? 'bg-[#181c22]' : 'bg-surface-container-low'}`}>
            <div className="flex items-center gap-3 mb-4 lg:mb-8">
              <div className={`w-8 lg:w-10 h-8 lg:h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-green-500/20 text-green-400' : 'bg-tertiary-container text-white'
              }`}>
                <span className="material-symbols-outlined text-base lg:text-xl">shield_lock</span>
              </div>
              <h3 className={`text-base lg:text-xl font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>Security</h3>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <div className={`p-3 lg:p-4 rounded-lg border-l-4 ${
                darkMode ? 'bg-slate-800 border-l-green-500' : 'bg-surface-container-lowest border-l-tertiary'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs lg:text-sm font-bold ${darkMode ? 'text-white' : ''}`}>2-Factor Auth</span>
                  <button 
                    onClick={() => isAdmin && setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`w-9 lg:w-10 h-5 rounded-full relative flex items-center px-0.5 transition-colors ${
                      twoFactorEnabled ? 'bg-green-500' : darkMode ? 'bg-slate-600' : 'bg-slate-300'
                    } ${!isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${twoFactorEnabled ? 'ml-auto' : ''}`}></div>
                  </button>
                </div>
                <p className={`text-[10px] lg:text-[11px] ${darkMode ? 'text-slate-400' : 'text-on-surface-variant'}`}>Extra layer of protection</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="xl:col-span-4 flex flex-col gap-4 lg:gap-8">
          <div className={`rounded-xl p-4 lg:p-8 relative overflow-hidden shadow-xl ${
            darkMode ? 'bg-gradient-to-br from-blue-600 to-blue-900 text-white' : 'bg-gradient-to-br from-primary to-primary-container text-white'
          }`}>
            <div className="absolute -right-8 -bottom-8 w-24 lg:w-48 h-24 lg:h-48 bg-white/5 rounded-full blur-2xl lg:blur-3xl"></div>
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <div className="px-2 lg:px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest">Administrator</div>
              <span className="material-symbols-outlined opacity-50 text-lg">verified_user</span>
            </div>
            <h3 className="text-lg lg:text-2xl font-bold mb-1 lg:mb-2">Admin Dashboard</h3>
            <p className={`text-xs lg:text-sm font-medium mb-4 lg:mb-8 ${darkMode ? 'text-blue-200' : 'text-primary-container'}`}>Full control over Zorvyn Organization</p>
            {isAdmin && (
              <button className={`w-full py-2 lg:py-3 rounded-lg font-black text-xs lg:text-sm transition-all shadow-md ${
                darkMode ? 'bg-white text-blue-600 hover:bg-slate-100' : 'bg-white text-primary hover:bg-on-primary-container hover:text-white'
              }`}>
                ENTER ADMIN HUB
              </button>
            )}
          </div>

          <div className={`rounded-xl p-4 lg:p-8 border ${
            darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-lowest border-outline-variant/20'
          }`}>
            <h4 className={`text-xs lg:text-sm font-black uppercase tracking-widest mb-4 lg:mb-6 ${darkMode ? 'text-slate-300' : 'text-on-surface-variant'}`}>Organization Members</h4>
            <div className="space-y-3 lg:space-y-6">
              {[
                { name: 'Elena Vance', role: 'Financial Analyst', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
                { name: 'Markus Chen', role: 'Tax Strategist', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img alt={member.name} className="w-8 lg:w-10 h-8 lg:h-10 rounded-lg object-cover" src={member.img} />
                    <div>
                      <p className={`text-xs lg:text-sm font-bold ${darkMode ? 'text-white' : ''}`}>{member.name}</p>
                      <p className={`text-[10px] lg:text-[10px] ${darkMode ? 'text-slate-500' : 'text-on-surface-variant'}`}>{member.role}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] lg:text-[10px] font-bold px-1.5 lg:px-2 py-0.5 lg:py-1 rounded ${
                    darkMode ? 'bg-slate-800 text-blue-400' : 'bg-surface-container-high text-primary'
                  }`}>VIEW</span>
                </div>
              ))}
            </div>
            <div className="mt-6 lg:mt-10 pt-4 lg:pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between mb-2">
                <span className={`text-[10px] lg:text-xs font-bold ${darkMode ? 'text-slate-300' : ''}`}>Storage Usage</span>
                <span className="text-[10px] lg:text-xs font-black">72%</span>
              </div>
              <div className={`w-full h-1.5 lg:h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-surface-container-high'}`}>
                <div className="w-[72%] h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {isAdmin && (
        <footer className="mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-end gap-2 lg:gap-4">
          <button className={`px-4 lg:px-8 py-2 lg:py-3 rounded-lg font-bold text-sm transition-all ${
            darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}>Discard</button>
          <button className={`px-6 lg:px-10 py-2 lg:py-3 rounded-lg font-black shadow-lg transition-all active:scale-95 text-sm ${
            darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-primary text-white shadow-primary/20 hover:opacity-90'
          }`}>Save Config</button>
        </footer>
      )}
    </>
  );
}

function RecentLedgerEntries({ transactions, darkMode, deleteTransaction, setEditingTransaction, setShowForm, isAdmin }) {
  return (
    <section className="space-y-4 lg:space-y-6 mt-8 lg:mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h2 className={`text-lg lg:text-xl font-bold font-headline ${darkMode ? 'text-white' : ''}`}>Recent Ledger Entries</h2>
          <p className={`text-xs lg:text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Managed historical transaction logs</p>
        </div>
        <button className={`flex items-center gap-1 lg:gap-2 font-bold text-[10px] lg:text-xs uppercase tracking-widest hover:underline ${
          darkMode ? 'text-blue-400' : 'text-primary'
        }`}>
          View All <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

      <div className={`rounded-xl overflow-hidden border ${
        darkMode ? 'bg-[#181c22] border-slate-800' : 'bg-surface-container-lowest border-outline-variant/15'
      }`}>
        <div className="hidden lg:grid grid-cols-12 px-8 py-4 text-[10px] font-bold uppercase tracking-widest border-b bg-surface-container-low text-slate-500 border-outline-variant/10">
          <div className="col-span-4">Entity</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-slate-800/50 lg:divide-none">
          {transactions.slice(0, 4).map((t, index) => {
            const icons = ['apartment', 'cloud_done', 'analytics', 'styler'];
            return (
              <div key={t.id} className={`lg:grid lg:grid-cols-12 lg:px-8 lg:py-5 items-center hover:bg-[#262a31]/50 transition-colors group ${
                darkMode ? '' : 'lg:hover:bg-surface-container-low'
              }`}>
                <div className="hidden lg:flex col-span-4 items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-[#262a31]' : 'bg-surface-container-high'
                  }`}>
                    <span className={`material-symbols-outlined ${darkMode ? 'text-blue-400' : 'text-primary'}`}>
                      {icons[index % icons.length]}
                    </span>
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-on-surface'}`}>{t.description.substring(0, 25)}</div>
                    <div className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{t.category}</div>
                  </div>
                </div>
                
                <div className="flex lg:hidden items-center justify-between p-3 border-b border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${darkMode ? 'text-blue-400' : 'text-primary'}`}>{icons[index % icons.length]}</span>
                    <div>
                      <p className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>{t.description.substring(0, 20)}</p>
                      <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.type === 'income' ? (darkMode ? 'text-green-400' : 'text-tertiary') : (darkMode ? 'text-red-400' : 'text-error')}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(0)}
                    </p>
                    {isAdmin && (
                      <div className="flex gap-1 mt-1 justify-end">
                        <button onClick={() => { setEditingTransaction(t); setShowForm(true); }} className={`p-1 ${darkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-primary'}`}>
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => deleteTransaction(t.id)} className={`p-1 ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-error'}`}>
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`hidden lg:block col-span-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="hidden lg:block col-span-2">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                    darkMode ? 'bg-[#262a31] text-blue-400' : 'bg-surface-container-high text-primary'
                  }`}>
                    {t.category.substring(0, 12)}
                  </span>
                </div>
                <div className={`hidden lg:block col-span-2 text-right font-bold text-sm font-headline ${
                  t.type === 'income' ? (darkMode ? 'text-green-400' : 'text-tertiary') : (darkMode ? 'text-red-400' : 'text-error')
                }`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(0)}
                </div>
                <div className="hidden lg:block col-span-2 text-right">
                  {isAdmin ? (
                    <>
                      <button onClick={() => { setEditingTransaction(t); setShowForm(true); }} className={`p-2 transition-colors ${darkMode ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-primary'}`}>
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => deleteTransaction(t.id)} className={`p-2 transition-colors ${darkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-error'}`}>
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </>
                  ) : <span className="text-[10px] text-slate-500">Read-only</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DonutChart({ data, darkMode, pageLoaded }) {
  const colors = [
    { main: '#3b82f6', light: 'rgba(59, 130, 246, 0.2)' },
    { main: '#f97316', light: 'rgba(249, 115, 22, 0.2)' },
    { main: '#22c55e', light: 'rgba(34, 197, 94, 0.2)' },
    { main: '#a855f7', light: 'rgba(168, 85, 247, 0.2)' },
  ];

  const total = data.reduce((sum, d) => sum + d.amount, 0);
  
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2 animate-pulse">pie_chart</span>
        <p className="text-xs text-slate-500">No data</p>
      </div>
    );
  }

  let cumulativePercent = 0;
  
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="60" fill="none" stroke={darkMode ? '#262a31' : '#e1e8ff'} strokeWidth="20"/>
          {data.map((item, index) => {
            const percent = total > 0 ? (item.amount / total) * 100 : 0;
            const dashArray = `${(percent / 100) * 377} 377`;
            const dashOffset = -cumulativePercent * 3.77;
            cumulativePercent += percent;
            return (
              <circle key={item.category} cx="80" cy="80" r="60" fill="none" stroke={colors[index % colors.length].main}
                strokeWidth="20" strokeDasharray={dashArray} strokeDashoffset={dashOffset} transform="rotate(-90 80 80)"
                style={{ 
                  transition: pageLoaded ? 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  opacity: pageLoaded ? 1 : 0,
                  transitionDelay: `${index * 100}ms`
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total</span>
          <span className={`text-lg font-bold ${darkMode ? 'text-white' : ''}`}>${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.category} className={`flex items-center justify-between transition-all duration-300 ${
            pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`} style={{ transitionDelay: `${index * 100 + 300}ms` }}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-transform duration-300 hover:scale-150`} style={{ backgroundColor: colors[index % colors.length].main }} />
              <span className={`text-xs ${darkMode ? 'text-white' : ''}`}>{item.category.substring(0, 10)}</span>
            </div>
            <span className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>{total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionForm({ transaction, onClose }) {
  const { addTransaction, editTransaction, darkMode } = useApp();
  const { categories } = { categories: ['Technology', 'Real Estate', 'Maintenance', 'Utilities', 'Travel', 'Food', 'Entertainment', 'Healthcare'] };
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
      editTransaction(transaction.id, { date: formData.date, amount, category: formData.category, type: formData.type, description: formData.description });
    } else {
      addTransaction({ date: formData.date, amount, category: formData.category, type: formData.type, description: formData.description });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
      <div className={`rounded-2xl p-6 lg:p-8 w-full max-w-md shadow-2xl animate-slideUp ${
        darkMode ? 'bg-[#1c2026]' : 'bg-white'
      }`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className={`text-lg lg:text-xl font-bold font-headline ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-bold rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                formData.type === 'expense' ? 'border-red-500 bg-red-500/10 text-red-400' : darkMode ? 'border-slate-600 text-slate-400 hover:border-red-500/50' : 'border-slate-200 text-slate-500 hover:border-red-500/50'
              }`}>
              <span className="flex items-center justify-center gap-1 lg:gap-2">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> Expense
              </span>
            </button>
            <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`px-3 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm font-bold rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                formData.type === 'income' ? 'border-orange-500 bg-orange-500/10 text-orange-400' : darkMode ? 'border-slate-600 text-slate-400 hover:border-orange-500/50' : 'border-slate-200 text-slate-500 hover:border-orange-500/50'
              }`}>
              <span className="flex items-center justify-center gap-1 lg:gap-2">
                <span className="material-symbols-outlined text-sm">arrow_downward</span> Income
              </span>
            </button>
          </div>

          <div>
            <label className={`block text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 lg:mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm border-2 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                darkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-primary'
              }`} required />
          </div>

          <div>
            <label className={`block text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 lg:mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Amount</label>
            <div className="relative">
              <span className={`absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 font-bold ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>$</span>
              <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00" className={`w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-2 lg:py-3 text-base lg:text-lg font-bold border-2 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-primary'
                }`} required />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 lg:mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Category</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm border-2 rounded-lg transition-all duration-200 ${
                darkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-primary'
              }`}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className={`block text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 lg:mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description" className={`w-full px-3 lg:px-4 py-2 lg:py-3 text-sm border-2 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                darkMode ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-primary'
              }`} required />
          </div>

          <div className="flex gap-2 lg:gap-3 pt-2 lg:pt-4">
            <button type="button" onClick={onClose}
              className={`flex-1 px-3 lg:px-4 py-2.5 lg:py-3.5 border-2 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] ${
                darkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}>
              Cancel
            </button>
            <button type="submit"
              className={`flex-1 px-3 lg:px-4 py-2.5 lg:py-3.5 font-bold rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 text-sm ${
                darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-primary text-white hover:shadow-xl'
              }`}>
              {transaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function calculateSummary(transactions) {
  const totalBalance = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return { totalBalance, income, expenses };
}

function calculateCategorySpending(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const byCategory = expenses.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  return Object.entries(byCategory).map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount).slice(0, 6);
}

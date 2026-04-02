import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function Header() {
  const { role, setRole, darkMode, toggleDarkMode } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleExport = () => {
    const data = localStorage.getItem('finance_transactions');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white text-lg">💰</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
              <button
                onClick={toggleDarkMode}
                className="relative w-12 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-600 dark:to-gray-700 rounded-full p-0.5 cursor-pointer"
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${darkMode ? 'left-[26px]' : 'left-0.5'}`}>
                  <div className="flex items-center justify-center w-full h-full text-xs">
                    {darkMode ? '🌙' : '☀️'}
                  </div>
                </div>
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium pr-2">
                {darkMode ? 'Dark' : 'Light'}
              </span>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Role:</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                role === 'admin'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {role === 'admin' ? '👑 Admin' : '👁 Viewer'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

import { useApp } from '../context/AppContext';

export function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { isAdmin, darkMode } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'transactions', label: 'Transactions', icon: 'receipt_long' },
    { id: 'reports', label: 'Insights', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-slate-950' : 'bg-[#f1f3ff]'} p-6`}>
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-primary-container' : 'bg-primary-container'}`}>
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight leading-none ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>FinanceHub</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Wealth Management</p>
          </div>
        </div>
      </div>

      <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-white/40'}`}>
        <img 
          alt="User Profile" 
          className={`w-10 h-10 rounded-lg object-cover ${darkMode ? 'border border-slate-700' : ''}`}
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        />
        <div>
          <div className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-200' : ''}`}>Admin Console</div>
          <div className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Full Access</div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 mt-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) setMobileOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${activeTab === item.id
                ? `${darkMode 
                    ? 'bg-blue-900/20 text-blue-400 font-semibold border-r-2 border-blue-400' 
                    : 'bg-white text-blue-700 font-semibold shadow-sm'
                  }`
                : `${darkMode 
                    ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' 
                    : 'text-slate-600 hover:bg-white/50'
                  }`
              }
            `}
          >
            <span className="material-symbols-outlined" style={activeTab === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button className={`
          w-full py-3 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2
          active:scale-95 transition-transform
          ${darkMode 
            ? 'bg-gradient-to-br from-primary-container to-primary text-white shadow-primary/20 hover:opacity-90' 
            : 'bg-gradient-to-r from-primary to-primary-container text-white shadow-md hover:opacity-90'
          }
        `}>
          <span className="material-symbols-outlined text-sm">add</span>
          New Transaction
        </button>
        
        <div className="mt-4 space-y-1">
          <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-600 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">help</span>
            <span className="text-sm">Help</span>
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' : 'text-slate-600 hover:bg-white/50'}`}>
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={`
        fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300
        w-64 hidden lg:flex
        ${darkMode ? 'bg-slate-950' : 'bg-[#f1f3ff]'}
      `}>
        <SidebarContent />
      </aside>

      <aside className={`
        fixed left-0 top-0 h-screen flex flex-col z-50 w-80 transition-transform duration-300
        lg:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${darkMode ? 'bg-slate-950' : 'bg-[#f1f3ff]'}
      `}>
        <SidebarContent isMobile />
      </aside>
    </>
  );
}

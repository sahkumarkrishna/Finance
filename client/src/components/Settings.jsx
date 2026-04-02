import { useApp } from '../context/AppContext';

export function Settings() {
  const { role, setRole, darkMode, toggleDarkMode } = useApp();

  const handleExportCSV = () => {
    const data = localStorage.getItem('finance_transactions');
    if (data) {
      const transactions = JSON.parse(data);
      const csv = [
        ['Date', 'Category', 'Description', 'Type', 'Amount'],
        ...transactions.map(t => [t.date, t.category, t.description, t.type, t.amount])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="mb-8">
        <h2 className={`text-3xl lg:text-4xl font-extrabold tracking-tight font-headline mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>System Preferences</h2>
        <p className={`max-w-2xl font-body ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Manage your workspace, security protocols, and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className={`rounded-2xl p-6 lg:p-8 ${darkMode ? 'bg-[#1c2026]' : 'bg-white'} border ${darkMode ? 'border-slate-800' : 'border-slate-100'} shadow-lg`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img 
                    alt="Profile" 
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover" 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                  />
                  <button className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg hover:scale-110 transition-transform ${darkMode ? 'bg-blue-500 text-white' : 'bg-primary text-white'}`}>
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <div>
                  <h3 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Julian Thorne</h3>
                  <p className={`flex items-center gap-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-xs">verified</span>
                    julian.thorne@financehub.io
                  </p>
                </div>
              </div>
              <button className={`px-5 py-2.5 rounded-xl font-bold transition-all ${darkMode ? 'bg-slate-700 text-blue-400 hover:bg-slate-600' : 'bg-slate-100 text-primary hover:bg-slate-200'}`}>
                View Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] uppercase font-black tracking-widest px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>First Name</label>
                <input className={`w-full border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all ${darkMode ? 'bg-[#262a31] text-white' : 'bg-surface-container-low text-slate-900'}`} type="text" value="Julian"/>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] uppercase font-black tracking-widest px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Last Name</label>
                <input className={`w-full border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all ${darkMode ? 'bg-[#262a31] text-white' : 'bg-surface-container-low text-slate-900'}`} type="text" value="Thorne"/>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className={`text-[10px] uppercase font-black tracking-widest px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</label>
                <input className={`w-full border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all ${darkMode ? 'bg-[#262a31] text-white' : 'bg-surface-container-low text-slate-900'}`} type="email" value="julian.thorne@financehub.io"/>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className={`text-[10px] uppercase font-black tracking-widest px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Bio</label>
                <textarea className={`w-full border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all resize-none ${darkMode ? 'bg-[#262a31] text-white' : 'bg-surface-container-low text-slate-900'}`} rows="3">
Financial Analyst specializing in multi-currency reporting and budget optimization.
                </textarea>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-[#1c2026]' : 'bg-white'} border ${darkMode ? 'border-slate-800' : 'border-slate-100'} shadow-lg`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-xl">tune</span>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Preferences</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Currency</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Default ledger view</p>
                  </div>
                  <select className={`border-none rounded-xl text-sm font-bold py-2.5 px-4 ${darkMode ? 'bg-[#262a31] text-white' : 'bg-surface-container-low'}`}>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Language</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>System labels</p>
                  </div>
                  <select className={`border-none rounded-xl text-sm font-bold py-2.5 px-4 ${darkMode ? 'bg-[#262a31] text-white' : 'bg-surface-container-low'}`}>
                    <option>English (US)</option>
                    <option>Deutsch</option>
                    <option>Français</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Theme</p>
                    <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Switch themes</p>
                  </div>
                  <div className={`p-1 rounded-full flex ${darkMode ? 'bg-[#262a31]' : 'bg-slate-100'}`}>
                    <button 
                      onClick={() => darkMode && toggleDarkMode()}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${!darkMode ? 'bg-white shadow-lg' : ''}`}
                    >
                      <span className="material-symbols-outlined text-lg">light_mode</span>
                    </button>
                    <button 
                      onClick={() => !darkMode && toggleDarkMode()}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-slate-600 text-white shadow-lg' : ''}`}
                    >
                      <span className="material-symbols-outlined text-lg">dark_mode</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 ${darkMode ? 'bg-[#1c2026]' : 'bg-white'} border ${darkMode ? 'border-slate-800' : 'border-slate-100'} shadow-lg`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">shield_lock</span>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Security</h3>
              </div>
              <div className="space-y-4">
                <button className={`w-full flex items-center justify-between p-4 rounded-xl group hover:ring-2 hover:ring-primary/30 transition-all ${darkMode ? 'bg-[#262a31]' : 'bg-surface-container-low'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>key</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Update Password</span>
                  </div>
                  <span className={`material-symbols-outlined ${darkMode ? 'text-slate-400' : 'text-slate-500'} group-hover:translate-x-1 transition-transform`}>chevron_right</span>
                </button>
                <div className={`p-4 rounded-xl border-l-4 border-orange-500 ${darkMode ? 'bg-[#262a31]' : 'bg-surface-container-low'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>2FA Authentication</span>
                    <div className="w-12 h-6 bg-orange-500 rounded-full relative flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow"></div>
                    </div>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Extra layer of security</p>
                </div>
                <button className={`w-full flex items-center justify-between p-4 rounded-xl group hover:ring-2 hover:ring-red-500/30 transition-all ${darkMode ? 'bg-[#262a31]' : 'bg-surface-container-low'}`}>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">logout</span>
                    <span className="text-sm font-bold text-red-500">Sign Out All Devices</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className={`rounded-2xl p-6 relative overflow-hidden shadow-xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-primary to-primary-container'}`}>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Administrator</div>
              <span className="material-symbols-outlined text-white/50">verified_user</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Admin Dashboard</h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-blue-200' : 'text-primary-container'}`}>Full control over FinanceHub.</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <span className="text-xs">Manage team members</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <span className="text-xs">Configure settings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                <span className="text-xs">View audit logs</span>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-blue-700 font-black rounded-xl hover:bg-blue-50 transition-all shadow-lg">
              ENTER ADMIN HUB
            </button>
          </div>

          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-[#1c2026]' : 'bg-white'} border ${darkMode ? 'border-slate-800' : 'border-slate-100'} shadow-lg`}>
            <h4 className={`text-sm font-black uppercase tracking-widest mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Team Members</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img alt="Member" className="w-10 h-10 rounded-xl object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"/>
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Sarah Wilson</p>
                    <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Financial Analyst</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${darkMode ? 'bg-slate-700 text-blue-400' : 'bg-slate-100 text-primary'}`}>VIEW</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img alt="Member" className="w-10 h-10 rounded-xl object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"/>
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : ''}`}>Michael Chen</p>
                    <p className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Tax Strategist</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${darkMode ? 'bg-slate-700 text-blue-400' : 'bg-slate-100 text-primary'}`}>VIEW</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-surface-container-low'}`}>
                    <span className={`material-symbols-outlined ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>add</span>
                  </div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>Add Member</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-700/50">
        <button className={`px-6 py-3 rounded-xl font-bold transition-all ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
          Discard
        </button>
        <button className={`px-8 py-3 rounded-xl font-black shadow-lg transition-all active:scale-95 ${
          darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-primary text-white hover:opacity-90'
        }`}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

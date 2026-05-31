import { Home, BarChart2, Plus, ArrowLeftRight, User, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation({ currentView, setCurrentView, onAddClick, theme, toggleTheme }) {
  // 5 slots: index 2 is the FAB.
  const tabs = [
    { id: 'dashboard', icon: Home },
    { id: 'expenses', icon: BarChart2 },
    { id: 'add', isFab: true },
    { id: 'settlement', icon: ArrowLeftRight },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:static md:w-24 md:h-screen md:p-6 md:flex md:flex-col md:items-center md:z-auto shrink-0">
      <div className="glass-panel mx-auto max-w-md w-full rounded-[32px] md:max-w-none md:rounded-3xl md:h-full md:flex-col flex justify-between items-center px-4 py-3 md:py-8 relative">
        
        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex mb-auto">
           <button onClick={toggleTheme} className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
           </button>
        </div>

        <div className="flex md:flex-col justify-between items-center w-full md:flex-1 md:justify-center md:gap-8">
          {tabs.map((tab, idx) => {
            if (tab.isFab) {
              return (
                <div key="fab-spacer" className="w-14 relative flex justify-center md:w-full md:h-14 md:my-2">
                  <button
                    onClick={onAddClick}
                    className="absolute -top-10 md:static flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-purple)] text-white shadow-[0_4px_20px_rgba(176,48,255,0.5)] hover:scale-105 transition-transform"
                  >
                    <Plus className="w-7 h-7" />
                  </button>
                </div>
              );
            }

            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`relative flex-1 md:flex-none flex flex-col items-center justify-center p-2 transition-colors ${
                  isActive ? 'text-[var(--accent-purple)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className="w-6 h-6 relative z-10" />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 md:bottom-auto md:-right-2 md:w-1 md:h-6 w-1 h-1 bg-[var(--accent-purple)] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

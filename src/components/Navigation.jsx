import { Home, BarChart2, Plus, ArrowLeftRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation({ currentView, setCurrentView, onAddClick }) {
  // 5 slots: index 2 is the FAB.
  const tabs = [
    { id: 'dashboard', icon: Home },
    { id: 'expenses', icon: BarChart2 },
    { id: 'add', isFab: true },
    { id: 'settlement', icon: ArrowLeftRight },
    { id: 'profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
      <div className="glass-panel mx-auto max-w-md rounded-[32px] flex justify-between items-center px-4 py-3 relative">
        {tabs.map((tab, idx) => {
          if (tab.isFab) {
            return (
              <div key="fab-spacer" className="w-14 relative flex justify-center">
                <button
                  onClick={onAddClick}
                  className="absolute -top-10 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-purple)] text-white shadow-[0_4px_20px_rgba(176,48,255,0.5)] hover:scale-105 transition-transform"
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
              className={`relative flex-1 flex flex-col items-center justify-center p-2 transition-colors ${
                isActive ? 'text-[var(--accent-purple)]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-6 h-6 relative z-10" />
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 w-1 h-1 bg-[var(--accent-purple)] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

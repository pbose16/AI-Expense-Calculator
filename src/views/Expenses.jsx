import { useState } from 'react';
import { Plus, Coffee, Car, Home, ShoppingBag, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseForm from '../components/ExpenseForm';

const CATEGORY_ICONS = {
  Food: Coffee,
  Transport: Car,
  Accommodation: Home,
  Shopping: ShoppingBag,
  Activities: Map
};

const CATEGORY_COLORS = {
  Food: 'text-amber-400 bg-amber-400/10',
  Transport: 'text-blue-400 bg-blue-400/10',
  Accommodation: 'text-purple-400 bg-purple-400/10',
  Shopping: 'text-pink-400 bg-pink-400/10',
  Activities: 'text-emerald-400 bg-emerald-400/10'
};

export default function Expenses({ data, updateData, onAddClick }) {

  const getParticipantName = (id) => {
    const p = data.participants.find(p => p.id === id);
    return p ? p.name : 'Unknown';
  };

  return (
    <div className="pb-24 relative min-h-screen">
      <div className="pt-8 px-6 pb-4 flex justify-between items-center sticky top-0 bg-[var(--app-bg)]/80 backdrop-blur-md z-20">
        <div>
          <h2 className="text-3xl font-bold text-white">Expenses</h2>
          <p className="text-slate-400 text-sm mt-1">{data.expenses.length} transactions</p>
        </div>
        <button 
          onClick={onAddClick}
          className="p-2 rounded-full glass-panel hover:bg-white/10 transition text-[var(--accent-purple)]"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="px-6 mt-4 space-y-4">
        {data.expenses.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-slate-400" />
            </div>
            <p>No expenses logged yet.</p>
            <p className="text-sm mt-1">Tap the + button to add one!</p>
          </div>
        ) : (
          [...data.expenses].reverse().map((exp, idx) => {
            const Icon = CATEGORY_ICONS[exp.category] || Coffee;
            const colorClass = CATEGORY_COLORS[exp.category] || 'text-slate-400 bg-slate-400/10';
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={exp.id}
                className="glass-panel p-4 rounded-2xl flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{exp.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Paid by <span className="text-slate-300">{getParticipantName(exp.payerId)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {data.metadata.currency} {parseFloat(exp.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    For {exp.participantIds.length} ppl
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}

// Just importing Receipt for the empty state
import { Receipt } from 'lucide-react';

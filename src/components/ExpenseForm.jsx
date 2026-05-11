import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Food', 'Transport', 'Accommodation', 'Shopping', 'Activities'];

export default function ExpenseForm({ onClose, data, updateData }) {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Food');
  const [payerId, setPayerId] = useState(data.participants.length > 0 ? data.participants[0].id : '');
  const [participantIds, setParticipantIds] = useState(data.participants.map(p => p.id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !title || !payerId || participantIds.length === 0) return;

    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      title,
      category,
      payerId,
      participantIds,
      timestamp: new Date().toISOString()
    };

    updateData({
      ...data,
      expenses: [...data.expenses, newExpense]
    });
    onClose();
  };

  const toggleParticipant = (id) => {
    if (participantIds.includes(id)) {
      setParticipantIds(participantIds.filter(pId => pId !== id));
    } else {
      setParticipantIds([...participantIds, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex flex-col bg-[var(--app-bg)] sm:p-4"
    >
      <div className="flex-1 glass-panel sm:rounded-3xl overflow-y-auto w-full max-w-lg mx-auto flex flex-col">
        <div className="sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/5 z-10">
          <h2 className="text-xl font-bold text-white">Add Expense</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Amount Input */}
          <div className="text-center pb-4">
            <div className="text-slate-400 mb-2">How much did it cost?</div>
            <div className="flex items-center justify-center text-5xl font-bold text-white">
              <span className="text-3xl text-[var(--neon-blue)] mr-2">{data.metadata.currency}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-none outline-none w-48 text-center placeholder-slate-700 focus:ring-0"
                placeholder="0.00"
                step="0.01"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">What was it for?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] outline-none"
              placeholder="e.g. Dinner at Mario's"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    category === cat 
                    ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white shadow-lg shadow-[var(--neon-blue)]/20' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payer */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Who paid?</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-[var(--neon-blue)] outline-none appearance-none"
              required
            >
              {data.participants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Split among */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-400">Split among</label>
              <button 
                type="button" 
                onClick={() => setParticipantIds(data.participants.map(p => p.id))}
                className="text-xs text-[var(--neon-blue)] hover:text-white transition"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.participants.map(p => {
                const isSelected = participantIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleParticipant(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                      isSelected 
                      ? 'border-[var(--neon-blue)] bg-[var(--neon-blue)]/10 text-white' 
                      : 'border-slate-700 bg-transparent text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'border-[var(--neon-blue)] bg-[var(--neon-blue)]' : 'border-slate-500'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-[var(--app-bg)] font-bold" />}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
            {participantIds.length === 0 && (
              <p className="text-xs text-rose-400 mt-2">Must select at least one person.</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4 pb-8">
            <button
              type="submit"
              disabled={!amount || !title || participantIds.length === 0 || !payerId}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white shadow-lg shadow-[var(--neon-purple)]/30 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

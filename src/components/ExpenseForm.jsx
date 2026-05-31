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
      className="fixed inset-0 z-[60] flex flex-col bg-[var(--app-bg)] sm:p-4"
    >
      <div className="flex-1 glass-panel sm:rounded-3xl overflow-y-auto w-full max-w-lg mx-auto flex flex-col">
        <div className="sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-[var(--glass-border)] z-10">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Add Expense</h2>
          <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Amount Input */}
          <div className="text-center pb-4">
            <div className="text-[var(--text-muted)] mb-2">How much did it cost?</div>
            <div className="flex items-center justify-center text-5xl font-bold text-[var(--text-main)]">
              <span className="text-3xl text-[var(--accent-blue)] mr-2">{data.metadata.currency}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent border-none outline-none w-48 text-center placeholder-slate-400 dark:placeholder-slate-700 focus:ring-0"
                placeholder="0.00"
                step="0.01"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">What was it for?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--panel-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:border-[var(--accent-purple)] focus:ring-1 focus:ring-[var(--accent-purple)] outline-none"
              placeholder="e.g. Dinner at Mario's"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    category === cat 
                    ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white shadow-lg shadow-[var(--accent-blue)]/20' 
                    : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payer */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Who paid?</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="w-full bg-[var(--panel-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:border-[var(--accent-blue)] outline-none appearance-none"
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
              <label className="text-sm font-medium text-[var(--text-muted)]">Split among</label>
              <button 
                type="button" 
                onClick={() => setParticipantIds(data.participants.map(p => p.id))}
                className="text-xs text-[var(--accent-blue)] hover:text-[var(--text-main)] transition"
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
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--text-main)]' 
                      : 'border-[var(--glass-border)] bg-transparent text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]' : 'border-[var(--glass-border)]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white font-bold" />}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
            {participantIds.length === 0 && (
              <p className="text-xs text-rose-500 mt-2">Must select at least one person.</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="pt-4 pb-8">
            <button
              type="submit"
              disabled={!amount || !title || participantIds.length === 0 || !payerId}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white shadow-lg shadow-[var(--accent-purple)]/30 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

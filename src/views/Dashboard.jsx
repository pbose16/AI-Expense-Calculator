import { useState } from 'react';
import { ArrowLeft, UserPlus, UserMinus, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'
];

export default function Dashboard({ data, updateData, onBack }) {
  const [newParticipant, setNewParticipant] = useState('');

  const addParticipant = (e) => {
    e.preventDefault();
    if (!newParticipant.trim()) return;
    
    const color = AVATAR_COLORS[data.participants.length % AVATAR_COLORS.length];
    
    updateData({
      ...data,
      participants: [
        ...data.participants,
        { id: uuidv4(), name: newParticipant.trim(), color }
      ]
    });
    setNewParticipant('');
  };

  const removeParticipant = (id) => {
    updateData({
      ...data,
      participants: data.participants.filter(p => p.id !== id)
    });
  };

  const totalSpent = data.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="pt-8 pb-6 px-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={onBack}
            className="p-2 rounded-full glass-panel hover:bg-white/10 transition text-slate-300 hover:text-white flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex-1 truncate">
            {data.metadata.title}
          </h1>
          <button className="p-2 rounded-full glass-panel hover:bg-white/10 transition flex-shrink-0">
            <Edit3 className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        
        {/* Circular Total Spent Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center items-center py-6"
        >
          <div 
            className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center border-[6px] border-transparent shadow-[0_0_40px_rgba(176,48,255,0.15)]" 
            style={{ 
              background: 'linear-gradient(var(--app-bg), var(--app-bg)) padding-box, linear-gradient(135deg, var(--accent-blue), var(--accent-purple), var(--accent-green)) border-box' 
            }}
          >
            <div className="text-3xl font-bold text-white mb-1">
              {data.metadata.currency} {totalSpent.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <div className="text-xs text-slate-400">Total Trip Expenses</div>
          </div>
        </motion.div>
      </div>

      {/* Participants Manager */}
      <div className="px-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-200">Trip Crew</h3>
        
        <form onSubmit={addParticipant} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Add new member..."
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[var(--neon-blue)] focus:ring-1 focus:ring-[var(--neon-blue)] transition-all"
          />
          <button 
            type="submit"
            disabled={!newParticipant.trim()}
            className="bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white p-3 rounded-xl font-medium shadow-lg shadow-[var(--neon-blue)]/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {data.participants.map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                className="glass-panel p-3 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${participant.color} flex items-center justify-center text-white font-bold text-lg shadow-inner`}>
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-200">{participant.name}</span>
                </div>
                <button 
                  onClick={() => removeParticipant(participant.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {data.participants.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-xl">
              No one's on this trip yet. Add some friends!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

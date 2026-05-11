import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSettlement } from '../utils/calculateSettlement';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const COLORS = ['#00f3ff', '#9d00ff', '#ff00ea', '#10b981', '#f59e0b'];

export default function Settlement({ data, updateData }) {
  const [viewMode, setViewMode] = useState('simple'); // 'simple' or 'detailed'

  const settlement = useMemo(() => calculateSettlement(data.expenses, data.participants), [data]);

  const getParticipantName = (id) => {
    const p = data.participants.find(p => p.id === id);
    return p ? p.name : 'Unknown';
  };

  const getParticipantColor = (id) => {
    const p = data.participants.find(p => p.id === id);
    return p ? p.color : 'bg-slate-500';
  };

  const categoryData = useMemo(() => {
    const totals = {};
    data.expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + parseFloat(exp.amount);
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [data.expenses]);

  const participantSpendingData = useMemo(() => {
    const totals = {};
    data.participants.forEach(p => totals[p.id] = 0);
    data.expenses.forEach(exp => {
      totals[exp.payerId] = (totals[exp.payerId] || 0) + parseFloat(exp.amount);
    });
    return data.participants.map(p => ({ 
      name: p.name, 
      amount: totals[p.id]
    })).sort((a, b) => b.amount - a.amount);
  }, [data.expenses, data.participants]);

  const markAsPaid = (transaction) => {
    // To 'mark as paid', we add an expense representing a reimbursement
    const reimbursement = {
      id: Date.now().toString(),
      amount: transaction.amount,
      title: 'Reimbursement',
      category: 'Activities', // or a new category 'Settlement'
      payerId: transaction.from,
      participantIds: [transaction.to],
      timestamp: new Date().toISOString()
    };
    
    updateData({
      ...data,
      expenses: [...data.expenses, reimbursement]
    });
  };

  return (
    <div className="pb-24">
      <div className="pt-8 px-6 pb-4">
        <h2 className="text-3xl font-bold text-white mb-6">Settlement</h2>
        
        {/* Toggle View */}
        <div className="flex p-1 bg-slate-800/50 rounded-xl mb-6 backdrop-blur-md">
          <button
            onClick={() => setViewMode('simple')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'simple' 
                ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Action
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'detailed' 
                ? 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analytics
          </button>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'simple' ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {settlement.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto mb-4 bg-emerald-400/10">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">All Settled Up!</h3>
                  <p>No one owes anything.</p>
                </div>
              ) : (
                settlement.map((trans, idx) => (
                  <motion.div
                    key={`${trans.from}-${trans.to}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel p-5 rounded-2xl relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${getParticipantColor(trans.from)} flex items-center justify-center text-white font-bold`}>
                          {getParticipantName(trans.from).charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Pays</p>
                          <p className="font-semibold text-white">{getParticipantName(trans.from)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <ArrowRight className="w-5 h-5 text-[var(--neon-blue)] mb-1" />
                        <div className="font-bold text-xl text-[var(--neon-blue)]">
                          {data.metadata.currency} {trans.amount.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-slate-400">To</p>
                          <p className="font-semibold text-white">{getParticipantName(trans.to)}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full ${getParticipantColor(trans.to)} flex items-center justify-center text-white font-bold`}>
                          {getParticipantName(trans.to).charAt(0)}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => markAsPaid(trans)}
                      className="w-full py-3 mt-2 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark as Paid
                    </button>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detailed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {data.expenses.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  Not enough data for analytics yet.
                </div>
              ) : (
                <>
                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${data.metadata.currency} ${value.toFixed(2)}`, 'Amount']}
                            contentStyle={{ backgroundColor: 'var(--app-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3 mt-4 px-2">
                      {categoryData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="text-slate-300">{entry.name}</span>
                          </div>
                          <span className="font-bold text-white">
                            {data.metadata.currency} {entry.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Total Paid by Member</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={participantSpendingData} layout="vertical" margin={{ left: 10, right: 30 }}>
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            width={80}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: 'var(--app-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`${data.metadata.currency} ${value.toFixed(2)}`, 'Paid']}
                          />
                          <Bar 
                            dataKey="amount" 
                            radius={[0, 8, 8, 0]} 
                            barSize={32}
                          >
                            {participantSpendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Plus, Trash2, ArrowRight, ChevronDown, Briefcase, Palmtree, Building, Mountain, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTripData } from '../utils/storageHelper';

const ICONS = [Briefcase, Palmtree, Building, Mountain, Map];
const THUMBNAILS = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=200&q=80', // Paris
  'https://images.unsplash.com/photo-1512343805470-3882a884f18d?auto=format&fit=crop&w=200&q=80', // Beach
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=200&q=80', // City
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80', // Mountains
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=80', // Generic Travel
];
const BORDER_COLORS = ['border-l-[#b030ff]', 'border-l-[#00ff88]', 'border-l-[#00e0ff]', 'border-l-[#f59e0b]', 'border-l-[#ff00ea]'];

export default function TripList({ trips, onSelectTrip, onCreateTrip, onDeleteTrip }) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCurrency, setNewCurrency] = useState('₹');

  const handleCreate = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onCreateTrip(newTitle.trim(), newCurrency);
      setNewTitle('');
      setShowNewForm(false);
    }
  };

  const tripsWithData = useMemo(() => {
    return trips.map((trip, idx) => {
      const fullData = getTripData(trip.id);
      const expenseCount = fullData?.expenses?.length || 0;
      const totalAmount = fullData?.expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0;
      return {
        ...trip,
        expenseCount,
        totalAmount,
        iconIdx: idx % ICONS.length
      };
    });
  }, [trips]);

  return (
    <div className="pb-24 md:pb-6 min-h-screen bg-[var(--app-bg)]">
      {/* Banner Section */}
      <div className="relative w-full h-80 rounded-b-[40px] overflow-hidden mb-6 shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80')" }}
        ></div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/80 to-[var(--app-bg)]/30"></div>
        
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <h1 className="text-3xl font-bold text-white leading-tight mb-2">
            Track expenses.<br/>
            <span className="text-[var(--accent-purple)]">Enjoy every trip.</span>
          </h1>
          <p className="text-slate-200 text-sm mb-6 max-w-[200px] drop-shadow-md">
            Add your trips and keep your expenses organized.
          </p>
          <button 
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--accent-purple)] to-[#7e22ce] text-white px-5 py-3 rounded-xl font-medium w-max shadow-lg shadow-[var(--accent-purple)]/30 hover:scale-105 transition-transform"
          >
            <div className="bg-white rounded-full p-1 text-[var(--accent-purple)]">
              <Plus className="w-4 h-4" strokeWidth={3} />
            </div>
            Add Trip
          </button>
        </div>
      </div>

      <div className="px-6">
        <AnimatePresence>
          {showNewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <form onSubmit={handleCreate} className="glass-panel p-5 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">New Trip</h3>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Trip Name (e.g. Paris Getaway)"
                  className="w-full bg-[var(--panel-bg)]/80 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] mb-3 focus:outline-none focus:border-[var(--accent-purple)]"
                  autoFocus
                />
                <div className="flex gap-3 mb-4">
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    className="bg-[var(--panel-bg)]/80 border border-[var(--glass-border)] rounded-xl px-4 py-3 text-[var(--text-main)] focus:outline-none appearance-none flex-1"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="₹">INR (₹)</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 py-3 rounded-xl bg-black/5 dark:bg-white/5 text-[var(--text-muted)] font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTitle.trim()}
                    className="flex-1 py-3 rounded-xl bg-[var(--accent-purple)] text-white font-medium disabled:opacity-50 hover:bg-[#9325d9] transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Your Trips</h2>
          <button className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            Recent <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tripsWithData.length === 0 && !showNewForm ? (
            <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
              <p>No trips found.</p>
              <p className="text-sm mt-1">Tap the Add Trip button to create one!</p>
            </div>
          ) : (
            <AnimatePresence>
              {tripsWithData.map((trip) => {
                const TripIcon = ICONS[trip.iconIdx];
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-[var(--panel-bg)] rounded-2xl flex items-center p-3 group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-l-4 ${BORDER_COLORS[trip.iconIdx]} shadow-sm`}
                    onClick={() => onSelectTrip(trip.id)}
                  >
                    <div 
                      className="w-20 h-14 rounded-lg bg-cover bg-center mr-4 flex-shrink-0"
                      style={{ backgroundImage: `url('${THUMBNAILS[trip.iconIdx]}')` }}
                    />
                    
                    <div className="w-10 h-10 rounded-full bg-[var(--app-bg)] flex items-center justify-center text-[var(--accent-purple)] mr-3 flex-shrink-0">
                      <TripIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-[var(--text-main)] truncate">{trip.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] truncate text-opacity-80">
                        {trip.startDate}
                      </p>
                    </div>

                    <div className="text-right ml-2 mr-2">
                      <div className="text-sm font-bold text-[var(--text-main)]">
                        {trip.currency}{trip.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {trip.expenseCount} expenses
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2">
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this trip?')) {
                            onDeleteTrip(trip.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

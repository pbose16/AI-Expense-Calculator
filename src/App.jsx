import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { getAllTrips, getTripData, setTripData, createTrip, deleteTrip, migrateOldData } from './utils/storageHelper';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import Expenses from './views/Expenses';
import Settlement from './views/Settlement';
import Profile from './views/Profile';
import TripList from './views/TripList';
import ExpenseForm from './components/ExpenseForm';

function App() {
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [data, setData] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Migrate old single trip data if it exists
    migrateOldData();
    
    // Simulate loading for the "vibe"
    setTimeout(() => {
      setTrips(getAllTrips());
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSelectTrip = (id) => {
    const tripData = getTripData(id);
    if (tripData) {
      setData(tripData);
      setActiveTripId(id);
      setCurrentView('dashboard');
    }
  };

  const handleCreateTrip = (title, currency) => {
    createTrip(title, currency);
    setTrips(getAllTrips());
  };

  const handleDeleteTrip = (id) => {
    deleteTrip(id);
    setTrips(getAllTrips());
  };

  const handleBackToList = () => {
    setActiveTripId(null);
    setData(null);
    setTrips(getAllTrips()); // Refresh in case metadata updated
  };

  const updateData = (newData) => {
    setData(newData);
    setTripData(activeTripId, newData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--neon-blue)] to-[var(--neon-purple)] shadow-[0_0_30px_rgba(157,0,255,0.5)]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-main)] font-sans selection:bg-[var(--accent-purple)] selection:text-white mx-auto relative shadow-2xl overflow-x-hidden md:flex md:max-w-[1400px]">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-blue)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent-purple)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      </div>

      <AnimatePresence mode="wait">
        {!activeTripId ? (
          <motion.div
            key="trip-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <TripList 
              trips={trips} 
              onSelectTrip={handleSelectTrip} 
              onCreateTrip={handleCreateTrip}
              onDeleteTrip={handleDeleteTrip}
            />
          </motion.div>
        ) : (
          <motion.div
            key="trip-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col md:flex-row flex-1 w-full"
          >
            <Navigation 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              onAddClick={() => setShowExpenseForm(true)}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto">
              {currentView === 'dashboard' && <Dashboard data={data} updateData={updateData} onBack={handleBackToList} />}
              {currentView === 'expenses' && <Expenses data={data} updateData={updateData} onAddClick={() => setShowExpenseForm(true)} />}
              {currentView === 'settlement' && <Settlement data={data} updateData={updateData} />}
              {currentView === 'profile' && <Profile />}
            </div>
            
            <AnimatePresence>
              {showExpenseForm && (
                <ExpenseForm 
                  onClose={() => setShowExpenseForm(false)} 
                  data={data} 
                  updateData={updateData} 
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

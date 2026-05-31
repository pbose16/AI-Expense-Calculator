import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <div className="pb-24 md:pb-6 pt-8 px-6 min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(176,48,255,0.3)] border border-[var(--accent-purple)]/30 relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-transparent to-transparent z-10 pointer-events-none opacity-80" />
        <img 
          src="/profile_construction.png" 
          alt="Profile Under Construction" 
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-purple)]/20 border border-[var(--accent-purple)]/50 text-[var(--accent-purple)] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-purple)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-purple)]"></span>
              </span>
              In Development
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              We're hard at work bringing the Profile features to life! Check back soon.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

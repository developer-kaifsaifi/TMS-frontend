// components/Navbar.jsx

import { motion } from "motion/react";

const Navbar = ({ businessName, onLogout }) => {
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
            D
          </div>

          <div>
            <h1 className="text-white font-semibold text-lg tracking-wide">
              DigiFlow
            </h1>
            <p className="text-xs text-slate-400">
              Smart Queue Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm text-slate-400">Business</p>
            <p className="text-white font-medium">{businessName}</p>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 border border-white/10 text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
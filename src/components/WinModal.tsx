import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WinModalProps {
  isOpen: boolean;
  title: string;
  amount: number;
  icon: string;
  score: number;
  onReset: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  title,
  amount,
  icon,
  score,
  onReset,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6"
        >
          <motion.div
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white p-12 rounded-[4rem] text-center shadow-2xl max-w-sm w-full border-t-8 border-amber-400"
          >
            <div className="text-8xl mb-6">{icon}</div>
            <h3 className="text-4xl font-black text-slate-900 mb-2 italic uppercase">{title}</h3>
            <p className="text-slate-500 mb-8 font-medium">Final Score: {score}</p>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, type: "tween" }}
              className="mb-10 p-6 bg-amber-50 rounded-[2rem] border-2 border-amber-100"
            >
              <p className="text-xs uppercase font-black text-amber-500 mb-1">Coins Earned</p>
              <p className="text-5xl font-black text-amber-700">{amount.toLocaleString()}</p>
            </motion.div>

            <button
              onClick={onReset}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-5 px-6 rounded-2xl shadow-xl uppercase italic text-lg transition-transform active:scale-95"
            >
              Play Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

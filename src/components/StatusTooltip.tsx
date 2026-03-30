import React from 'react';
import { motion } from 'motion/react';

interface StatusTooltipProps {
  title: string;
  desc: string;
  icon: string;
}

export const StatusTooltip: React.FC<StatusTooltipProps> = ({ title, desc, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2 rounded-lg text-[8px] w-32 z-50 pointer-events-none shadow-xl border border-slate-700"
  >
    <div className="flex items-center gap-1 mb-1">
      <span>{icon}</span>
      <span className="font-black uppercase tracking-tighter">{title}</span>
    </div>
    <p className="text-slate-400 font-medium leading-tight">{desc}</p>
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-slate-900" />
  </motion.div>
);

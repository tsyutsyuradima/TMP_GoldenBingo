import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossChatMessage } from '../types';
import { BOSS_CHAT_STYLES } from '../config/bossChatConfig';

interface BossChatProps {
  chatLog: BossChatMessage[];
}

const ChatEntry: React.FC<{ msg: BossChatMessage }> = ({ msg }) => {
  const style = BOSS_CHAT_STYLES[msg.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
      className={`flex items-start gap-2 px-3 py-2 rounded-xl border ${style.bg} ${style.border} mb-1.5`}
    >
      {msg.actionIcon && (
        <span className="text-base shrink-0 leading-tight mt-0.5">{msg.actionIcon}</span>
      )}
      {!msg.actionIcon && (
        <span className="text-base shrink-0 leading-tight mt-0.5">{style.defaultIcon}</span>
      )}
      <div className="flex flex-col min-w-0">
        <span className={`text-[9px] font-black uppercase tracking-widest leading-none mb-0.5 ${style.labelColor}`}>
          {style.senderLabel}
        </span>
        <span className={`text-xs font-medium leading-snug ${style.textClass}`}>{msg.text}</span>
      </div>
    </motion.div>
  );
};

export const BossChat: React.FC<BossChatProps> = ({ chatLog }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog.length]);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-700/40 bg-slate-800/60">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Binky's Log</span>
      </div>

      {/* Scrollable messages */}
      <div
        className="overflow-y-auto px-2 py-2"
        style={{
          height: 170,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(100,116,139,0.3) transparent',
        }}
      >
        <AnimatePresence initial={false}>
          {chatLog.map(msg => (
            <ChatEntry key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Flame } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ['Ctrl', 'N'], desc: 'Create a new note' },
    { keys: ['Ctrl', 'F'], desc: 'Focus the search input' },
    { keys: ['Ctrl', 'S'], desc: 'Simulate saving (always auto-saved)' },
    { keys: ['Ctrl', 'P'], desc: 'Toggle edit/preview/split mode' },
    { keys: ['Alt', 'D'], desc: 'Delete the active note' },
    { keys: ['Esc'], desc: 'Close dialog / blur editor' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md glass overflow-hidden rounded-2xl bg-card text-card-foreground premium-shadow border border-white/10 dark:border-white/5 p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold tracking-wide">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close shortcuts"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {shortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
                  <span className="text-sm text-muted-foreground font-medium">{s.desc}</span>
                  <div className="flex gap-1.5">
                    {s.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2 py-1 text-xs font-mono font-bold bg-muted/60 text-muted-foreground border border-border shadow-[0_2px_0_rgba(0,0,0,0.15)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)] rounded-md"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with a tiny easter egg/micro-interaction */}
            <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Pro keyboard user
              </span>
              <span>Press <kbd className="px-1.5 py-0.5 font-mono border rounded bg-muted">Esc</kbd> to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

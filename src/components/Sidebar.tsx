import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Note, Theme } from '../types';
import { 
  Search, Plus, Trash2, Edit, Keyboard, Sun, Moon, Sparkles, AlertCircle, FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenShortcuts: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  searchQuery,
  onSearchQueryChange,
  theme,
  onToggleTheme,
  onOpenShortcuts,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  // Focus search input handler via global shortcut (will hook in App)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId === id) {
      onDeleteNote(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
    }
  };

  useEffect(() => {
    if (deletingId) {
      const timer = setTimeout(() => setDeletingId(null), 3000); // Reset confirm state after 3s
      return () => clearTimeout(timer);
    }
  }, [deletingId]);

  return (
    <div className="w-full md:w-80 h-full flex flex-col border-r border-border/60 bg-background/40 backdrop-blur-md relative overflow-hidden">
      {/* Brand & Theme Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white font-black shadow-md premium-shadow">
            N
          </div>
          <span className="font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground flex items-center gap-1">
            Notes <Sparkles className="w-3.5 h-3.5 text-primary" />
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Shortcuts Icon */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Keyboard Shortcuts"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 relative overflow-hidden"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'light' ? (
                <motion.div
                  key="moon"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Sun className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Action Button & Search */}
      <div className="p-4 space-y-3 border-b border-border/50 bg-background/20">
        <motion.button
          onClick={onAddNote}
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 font-medium shadow-lg shadow-primary/20 dark:shadow-none transition-colors border border-primary/20"
        >
          <Plus className="w-4 h-4" />
          New Note
        </motion.button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/60 bg-muted/30 focus:bg-muted/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-sm transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 relative z-10 select-none">
        <AnimatePresence initial={false}>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              const isConfirmingDelete = deletingId === note.id;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelectNote(note.id)}
                  className={`group relative p-3.5 rounded-xl cursor-pointer flex flex-col gap-1.5 transition-all duration-300 border ${
                    isActive
                      ? 'bg-primary/5 border-primary/30 dark:bg-primary/10 dark:border-primary/20 premium-shadow'
                      : 'bg-transparent border-transparent hover:bg-muted/40 hover:border-border/30'
                  }`}
                >
                  {/* Left Highlight Strip on Active */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveStrip"
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-primary"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Title & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {note.title.trim() === '' ? 'Untitled Note' : note.title}
                    </h4>

                    {/* Delete Confirm/Trigger Button */}
                    <button
                      onClick={(e) => handleDeleteClick(e, note.id)}
                      className={`p-1.5 rounded-md flex items-center justify-center transition-all duration-200 ${
                        isConfirmingDelete
                          ? 'bg-destructive/10 text-destructive border border-destructive/20 scale-105'
                          : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-muted/80'
                      }`}
                      title={isConfirmingDelete ? 'Confirm deletion' : 'Delete note'}
                      aria-label="Delete note"
                    >
                      {isConfirmingDelete ? (
                        <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Brief Preview Content */}
                  <p className="text-xs text-muted-foreground/80 line-clamp-2 pr-4 break-words">
                    {note.content.trim() === '' ? (
                      <span className="italic text-muted-foreground/50">Empty note</span>
                    ) : (
                      note.content
                    )}
                  </p>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 mt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-muted-foreground/40" />
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            /* Empty Search/Notes State inside Sidebar */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-12 px-4"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Edit className="w-5 h-5 text-muted-foreground/60" />
              </div>
              <h5 className="text-sm font-medium text-foreground mb-1">
                {searchQuery ? 'No results found' : 'No notes yet'}
              </h5>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                {searchQuery ? 'Try another search keyword' : 'Create your first premium note to begin writing.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding Info */}
      <div className="p-3.5 border-t border-border/40 text-[11px] text-muted-foreground/50 flex items-center justify-between bg-background/10">
        <span>v1.0 (2026-Era)</span>
        <span>Premium Experience</span>
      </div>
    </div>
  );
};

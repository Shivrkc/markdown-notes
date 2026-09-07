import { useState, useEffect } from 'react';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { CustomCursor } from './components/CustomCursor';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Plus, FileText, LayoutGrid, Eye, Edit3, Keyboard
} from 'lucide-react';

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { theme, toggleTheme } = useTheme();

  // Selected note ID state
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcuts dialog state
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Responsive view mode state: 'sidebar' | 'edit' | 'preview' | 'split'
  // On desktop, it is split (Sidebar + Editor + Preview in split-screen/resizable columns or just Sidebar + Editor + Preview).
  // Let's implement full split editor + preview on desktop, and clean tabbed layout on mobile!
  const [viewMode, setViewMode] = useState<'sidebar' | 'edit' | 'preview' | 'split'>('split');

  // Sync activeNoteId with notes when notes load or are deleted
  useEffect(() => {
    if (notes.length > 0) {
      if (!activeNoteId || !notes.some(n => n.id === activeNoteId)) {
        setActiveNoteId(notes[0].id);
      }
    } else {
      setActiveNoteId(null);
    }
  }, [notes, activeNoteId]);

  // Screen size listener to set initial view modes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile
        if (viewMode === 'split') {
          setViewMode('sidebar');
        }
      } else {
        // Desktop / Tablet
        if (viewMode !== 'split') {
          setViewMode('split');
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Create Note: Ctrl + N
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const newId = addNote();
        setActiveNoteId(newId);
        if (window.innerWidth < 768) {
          setViewMode('edit');
        }
      }

      // Toggle Preview/Split Mode on Tablet/Mobile: Ctrl + P
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (window.innerWidth < 768) {
          setViewMode(prev => prev === 'edit' ? 'preview' : 'edit');
        }
      }

      // Delete active note: Alt + D
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (activeNoteId) {
          deleteNote(activeNoteId);
        }
      }

      // Open shortcuts modal: Ctrl + / or Alt + K
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNote, deleteNote, activeNoteId]);

  const handleSelectNoteFromSidebar = (id: string) => {
    setActiveNoteId(id);
    if (window.innerWidth < 768) {
      setViewMode('edit');
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative font-sans select-none antialiased text-foreground bg-transparent transition-colors duration-500">
      {/* Background decoration & Atmos */}
      <BackgroundAtmosphere />

      {/* Interactive premium custom cursor */}
      <CustomCursor />

      {/* Shortcuts Help Panel */}
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden w-full h-full">
        {/* Sidebar Component (Visible always on desktop/tablet, conditional on mobile) */}
        <div className={`h-full shrink-0 ${viewMode === 'sidebar' ? 'w-full' : 'hidden md:block'}`}>
          <Sidebar
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={handleSelectNoteFromSidebar}
            onAddNote={() => {
              const newId = addNote();
              setActiveNoteId(newId);
              if (window.innerWidth < 768) setViewMode('edit');
            }}
            onDeleteNote={(id) => {
              deleteNote(id);
              if (activeNoteId === id) setActiveNoteId(null);
            }}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
          />
        </div>

        {/* WORKSPACE AREA (Editor / Preview / Empty state) */}
        <div className={`flex-1 flex overflow-hidden h-full relative ${viewMode === 'sidebar' ? 'hidden md:flex' : 'flex'}`}>
          <AnimatePresence mode="wait">
            {activeNote ? (
              <motion.div
                key="workspace-active"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex-1 flex h-full overflow-hidden divide-x divide-border/40"
              >
                {/* Editor Column (Desktop: split. Mobile: based on tab selection) */}
                <div className={`h-full flex-1 overflow-hidden ${viewMode === 'preview' ? 'hidden' : 'block'}`}>
                  <Editor note={activeNote} onUpdateNote={updateNote} />
                </div>

                {/* Live Preview Column (Desktop: split. Mobile: based on tab selection) */}
                <div className={`h-full flex-1 overflow-hidden ${viewMode === 'edit' ? 'hidden' : 'block'}`}>
                  <Preview note={activeNote} />
                </div>
              </motion.div>
            ) : (
              /* Premium 3D-feeling Empty State when there are absolutely no active notes */
              <motion.div
                key="workspace-empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden select-none"
              >
                {/* Floating graphic element for depth */}
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute -top-[10%] w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none"
                    animate={{
                      y: [0, 15, -15, 0],
                      scale: [1, 1.05, 0.95, 1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                <div className="relative z-10 max-w-md flex flex-col items-center">
                  {/* Floating multi-layered cards */}
                  <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                    {/* Layer 1 - Deep back */}
                    <div className="absolute w-16 h-20 bg-primary/10 rounded-2xl border border-primary/20 rotate-[12deg] translate-x-4 translate-y-2 opacity-50 shadow-sm" />
                    {/* Layer 2 - Mid back */}
                    <div className="absolute w-16 h-20 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 -rotate-[8deg] -translate-x-4 opacity-75 shadow-sm" />
                    {/* Layer 3 - Main front */}
                    <div className="absolute w-18 h-22 bg-card border border-border rounded-2xl flex items-center justify-center shadow-xl premium-shadow">
                      <FileText className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
                    Create your first Premium Note
                  </h3>
                  <p className="text-sm text-muted-foreground/80 max-w-xs mb-8 leading-relaxed">
                    Write beautifully formatted markdown. Real-time rendering, fast local storage, stunning visual themes.
                  </p>

                  <motion.button
                    onClick={addNote}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    className="px-6 h-12 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:bg-primary/90 flex items-center gap-2.5 transition-colors border border-primary/10"
                  >
                    <Plus className="w-5 h-5" />
                    Start Writing Now
                  </motion.button>

                  <div className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground/50 border border-border/40 px-3 py-1.5 rounded-xl bg-background/5">
                    <Keyboard className="w-3.5 h-3.5" />
                    <span>Or use keyboard shortcut <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border">Ctrl+N</kbd></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION TAB BAR */}
      <div className="md:hidden h-14 shrink-0 bg-background/70 backdrop-blur-md border-t border-border/50 flex items-center justify-around px-4 relative z-20">
        <button
          onClick={() => setViewMode('sidebar')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            viewMode === 'sidebar' ? 'text-primary scale-105' : 'text-muted-foreground/80 hover:text-foreground'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Library</span>
        </button>

        <button
          onClick={() => {
            if (!activeNoteId && notes.length > 0) {
              setActiveNoteId(notes[0].id);
            }
            setViewMode('edit');
          }}
          disabled={notes.length === 0}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            notes.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
          } ${viewMode === 'edit' ? 'text-primary scale-105' : 'text-muted-foreground/80 hover:text-foreground'}`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Write</span>
        </button>

        <button
          onClick={() => {
            if (!activeNoteId && notes.length > 0) {
              setActiveNoteId(notes[0].id);
            }
            setViewMode('preview');
          }}
          disabled={notes.length === 0}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
            notes.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
          } ${viewMode === 'preview' ? 'text-primary scale-105' : 'text-muted-foreground/80 hover:text-foreground'}`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { 
  Bold, Italic, Code, Link, List, ListOrdered, Quote, Heading1, Heading2, Minus, CloudLightning, Check, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state with note prop (e.g. when user changes active note)
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setSaveStatus('saved');
  }, [note.id]);

  // Debounced auto-save effect
  useEffect(() => {
    if (title === note.title && content === note.content) {
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onUpdateNote(note.id, { title, content });
      setSaveStatus('saved');
    }, 400); // 400ms typing debounce

    return () => clearTimeout(timer);
  }, [title, content]);

  // Helper for inserting markdown text
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = before + selectedText + after;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + selectedText.length;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }, 0);
  };

  const toolbarActions = [
    { icon: Heading1, label: 'Heading 1', action: () => insertMarkdown('# ', '\n') },
    { icon: Heading2, label: 'Heading 2', action: () => insertMarkdown('## ', '\n') },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[', '](https://)') },
    { icon: List, label: 'Bullet List', action: () => insertMarkdown('- ', '\n') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertMarkdown('1. ', '\n') },
    { icon: Quote, label: 'Blockquote', action: () => insertMarkdown('> ', '\n') },
    { icon: Minus, label: 'Horizontal Rule', action: () => insertMarkdown('\n---\n') },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background/20 relative">
      {/* Editor Header / Toolbar */}
      <div className="h-14 border-b border-border/50 px-4 flex items-center justify-between bg-background/30 backdrop-blur-sm relative z-10">
        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pr-4">
          {toolbarActions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                title={item.label}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Real-time Save Status Badge */}
        <div className="flex items-center gap-2 select-none shrink-0">
          <AnimatePresence mode="wait">
            {saveStatus === 'saving' ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -5 }}
                className="flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20"
              >
                <CloudLightning className="w-3.5 h-3.5 animate-bounce text-primary" />
                <span>Saving...</span>
              </motion.div>
            ) : (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -5 }}
                className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden md:p-8 space-y-4">
        {/* Note Title Input */}
        <input
          type="text"
          placeholder="Untitled Note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-2xl md:text-3xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:ring-0 tracking-tight"
        />

        {/* Subtle Decorative Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-border/80 via-border/40 to-transparent" />

        {/* Markdown Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write some Markdown... Use # for headings, ** for bold, - for lists."
          className="flex-1 w-full bg-transparent border-none resize-none outline-none focus:ring-0 text-foreground/90 font-mono text-sm md:text-[15px] leading-relaxed placeholder:text-muted-foreground/30"
          style={{ tabSize: 2 }}
          onKeyDown={(e) => {
            // Support simple Tab-indent key
            if (e.key === 'Tab') {
              e.preventDefault();
              insertMarkdown('  ');
            }
          }}
        />
      </div>

      {/* Hint/Helper Overlay */}
      <div className="px-6 py-3 border-t border-border/40 text-xs text-muted-foreground/40 flex items-center justify-between bg-background/5 shrink-0 select-none">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary" /> Supports standard Markdown syntax.
        </span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
};

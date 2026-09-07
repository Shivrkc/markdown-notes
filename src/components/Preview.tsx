import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Note } from '../types';
import { FileText, Sparkles } from 'lucide-react';

interface PreviewProps {
  note: Note;
}

export const Preview: React.FC<PreviewProps> = ({ note }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-background/10 relative overflow-hidden">
      {/* Preview Header */}
      <div className="h-14 border-b border-border/50 px-6 flex items-center justify-between bg-background/30 backdrop-blur-sm relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold tracking-wide">Live Preview</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50 bg-muted/30 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-primary/70" />
          <span>Rendered HTML</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12 select-text">
        <div className="max-w-3xl mx-auto">
          {/* Note Title */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
            {note.title.trim() === '' ? 'Untitled Note' : note.title}
          </h1>

          {/* Title Underline Accent */}
          <div className="h-[1px] w-full bg-border/60 mb-8" />

          {/* Empty Content State */}
          {note.content.trim() === '' ? (
            <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground/40">
              <FileText className="w-12 h-12 stroke-[1] mb-3 animate-pulse" />
              <p className="text-sm italic">Nothing to preview yet. Start typing in the editor!</p>
            </div>
          ) : (
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline ? (
                      <div className="rounded-xl overflow-hidden my-6 border border-border/60 shadow-lg font-mono text-sm">
                        <div className="bg-muted px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 select-none">
                          <span className="font-semibold uppercase tracking-wider">{match[1]}</span>
                          <span>Code snippet</span>
                        </div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1rem', background: '#1e1e1e' }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code {...props} className="font-mono text-sm bg-muted/80 text-primary dark:text-primary-foreground/90 px-1.5 py-0.5 rounded border border-border/40">
                        {children}
                      </code>
                    );
                  },
                  // Style link tags
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-primary hover:underline underline-offset-4 cursor-pointer font-medium transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  // Style heading tags
                  h1: ({ node, ...props }) => <h1 {...props} className="text-3xl font-extrabold tracking-tight text-foreground mt-8 mb-4 border-b border-border/40 pb-2" />,
                  h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold tracking-tight text-foreground mt-6 mb-3" />,
                  h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-semibold tracking-tight text-foreground mt-5 mb-2" />,
                  p: ({ node, ...props }) => <p {...props} className="text-foreground/80 leading-relaxed my-4 text-[15px]" />,
                  // Style blockquotes
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 border-primary/40 pl-4 italic my-6 text-muted-foreground/90 bg-muted/10 py-1 rounded-r-lg"
                    />
                  ),
                  // List styles
                  ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-4 space-y-2 text-foreground/80" />,
                  ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 my-4 space-y-2 text-foreground/80" />,
                  li: ({ node, ...props }) => <li {...props} className="text-[15px]" />,
                  // HR styles
                  hr: ({ node, ...props }) => <hr {...props} className="my-8 border-border/80" />,
                  // Tables support
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6 rounded-xl border border-border/60">
                      <table {...props} className="w-full text-left border-collapse text-sm text-foreground/80" />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead {...props} className="bg-muted text-foreground border-b border-border/60 font-semibold" />,
                  tbody: ({ node, ...props }) => <tbody {...props} className="divide-y divide-border/40" />,
                  tr: ({ node, ...props }) => <tr {...props} className="hover:bg-muted/10 transition-colors" />,
                  th: ({ node, ...props }) => <th {...props} className="p-3 font-semibold" />,
                  td: ({ node, ...props }) => <td {...props} className="p-3" />,
                }}
              >
                {note.content}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};

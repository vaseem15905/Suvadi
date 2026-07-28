'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Code, Terminal, Zap, ChevronRight, Menu, Search, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DOCS_NAV = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '#introduction', active: true },
      { label: 'Quickstart', href: '#quickstart' },
      { label: 'Core Concepts', href: '#concepts' },
    ]
  },
  {
    title: 'Workspace Features',
    items: [
      { label: 'Live Notes', href: '#notes' },
      { label: 'Interactive Whiteboard', href: '#whiteboard' },
      { label: 'Q&A System', href: '#qa' },
      { label: 'Resource Sharing', href: '#resources' },
    ]
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Participant Management', href: '#participants' },
      { label: 'Real-time Sync', href: '#sync' },
      { label: 'Security & Privacy', href: '#security' },
    ]
  }
];

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = DOCS_NAV.flatMap(section => 
    section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(item => ({ ...item, section: section.title }))
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      
      {/* Sub-navbar for Docs */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand" />
            <span className="font-semibold text-foreground">Documentation</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search documentation..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="h-9 w-64 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
              <div className={cn("absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity", searchQuery ? "opacity-0" : "opacity-100")}>
                <kbd className="hidden sm:inline-block rounded border border-border bg-background-secondary px-1.5 font-mono text-[10px] font-medium text-foreground-muted">Ctrl</kbd>
                <kbd className="hidden sm:inline-block rounded border border-border bg-background-secondary px-1.5 font-mono text-[10px] font-medium text-foreground-muted">K</kbd>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-12 left-0 w-80 max-h-96 overflow-y-auto bg-surface border border-border rounded-xl shadow-xl z-50 p-2"
                  >
                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.map(result => (
                          <a 
                            key={result.href} 
                            href={result.href}
                            onClick={() => {
                              setSearchQuery('');
                              setIsSearchFocused(false);
                            }}
                            className="block p-3 rounded-lg hover:bg-background-secondary transition-colors"
                          >
                            <div className="text-sm font-medium text-foreground">{result.label}</div>
                            <div className="text-xs text-foreground-muted mt-0.5">{result.section}</div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-foreground-muted">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              className="md:hidden p-2 -mr-2 text-foreground-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col md:flex-row">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-border py-8 pr-6 overflow-y-auto sticky top-[120px] h-[calc(100vh-120px)]">
          <nav className="space-y-8">
            {DOCS_NAV.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-3">
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a 
                        href={item.href}
                        className={cn(
                          "block text-sm px-3 py-1.5 rounded-md transition-colors",
                          item.active 
                            ? "bg-brand/10 text-brand font-medium" 
                            : "text-foreground-muted hover:text-foreground hover:bg-surface"
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-40 bg-background pt-[120px] px-6 overflow-y-auto md:hidden"
            >
              <nav className="space-y-8 pb-12">
                {DOCS_NAV.map((section) => (
                  <div key={section.title}>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-3">
                      {section.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {section.items.map((item) => (
                        <li key={item.label}>
                          <a 
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "block text-sm px-3 py-2 rounded-md transition-colors",
                              item.active 
                                ? "bg-brand/10 text-brand font-medium" 
                                : "text-foreground-muted hover:text-foreground hover:bg-surface"
                            )}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 py-8 md:py-12 md:pl-10 max-w-4xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div id="introduction" className="pt-8 scroll-mt-20">
              <div className="flex items-center gap-2 text-sm text-foreground-subtle mb-4">
                <span>Docs</span>
                <ChevronRight className="h-4 w-4" />
                <span>Getting Started</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">Introduction</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Introduction to Suvadi</h1>
              <p className="text-xl text-foreground-muted mb-8 leading-relaxed">
                Suvadi is a real-time collaborative workspace platform designed specifically for workshops, classrooms, and knowledge-sharing sessions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 not-prose">
                {[
                  { title: 'Quickstart Guide', desc: 'Get your first session running in 5 minutes.', icon: Zap },
                  { title: 'Core Features', desc: 'Learn about Notes, Whiteboard, and Q&A.', icon: Layers },
                  { title: 'API Reference', desc: 'Integrate Suvadi into your own applications.', icon: Code },
                  { title: 'CLI Tools', desc: 'Manage workspaces directly from your terminal.', icon: Terminal },
                ].map((card) => (
                  <div key={card.title} className="p-5 rounded-xl border border-border bg-surface hover:border-brand/50 transition-colors cursor-pointer group">
                    <card.icon className="h-6 w-6 text-brand mb-3" />
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand transition-colors">{card.title}</h3>
                    <p className="text-sm text-foreground-muted">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-12 border-border" />

            <div id="quickstart" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Quickstart</h2>
              <p className="text-foreground-muted mb-4">
                Getting started with Suvadi is incredibly simple. You don't even need an account to join a session, but hosting one takes just a few clicks.
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-foreground-muted">
                <li><strong className="text-foreground">Sign Up or Log In:</strong> Create a free account to unlock hosting capabilities.</li>
                <li><strong className="text-foreground">Create a Workspace:</strong> From your dashboard, click "New Session" and give it a name.</li>
                <li><strong className="text-foreground">Share the Link:</strong> Copy the join link or QR code and share it with your participants.</li>
                <li><strong className="text-foreground">Collaborate:</strong> As soon as someone joins, they can see your notes, whiteboard, and resources in real-time.</li>
              </ol>
            </div>

            <hr className="my-12 border-border" />

            <div id="concepts" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Core Concepts</h2>
              <p className="text-foreground-muted mb-4">
                Suvadi operates on a few simple principles designed to maximize engagement and minimize friction during live sessions.
              </p>
              <h3 className="text-xl font-bold mt-8 mb-3 text-foreground">Workspaces, not Meetings</h3>
              <p className="text-foreground-muted mb-4">
                Unlike video conferencing tools, Suvadi focuses on the <em>artifacts</em> of collaboration. A workspace persists before, during, and after a session.
              </p>
              <h3 className="text-xl font-bold mt-8 mb-3 text-foreground">Real-time Everything</h3>
              <p className="text-foreground-muted mb-4">
                Powered by Supabase Realtime, every keystroke, whiteboard stroke, and upvoted question is instantly broadcasted to all connected clients. There is no "Save" button.
              </p>
            </div>

            <hr className="my-12 border-border" />

            <div id="notes" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Live Notes</h2>
              <p className="text-foreground-muted mb-4">
                The Live Notes feature is a collaborative rich-text editor where multiple people can type simultaneously. 
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground-muted">
                <li>Supports Markdown shortcuts for fast formatting.</li>
                <li>Code blocks with syntax highlighting.</li>
                <li>Presence indicators show who is currently editing.</li>
              </ul>
            </div>

            <hr className="my-12 border-border" />

            <div id="whiteboard" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Interactive Whiteboard</h2>
              <p className="text-foreground-muted mb-4">
                An infinite canvas for visual collaboration, brainstorming, and diagramming.
              </p>
              <p className="text-foreground-muted mb-4">
                Use the toolbar to select pens, shapes, sticky notes, and text tools. You can also drag and drop images directly onto the canvas. Every drawing action is synced instantly.
              </p>
            </div>

            <hr className="my-12 border-border" />

            <div id="qa" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Q&A System</h2>
              <p className="text-foreground-muted mb-4">
                Say goodbye to questions getting lost in a fast-moving chat window. Suvadi provides a dedicated Q&A panel.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground-muted">
                <li>Participants can ask questions anonymously or with their name.</li>
                <li>Other participants can <strong>upvote</strong> questions to bubble the most important ones to the top.</li>
                <li>Hosts can mark questions as "Answered" or "Pinned".</li>
              </ul>
            </div>

            <hr className="my-12 border-border" />

            <div id="resources" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Resource Sharing</h2>
              <p className="text-foreground-muted mb-4">
                Upload files, slides, code snippets, and links to the Resource Sharing tab so participants have everything they need in one place.
              </p>
              <p className="text-foreground-muted mb-4">
                Files are securely stored and served globally for fast downloads, and hosts can instantly push new resources to all participants during a live session.
              </p>
            </div>

            <hr className="my-12 border-border" />

            <div id="participants" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Participant Management</h2>
              <p className="text-foreground-muted mb-4">
                Hosts have full control over who is in the workspace.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground-muted">
                <li>View a live list of all currently connected participants.</li>
                <li>Mute capabilities (prevent specific users from asking questions or editing).</li>
                <li>Remove or ban disruptive participants from public sessions.</li>
              </ul>
            </div>

            <hr className="my-12 border-border" />

            <div id="sync" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Real-time Sync</h2>
              <p className="text-foreground-muted mb-4">
                To achieve sub-100ms latency, we utilize WebSocket connections across a globally distributed edge network.
              </p>
              <div className="my-6 rounded-lg border border-border bg-background-secondary p-4 overflow-x-auto not-prose">
                <pre className="text-sm font-mono text-foreground"><code>{`// Example: Subscribing to workspace events
const channel = supabase
  .channel('workspace:123')
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    console.log('Online participants:', state);
  })
  .subscribe();`}</code></pre>
              </div>
            </div>

            <hr className="my-12 border-border" />

            <div id="security" className="pt-8 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Security & Privacy</h2>
              <p className="text-foreground-muted mb-4">
                Security is foundational to Suvadi.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-foreground-muted">
                <li>All data is encrypted in transit and at rest.</li>
                <li>Row Level Security (RLS) policies ensure that only authorized participants can read or modify workspace data.</li>
                <li>Private sessions require strict authentication and invite-only access.</li>
              </ul>
            </div>

            <hr className="my-12 border-border" />
            
            <div className="flex items-center justify-between not-prose pb-12">
              <div className="text-sm text-foreground-muted">Last updated: Today</div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

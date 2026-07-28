'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, PlusCircle, Bell, Settings, LogOut, User, ChevronLeft, Menu, X,
  FileText, PenTool, FolderOpen, MessageCircleQuestion, Megaphone, Users, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { UserAvatar } from '@/components/shared/user-avatar';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard',  href: '/dashboard',          icon: LayoutDashboard },
  { label: 'My Sessions', href: '/sessions',           icon: CalendarDays },
  { label: 'New Session', href: '/sessions/new',       icon: PlusCircle },
];

const workspaceTabs = [
  { id: 'notes',         label: 'Notes',         icon: FileText },
  { id: 'whiteboard',    label: 'Whiteboard',    icon: PenTool },
  { id: 'resources',     label: 'Resources',     icon: FolderOpen },
  { id: 'questions',     label: 'Q&A',           icon: MessageCircleQuestion },
  { id: 'announcements', label: 'Announce',      icon: Megaphone },
  { id: 'participants',  label: 'People',        icon: Users },
  { id: 'spin',          label: 'Spin the Wheel', icon: Star },
];

const bottomItems = [
  { label: 'Profile',    href: '/profile',             icon: User },
  { label: 'Settings',  href: '/settings',             icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Determine if we are inside a session
  const sessionMatch = pathname.match(/^\/sessions\/([^/]+)$/);
  const isInSession = !!sessionMatch;
  const sessionId = sessionMatch ? sessionMatch[1] : null;
  const currentTab = searchParams.get('tab') || 'notes';

  // Notification Badges State
  const [unseen, setUnseen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!sessionId) return;
    const supabase = createClient();

    // Check localStorage for last seen timestamps
    const checkUnseen = async () => {
      const tabsToCheck = ['questions', 'announcements'];
      const newUnseen: Record<string, boolean> = {};

      for (const t of tabsToCheck) {
        if (currentTab === t) continue; // Currently viewing
        const lastSeen = localStorage.getItem(`last_seen_${sessionId}_${t}`);
        if (!lastSeen) continue;

        const { count } = await supabase
          .from(t === 'questions' ? 'questions' : 'announcements')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', sessionId)
          .gt('created_at', lastSeen);
        
        if (count && count > 0) newUnseen[t] = true;
      }
      setUnseen(newUnseen);
    };

    checkUnseen();

    // Listen for new inserts
    const channel = supabase.channel(`sidebar-notifications-${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'questions', filter: `session_id=eq.${sessionId}` }, () => {
        if (currentTab !== 'questions') setUnseen(prev => ({ ...prev, questions: true }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements', filter: `session_id=eq.${sessionId}` }, () => {
        if (currentTab !== 'announcements') setUnseen(prev => ({ ...prev, announcements: true }));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId, currentTab]);

  // Update last seen when changing tabs
  useEffect(() => {
    if (sessionId && currentTab) {
      localStorage.setItem(`last_seen_${sessionId}_${currentTab}`, new Date().toISOString());
      setUnseen(prev => ({ ...prev, [currentTab]: false }));
    }
  }, [sessionId, currentTab]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative hidden md:flex flex-col h-screen border-r border-border bg-surface overflow-hidden flex-shrink-0"
    >
      {/* Top */}
      <div className={cn('flex items-center justify-between h-16 px-4 border-b border-border', collapsed && 'justify-center px-0')}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Logo size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href) && !isInSession);
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-brand-muted text-brand'
                  : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary',
                collapsed && 'justify-center px-0 w-10 mx-auto'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className={cn('flex-shrink-0', active ? 'h-4.5 w-4.5' : 'h-4 w-4')} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {isInSession && (
          <div className="pt-4 mt-2 border-t border-border">
            <div className={cn("px-3 mb-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider", collapsed && "hidden")}>
              Session Workspace
            </div>
            <div className="space-y-1">
              {workspaceTabs.map(({ id, label, icon: Icon }) => {
                const href = `${pathname}?tab=${id}`;
                const active = currentTab === id;
                return (
                  <Link key={id} href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-brand-muted text-brand'
                        : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary',
                      collapsed && 'justify-center px-0 w-10 mx-auto'
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <div className="relative">
                      <Icon className={cn('flex-shrink-0', active ? 'h-4.5 w-4.5' : 'h-4 w-4')} />
                      {unseen[id] && !active && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
                        </span>
                      )}
                    </div>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex justify-between items-center">
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 border-t border-border space-y-1">
        {bottomItems.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              'text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-all duration-200',
              collapsed && 'justify-center px-0 w-10 mx-auto'
            )}
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{label}</motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
        <button onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
            'text-error hover:bg-error/10 transition-all duration-200',
            collapsed && 'justify-center px-0 w-10 mx-auto'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Logout</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

export function AppTopbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<{ id: string; name: string; avatar_url: string | null } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine if we are inside a session
  const sessionMatch = pathname.match(/^\/sessions\/([^/]+)$/);
  const isInSession = !!sessionMatch;
  const currentTab = searchParams.get('tab') || 'notes';

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('id, name, avatar_url').eq('id', session.user.id).single();
        if (data) {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-background-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <Link href="/profile">
            <UserAvatar 
              name={profile?.name || 'User'} 
              avatarUrl={profile?.avatar_url} 
              userId={profile?.id} 
              className="h-8 w-8 text-xs" 
            />
          </Link>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-surface border-r border-border shadow-xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-border">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-background-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
                <div className="space-y-1">
                  {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href) && !isInSession);
                    return (
                      <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          active
                            ? 'bg-brand-muted text-brand'
                            : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                        )}
                      >
                        <Icon className={cn('flex-shrink-0', active ? 'h-4.5 w-4.5' : 'h-4 w-4')} />
                        {label}
                      </Link>
                    );
                  })}
                </div>

                {isInSession && (
                  <div className="pt-4 border-t border-border space-y-1">
                    <div className="px-3 mb-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                      Session Workspace
                    </div>
                    {workspaceTabs.map(({ id, label, icon: Icon }) => {
                      const href = `${pathname}?tab=${id}`;
                      const active = currentTab === id;
                      return (
                        <Link key={id} href={href} onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                            active
                              ? 'bg-brand-muted text-brand'
                              : 'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                          )}
                        >
                          <Icon className={cn('flex-shrink-0', active ? 'h-4.5 w-4.5' : 'h-4 w-4')} />
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border space-y-1">
                {bottomItems.map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {label}
                  </Link>
                ))}
                <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

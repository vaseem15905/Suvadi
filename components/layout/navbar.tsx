'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthModal, AuthView } from '@/components/auth/auth-modal';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean, view: AuthView }>({ isOpen: false, view: 'login' });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass shadow-sm'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg',
                  'bg-brand text-white',
                  'shadow-sm hover:shadow-md transition-all duration-200',
                  'hover:opacity-90 active:scale-[0.98]'
                )}
              >
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalConfig({ isOpen: true, view: 'login' })}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                    'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                  )}
                >
                  Log in
                </button>
                <button
                  onClick={() => setAuthModalConfig({ isOpen: true, view: 'signup' })}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg',
                    'bg-brand text-white',
                    'shadow-sm hover:shadow-md transition-all duration-200',
                    'hover:opacity-90 active:scale-[0.98]'
                  )}
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg',
                'text-foreground-muted hover:text-foreground',
                'hover:bg-background-secondary transition-colors duration-200'
              )}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 bg-surface border-b border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200',
                      'text-foreground-muted hover:text-foreground hover:bg-background-secondary'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t border-border space-y-2">
                  {user ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block w-full px-4 py-3 text-center text-base font-semibold rounded-lg',
                        'bg-brand text-white',
                        'transition-all duration-200'
                      )}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setAuthModalConfig({ isOpen: true, view: 'login' });
                        }}
                        className={cn(
                          'block w-full px-4 py-3 text-center text-base font-medium rounded-lg',
                          'text-foreground-muted hover:text-foreground hover:bg-background-secondary',
                          'transition-colors duration-200'
                        )}
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setAuthModalConfig({ isOpen: true, view: 'signup' });
                        }}
                        className={cn(
                          'block w-full px-4 py-3 text-center text-base font-semibold rounded-lg',
                          'bg-brand text-white',
                          'transition-all duration-200'
                        )}
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} 
        defaultView={authModalConfig.view} 
      />
    </>
  );
}

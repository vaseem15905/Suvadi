'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { X, ArrowRight, LogIn } from 'lucide-react';
import { AuthModal, AuthView } from '@/components/auth/auth-modal';

interface JoinSessionModalProps {
  onClose: () => void;
}

export function JoinSessionModal({ onClose }: JoinSessionModalProps) {
  const [joinCode, setJoinCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean, view: AuthView }>({ isOpen: false, view: 'login' });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, [supabase.auth]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length === 6) {
      router.push(`/join/${joinCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
              <LogIn className="h-6 w-6 text-brand" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">Sign in required</h3>
            <p className="mb-6 text-sm text-foreground-muted">
              You need to be signed in to join a workspace session. 
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, view: 'login' })}
                className="flex w-full items-center justify-center rounded-xl bg-brand py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthModalConfig({ isOpen: true, view: 'signup' })}
                className="flex w-full items-center justify-center rounded-xl border border-border bg-surface py-2.5 text-sm font-semibold text-foreground hover:bg-background-secondary transition-colors"
              >
                Create an Account
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <h3 className="mb-2 text-xl font-bold text-foreground">Join a Session</h3>
            <p className="mb-6 text-sm text-foreground-muted">
              Enter the 6-character code provided by your session host.
            </p>
            
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label htmlFor="joinCode" className="sr-only">Join Code</label>
                <input
                  id="joinCode"
                  type="text"
                  placeholder="e.g. A1B2C3"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-bold tracking-widest text-foreground placeholder:font-normal placeholder:tracking-normal focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 uppercase"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={joinCode.length !== 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Join Workspace
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} 
        defaultView={authModalConfig.view} 
      />
    </div>
  );
}

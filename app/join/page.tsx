'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function JoinPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    if (code.length < 6) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?next=/join/${code}`);
        return;
      }

      const { data: session } = await supabase
        .from('sessions')
        .select('id, title, status')
        .eq('join_code', code.toUpperCase())
        .single();

      if (!session) throw new Error('Session not found. Check the code and try again.');
      if (session.status !== 'active') throw new Error('This session is no longer active.');

      router.push(`/sessions/${session.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to join session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Join a Session</h1>
          <p className="mt-2 text-sm text-foreground-muted">Enter the 6-character code from your host.</p>

          <div className="mt-6">
            <input
              value={code}
              onChange={(e) => {
                let val = e.target.value;
                // If they paste a full URL like http://.../join/ABCDEF
                if (val.includes('/join/')) {
                  const parts = val.split('/join/');
                  val = parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, '');
                }
                setCode(val.toUpperCase().slice(0, 6));
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="ABC123"
              className={cn(
                'w-full rounded-xl border border-border bg-background px-4 py-4 text-center text-2xl font-bold tracking-[0.5em]',
                'text-foreground placeholder:text-foreground-subtle placeholder:tracking-[0.3em] placeholder:text-base placeholder:font-normal',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors uppercase'
              )}
            />
          </div>

          <button onClick={handleJoin} disabled={isLoading || code.length < 6}
            className={cn(
              'mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold',
              'bg-brand text-white hover:opacity-90 transition-all active:scale-[0.98]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <><ArrowRight className="h-4 w-4" />Join Session</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

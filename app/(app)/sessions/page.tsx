import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, Copy, Users, Globe, Lock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SessionCardActions } from '@/components/dashboard/session-card-actions';

export const metadata: Metadata = { title: 'My Sessions' };

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch hosted sessions
  const { data: hostedSessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('host_id', user.id);

  // Fetch joined sessions
  const { data: participantData } = await supabase
    .from('session_participants')
    .select('sessions(*)')
    .eq('user_id', user.id);

  const allSessionsMap = new Map();
  if (hostedSessions) {
    hostedSessions.forEach(s => allSessionsMap.set(s.id, s));
  }
  if (participantData) {
    participantData.forEach(p => {
      // @ts-ignore
      const session = Array.isArray(p.sessions) ? p.sessions[0] : p.sessions;
      if (session) allSessionsMap.set(session.id, session);
    });
  }

  const sessions = Array.from(allSessionsMap.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Sessions</h1>
          <p className="text-sm text-foreground-muted mt-1">Manage and launch your collaborative sessions.</p>
        </div>
        <Link href="/sessions/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all active:scale-[0.98]">
          <PlusCircle className="h-4 w-4" />New Session
        </Link>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface shadow-xs flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted">
            <Zap className="h-8 w-8 text-brand" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-foreground">No sessions yet</h3>
          <p className="mt-2 text-sm text-foreground-muted max-w-sm">
            Create your first session and invite participants to collaborate in real-time.
          </p>
          <Link href="/sessions/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white">
            <PlusCircle className="h-4 w-4" />Create Your First Session
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Link key={session.id} href={`/sessions/${session.id}`}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-xs hover:shadow-md hover:border-brand/20 transition-all duration-200 hover:-translate-y-0.5 block">
              {/* Banner */}
              <div className="h-24 rounded-xl bg-brand flex items-center justify-center text-white text-3xl font-bold mb-4">
                {session.title[0]}
              </div>

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-1">
                  {session.title}
                </h3>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0',
                  session.status === 'active' ? 'bg-success/10 text-success' : 'bg-border text-foreground-muted'
                )}>
                  {session.status}
                </span>
              </div>

              {session.description && (
                <p className="mt-1 text-xs text-foreground-muted line-clamp-2">{session.description}</p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-foreground-subtle">
                <div className="flex items-center gap-1">
                  {session.visibility === 'public' ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  <span className="capitalize">{session.visibility}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>0 members</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <SessionCardActions 
                  sessionId={session.id} 
                  joinCode={session.join_code} 
                  isHost={session.host_id === user?.id} 
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

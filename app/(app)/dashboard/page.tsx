import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, CalendarDays, Clock, ArrowRight, Users, Zap, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SessionCardActions } from '@/components/dashboard/session-card-actions';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch recent sessions (hosted + joined)
  const { data: hostedSessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('host_id', user.id);

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
      // @ts-ignore - Supabase types might wrap this in an array depending on relationships, but typically it's an object for many-to-one
      const session = Array.isArray(p.sessions) ? p.sessions[0] : p.sessions;
      if (session) allSessionsMap.set(session.id, session);
    });
  }

  const sessions = Array.from(allSessionsMap.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const firstName = profile?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{greeting}, {firstName}</h1>
          <p className="text-sm text-foreground-muted mt-1">Here&apos;s what&apos;s happening in your workspace.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/join"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-border/50 transition-all active:scale-[0.98]">
            <KeyRound className="h-4 w-4 text-foreground-muted" />
            Join Session
          </Link>
          <Link href="/sessions/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all active:scale-[0.98]">
            <PlusCircle className="h-4 w-4" />
            New Session
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Sessions', value: sessions?.length ?? 0, icon: CalendarDays, color: 'text-brand' },
          { label: 'This Week',      value: 0,                     icon: Clock,        color: 'text-info' },
          { label: 'Participants',   value: 0,                     icon: Users,        color: 'text-success' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">{label}</span>
              <Icon className={cn('h-4 w-4', color)} />
            </div>
            <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
          </div>
        ))}
      </div>

      {/* Recent Sessions */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Recent Sessions</h2>
          <Link href="/sessions" className="flex items-center gap-1 text-xs text-brand hover:underline">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {!sessions || sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted">
              <Zap className="h-7 w-7 text-brand" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No sessions yet</h3>
            <p className="mt-2 text-sm text-foreground-muted max-w-xs">
              Create your first session to get started with collaborative learning.
            </p>
            <Link href="/sessions/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
              <PlusCircle className="h-4 w-4" />Create Session
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => (
              <Link key={session.id} href={`/sessions/${session.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-background-secondary transition-colors group">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand text-white text-sm font-bold">
                  {session.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors">
                    {session.title}
                  </div>
                  <div className="text-xs text-foreground-muted mt-0.5">
                    {new Date(session.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Actions: Copy & Delete */}
                <div className="mr-2">
                  <SessionCardActions 
                    sessionId={session.id}
                    joinCode={session.join_code}
                    isHost={session.host_id === user?.id}
                    iconOnly
                  />
                </div>

                <span className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium flex-shrink-0',
                  session.status === 'active' ? 'bg-success/10 text-success' : 'bg-border text-foreground-muted'
                )}>
                  {session.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

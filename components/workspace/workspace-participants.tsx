'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/shared/user-avatar';

interface Participant {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: { name: string; avatar_url: string | null };
}

export function WorkspaceParticipants({ sessionId, userId, isHost }: { sessionId: string; userId: string; isHost: boolean }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from('session_participants')
      .select('*, profiles(name, avatar_url)')
      .eq('session_id', sessionId)
      .order('role', { ascending: true });
    setParticipants(data ?? []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`participants-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_participants', filter: `session_id=eq.${sessionId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const removeParticipant = async (id: string) => {
    if (!isHost) return;
    const { error } = await supabase.from('session_participants').delete().eq('id', id);
    if (error) {
      toast.error(`Failed to remove participant: ${error.message}`);
    } else {
      load();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-background">
        <span className="text-sm font-medium text-foreground">Participants</span>
        <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
          <Users className="h-3.5 w-3.5" />
          <span>{participants.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-background-secondary">
        {participants.length === 0 ? (
          <div className="text-center py-12 text-foreground-subtle text-sm">No participants joined yet.</div>
        ) : participants.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
            <UserAvatar 
              name={p.profiles?.name ?? 'Unknown'} 
              avatarUrl={p.profiles?.avatar_url} 
              userId={p.user_id} 
              className="h-9 w-9 text-xs" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                {p.profiles?.name ?? 'Unknown'} {p.user_id === userId && <span className="text-foreground-subtle text-xs font-normal">(me)</span>}
                {p.role === 'host' && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
              </div>
              <div className="text-xs text-foreground-subtle capitalize">{p.role}</div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success flex-shrink-0" title="Online" />
              {isHost && p.user_id !== userId && (
                <button
                  onClick={() => removeParticipant(p.id)}
                  title="Remove Participant"
                  className="ml-2 flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="23" y1="11" y2="11"/></svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

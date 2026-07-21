'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Megaphone, Pin, Trash2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  content: string;
  pinned: boolean;
  created_at: string;
  profiles?: { name: string };
}

interface WorkspaceAnnouncementsProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
}

export function WorkspaceAnnouncements({ sessionId, userId, isHost }: WorkspaceAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*, profiles(name)')
      .eq('session_id', sessionId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    setAnnouncements(data ?? []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`announcements-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements', filter: `session_id=eq.${sessionId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const post = async () => {
    if (!newMsg.trim() || !isHost) return;
    await supabase.from('announcements').insert({ session_id: sessionId, user_id: userId, content: newMsg.trim(), pinned: false });
    setNewMsg('');
    load();
  };

  const togglePin = async (id: string, pinned: boolean) => {
    await supabase.from('announcements').update({ pinned: !pinned }).eq('id', id);
    load();
  };

  const del = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    load();
  };

  return (
    <div className="flex h-full flex-col relative">
      <div className="border-b border-border px-4 py-3 bg-background flex items-center justify-between z-10">
        <span className="text-sm font-medium text-foreground">Announcements</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 bg-background-secondary">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-foreground-subtle text-sm">No announcements yet.</div>
        ) : announcements.map((a) => (
          <div key={a.id} className={cn(
            'rounded-xl border bg-surface p-4',
            a.pinned ? 'border-brand/30 bg-brand-muted/20' : 'border-border'
          )}>
            <div className="flex items-start gap-3">
              <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg', a.pinned ? 'bg-brand text-white' : 'bg-brand-muted text-brand')}>
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{a.content}</p>
                <span className="text-xs text-foreground-subtle mt-1 block">
                  {a.profiles?.name} · {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {a.pinned && <span className="ml-2 text-brand">📌 Pinned</span>}
                </span>
              </div>
              {isHost && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => togglePin(a.id, a.pinned)}
                    className={cn('flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
                      a.pinned ? 'text-brand hover:bg-brand-muted' : 'text-foreground-subtle hover:bg-background-secondary')}>
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => del(a.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isHost && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex gap-2 p-2 rounded-2xl bg-surface border border-border shadow-lg">
            <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && post()}
              placeholder="Post an announcement..."
              className="flex-1 rounded-xl border border-transparent bg-background-secondary px-4 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <button onClick={post} disabled={!newMsg.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white disabled:opacity-50 hover:opacity-90 transition-opacity">
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

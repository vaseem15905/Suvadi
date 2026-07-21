'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface WorkspaceNotesProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
}

export function WorkspaceNotes({ sessionId, userId, isHost }: WorkspaceNotesProps) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('notes')
        .select('content')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single();
      if (data) setContent(data.content ?? '');
    };
    load();
  }, [sessionId, userId]);

  const handleChange = (val: string) => {
    setContent(val);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      setSaving(true);
      await supabase.from('notes').upsert({
        session_id: sessionId,
        user_id: userId,
        content: val,
        updated_at: new Date().toISOString(),
      });
      setSaving(false);
      setLastSaved(new Date());
    }, 800);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-background">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">My Notes</span>
          {isHost && (
            <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs text-brand">Host</span>
          )}
        </div>
        <span className="text-xs text-foreground-subtle">
          {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
        </span>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start taking notes... Your notes are auto-saved."
        className={cn(
          'flex-1 w-full p-6 text-sm text-foreground placeholder:text-foreground-subtle',
          'bg-background resize-none focus:outline-none font-mono leading-relaxed'
        )}
      />
    </div>
  );
}

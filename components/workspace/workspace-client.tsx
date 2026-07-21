'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  FileText, PenTool, FolderOpen, MessageCircleQuestion,
  Megaphone, Users, Copy, Share2, Settings, Maximize, Minimize
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkspaceNotes } from '@/components/workspace/workspace-notes';
import { WorkspaceQuestions } from '@/components/workspace/workspace-questions';
import { WorkspaceAnnouncements } from '@/components/workspace/workspace-announcements';
import { WorkspaceParticipants } from '@/components/workspace/workspace-participants';
import { WorkspaceResources } from '@/components/workspace/workspace-resources';
import { WorkspaceWhiteboard } from '@/components/workspace/workspace-whiteboard';
import { toast } from 'sonner';

const TABS = [
  { id: 'notes',         label: 'Notes',         icon: FileText },
  { id: 'whiteboard',   label: 'Whiteboard',    icon: PenTool },
  { id: 'resources',    label: 'Resources',     icon: FolderOpen },
  { id: 'questions',    label: 'Q&A',           icon: MessageCircleQuestion },
  { id: 'announcements',label: 'Announce',      icon: Megaphone },
  { id: 'participants', label: 'People',         icon: Users },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface WorkspaceClientProps {
  session: {
    id: string;
    title: string;
    join_code: string;
    visibility: string;
    host_id: string;
    settings?: {
      allow_participant_interaction?: boolean;
    };
  };
  userId: string;
  isHost: boolean;
}

export function WorkspaceClient({ session, userId, isHost }: WorkspaceClientProps) {
  const searchParams = useSearchParams();
  const activeTabStr = searchParams.get('tab') || 'notes';
  const activeTab = activeTabStr as TabId;

  const [showSettings, setShowSettings] = useState(false);
  const [allowInteractions, setAllowInteractions] = useState(session.settings?.allow_participant_interaction ?? true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('session-settings')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          const newSettings = payload.new.settings || {};
          setAllowInteractions(newSettings.allow_participant_interaction ?? true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id, supabase]);

  const toggleInteractions = async () => {
    const newVal = !allowInteractions;
    setAllowInteractions(newVal);
    
    await supabase.from('sessions').update({
      settings: { ...session.settings, allow_participant_interaction: newVal }
    }).eq('id', session.id);
  };

  const copyJoinLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${session.join_code}`);
    toast.success('Join link copied!');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/join/${session.join_code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: session.title,
          text: `Join my session: ${session.title}`,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyJoinLink();
        }
      }
    } else {
      copyJoinLink();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div ref={containerRef} className={cn(
      "flex flex-col bg-background transition-all duration-300",
      isFullscreen 
        ? "fixed inset-0 z-50 h-[100dvh]" 
        : "h-[calc(100vh-96px)] md:h-[calc(100vh-112px)] relative rounded-2xl border border-border shadow-sm overflow-hidden"
    )}>
      {/* Workspace Top Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-white text-sm font-bold">
            {session.title[0]}
          </div>
          <h1 className="text-sm font-semibold text-foreground truncate">{session.title}</h1>
          <span className="hidden sm:inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-success/10 text-success flex-shrink-0">
            Live
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={toggleFullscreen} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-background-secondary transition-colors text-foreground-muted" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
          <button onClick={copyJoinLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background-secondary px-3 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground transition-colors">
            <Copy className="h-3 w-3" />
            <span className="hidden sm:inline">{session.join_code}</span>
          </button>
          <button onClick={handleShare} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-background-secondary transition-colors text-foreground-muted">
            <Share2 className="h-3.5 w-3.5" />
          </button>
          {isHost && (
            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-background-secondary transition-colors text-foreground-muted">
                <Settings className="h-3.5 w-3.5" />
              </button>
              
              {showSettings && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
                  <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-border bg-surface p-2 shadow-lg animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1.5 text-xs font-semibold text-foreground-muted">Host Settings</div>
                    <div className="mt-1 flex items-center justify-between rounded-lg p-2 hover:bg-background-secondary cursor-pointer" onClick={toggleInteractions}>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Participant Activity</span>
                        <span className="text-xs text-foreground-subtle">Allow Q&A and Uploads</span>
                      </div>
                      <div className={cn("relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", allowInteractions ? 'bg-brand' : 'bg-border')}>
                        <span className={cn("pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", allowInteractions ? 'translate-x-4' : 'translate-x-0')} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area (No internal sidebar anymore) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'notes'         && <WorkspaceNotes sessionId={session.id} userId={userId} isHost={isHost} />}
        {activeTab === 'whiteboard'    && <WorkspaceWhiteboard sessionId={session.id} userId={userId} isHost={isHost} allowInteractions={allowInteractions} />}
        {activeTab === 'resources'     && <WorkspaceResources sessionId={session.id} userId={userId} isHost={isHost} allowInteractions={allowInteractions} />}
        {activeTab === 'questions'     && <WorkspaceQuestions sessionId={session.id} userId={userId} isHost={isHost} allowInteractions={allowInteractions} />}
        {activeTab === 'announcements' && <WorkspaceAnnouncements sessionId={session.id} userId={userId} isHost={isHost} />}
        {activeTab === 'participants'  && <WorkspaceParticipants sessionId={session.id} userId={userId} isHost={isHost} />}
      </div>
    </div>
  );
}

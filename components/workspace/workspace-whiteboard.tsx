'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import '@excalidraw/excalidraw/index.css';
const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  { ssr: false }
);

interface WorkspaceWhiteboardProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
  allowInteractions: boolean;
}

export function WorkspaceWhiteboard({ sessionId, userId, isHost, allowInteractions }: WorkspaceWhiteboardProps) {
  const [initialData, setInitialData] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const supabase = createClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const excalidrawAPI = useRef<any>(null);
  const sceneVersionRef = useRef<number>(-1);
  const getSceneVersionRef = useRef<any>(null);
  
  // Follow Host state
  const [isFollowing, setIsFollowing] = useState(false);
  const isFollowingRef = useRef(false);
  const lastAppStateRef = useRef({ scrollX: 0, scrollY: 0, zoom: { value: 1 } });

  // User requested: ONLY the host can draw, participants can only view.
  const canDraw = isHost;

  useEffect(() => {
    let channel: RealtimeChannel;
    
    const init = async () => {
      // Dynamically load getSceneVersion to avoid SSR issues
      const excalidrawModule = await import('@excalidraw/excalidraw');
      getSceneVersionRef.current = excalidrawModule.getSceneVersion;

      channel = supabase.channel(`excalidraw-${sessionId}`);
      channelRef.current = channel;

      // 1. Load initial snapshot from DB
      const { data } = await supabase
        .from('whiteboard_snapshots')
        .select('snapshot')
        .eq('session_id', sessionId)
        .single();
        
      if (data && data.snapshot && data.snapshot.elements) {
        setInitialData({ elements: data.snapshot.elements });
        sceneVersionRef.current = getSceneVersionRef.current(data.snapshot.elements);
      } else {
        setInitialData({ elements: [] });
      }
      setIsReady(true);

      // 2. Subscribe to Broadcast channel for real-time diffs
      channel.on('broadcast', { event: 'excalidraw-update' }, ({ payload }) => {
        if (excalidrawAPI.current) {
          // Update local version so we don't bounce it back
          if (getSceneVersionRef.current) {
            sceneVersionRef.current = getSceneVersionRef.current(payload.elements);
          }
          
          const updateObj: any = { elements: payload.elements, commitToHistory: false };
          
          // Apply viewport sync if following
          if (isFollowingRef.current && payload.appState) {
            updateObj.appState = {
              scrollX: payload.appState.scrollX,
              scrollY: payload.appState.scrollY,
              zoom: payload.appState.zoom
            };
          }
          
          // Update local excalidraw with remote elements (and viewport)
          excalidrawAPI.current.updateScene(updateObj);
        }
      });
      channel.subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [sessionId, supabase]);

  const handleChange = useCallback((elements: readonly any[], appState: any) => {
    if (!canDraw || !isReady || !getSceneVersionRef.current) return;
    
    const version = getSceneVersionRef.current(elements);
    
    const appStateChanged = 
      appState.scrollX !== lastAppStateRef.current.scrollX || 
      appState.scrollY !== lastAppStateRef.current.scrollY ||
      appState.zoom?.value !== lastAppStateRef.current.zoom?.value;

    // Fast equality check using scene version and appState to prevent infinite loops
    if (version === sceneVersionRef.current && !appStateChanged) return;
    
    sceneVersionRef.current = version;
    if (appStateChanged) {
      lastAppStateRef.current = { scrollX: appState.scrollX, scrollY: appState.scrollY, zoom: appState.zoom };
    }

    // Send to broadcast
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'excalidraw-update',
        payload: { 
          elements,
          appState: { scrollX: appState.scrollX, scrollY: appState.scrollY, zoom: appState.zoom }
        }
      }).catch(console.error);
    }

    // Save to DB (debounced) - only save elements, not appState
    if (version !== sceneVersionRef.current || elements.length > 0) {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        await supabase.from('whiteboard_snapshots').upsert({
          session_id: sessionId,
          snapshot: { elements },
          updated_at: new Date().toISOString()
        });
      }, 2000);
    }
  }, [canDraw, isReady, sessionId, supabase]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    isFollowingRef.current = !isFollowing;
  };

  return (
    <div className="flex h-full flex-col relative bg-background">
      {!canDraw && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <div className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-md pointer-events-none">
            View Only Mode
          </div>
          <button 
            onClick={toggleFollow}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-md transition-colors ${
              isFollowing 
                ? "bg-success text-white" 
                : "bg-surface border border-border text-foreground hover:bg-background-secondary"
            }`}
          >
            {isFollowing ? 'Following Host' : 'Follow Host'}
          </button>
        </div>
      )}
      
      {!isReady ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-brand">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <span className="text-sm font-medium">Loading Whiteboard...</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full relative z-0">
          <Excalidraw 
            initialData={initialData}
            onChange={handleChange}
            excalidrawAPI={(api: any) => { excalidrawAPI.current = api; }}
            viewModeEnabled={!canDraw}
          />
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Participant {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: { name: string; avatar_url: string | null };
}

interface WorkspaceSpinWheelProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#7986CB'
];

export function WorkspaceSpinWheel({ sessionId, userId, isHost }: WorkspaceSpinWheelProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinWinnerId, setSpinWinnerId] = useState<string | null>(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [rotation, setRotation] = useState(0);

  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase
      .from('session_participants')
      .select('*, profiles(name, avatar_url)')
      .eq('session_id', sessionId);
    setParticipants(data ?? []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`spin-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_participants', filter: `session_id=eq.${sessionId}` }, load)
      .on('broadcast', { event: 'spin_wheel' }, ({ payload }) => {
        setSpinWinnerId(payload.winnerId);
        setIsSpinning(true);
        setShowWinnerPopup(false);
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // Handle spin rotation logic
  const validParticipants = participants.length > 0 ? participants : [];
  
  useEffect(() => {
    if (isSpinning && spinWinnerId && validParticipants.length > 0) {
      const winnerIndex = validParticipants.findIndex(p => p.user_id === spinWinnerId);
      if (winnerIndex === -1) return;

      const sliceAngle = 360 / validParticipants.length;
      const winnerCenterAngle = winnerIndex * sliceAngle + sliceAngle / 2;
      const targetRotation = 360 * 5 + (360 - winnerCenterAngle); // 5 full extra spins

      setRotation(prev => prev + targetRotation);
      
      setTimeout(() => {
        handleSpinComplete();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#5F27CD', '#FF6B6B', '#4ECDC4'],
          zIndex: 9999
        });
      }, 5000); // 5 seconds spin duration
    }
  }, [isSpinning, spinWinnerId]);

  const handleSpinStart = () => {
    if (validParticipants.length < 1) return;
    const winner = validParticipants[Math.floor(Math.random() * validParticipants.length)];
    setSpinWinnerId(winner.user_id);
    setIsSpinning(true);
    setShowWinnerPopup(false);
    
    // Broadcast to all clients
    supabase.channel(`spin-${sessionId}`).send({
      type: 'broadcast',
      event: 'spin_wheel',
      payload: { winnerId: winner.user_id }
    });
  };

  const handleSpinComplete = async () => {
    setIsSpinning(false);
    setShowWinnerPopup(true);
    
    // Auto-close the popup after 5 seconds
    setTimeout(() => {
      setShowWinnerPopup(false);
    }, 5000);
    
    const winner = participants.find(p => p.user_id === spinWinnerId);
    if (!winner) return;

    if (isHost) {
      await supabase.from('session_announcements').insert({
        session_id: sessionId,
        content: `🎯 **Wheel Spin Result:** ${winner.profiles?.name ?? 'Unknown'} was selected!`,
        is_pinned: false
      });
    }
  };

  const renderWheel = () => {
    if (validParticipants.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-foreground-muted">No participants available.</div>
        </div>
      );
    }

    const sliceAngle = 360 / validParticipants.length;

    return (
      <div className="relative w-80 h-80 md:w-[440px] md:h-[440px] lg:w-[520px] lg:h-[520px] mx-auto mt-4">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20">
          <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-foreground drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Wheel */}
        <motion.div 
          className="w-full h-full rounded-full border-[6px] border-surface shadow-2xl relative overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.15, 0.8, 0.15, 1] }}
        >
          {/* Slices Background */}
          <div className="absolute inset-0" style={{
            background: validParticipants.length === 1 
              ? COLORS[0]
              : `conic-gradient(${validParticipants.map((_, i) => {
                  const color = COLORS[i % COLORS.length];
                  return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
                }).join(', ')})`
          }}></div>

          {/* Names */}
          {validParticipants.map((p, i) => {
            const startAngle = i * sliceAngle;
            return (
              <div 
                key={p.id}
                className="absolute top-1/2 left-1/2 w-1/2 h-8 -mt-4 origin-left flex items-center pl-4 pr-6 md:pr-10"
                style={{
                  transform: `rotate(${startAngle + sliceAngle / 2 - 90}deg)`
                }}
              >
                <span 
                  className="text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] block w-full text-right"
                  style={{
                    fontSize: Math.max(9, Math.min(16, 300 / validParticipants.length)) + 'px',
                  }}
                >
                  {p.profiles?.name?.split(' ')[0] ?? 'Unknown'}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface border-[4px] border-background shadow-inner z-10 flex items-center justify-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col relative bg-background-secondary overflow-hidden">
      <div className="border-b border-border px-4 py-3 bg-background flex items-center justify-between z-10">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <Star className="h-4 w-4 text-brand fill-brand" />
          Spin the Wheel
        </span>
        <span className="text-xs text-foreground-subtle bg-background-secondary px-2 py-0.5 rounded-full">{validParticipants.length} people</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-0">
        {renderWheel()}
        
        <div className="mt-12 h-16 flex items-center justify-center">
          {isHost ? (
            <button
              onClick={handleSpinStart}
              disabled={isSpinning || validParticipants.length < 1}
              className="px-8 py-3.5 bg-brand text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-lg"
            >
              {isSpinning ? 'Spinning...' : validParticipants.length < 1 ? 'Need more people' : 'SPIN THE WHEEL'}
            </button>
          ) : (
            <div className="text-center text-base font-medium text-foreground-muted animate-pulse">
              {isSpinning ? 'The host is spinning the wheel...' : 'Waiting for the host to spin...'}
            </div>
          )}
        </div>
      </div>

      {/* Center Screen Winner Popup */}
      <AnimatePresence>
        {showWinnerPopup && spinWinnerId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWinnerPopup(false)} />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative flex flex-col items-center justify-center rounded-3xl bg-surface px-12 py-10 shadow-2xl border border-border text-center max-w-sm w-full"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Star className="h-10 w-10 fill-brand" />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-2">
                {spinWinnerId === userId ? "It's you" : `It's ${participants.find(p => p.user_id === spinWinnerId)?.profiles?.name ?? 'Unknown'}`}
              </h2>
              <p className="text-foreground-muted text-sm">
                {spinWinnerId === userId ? "You have been selected by the host." : "They have been selected by the host."}
              </p>
              <button 
                onClick={() => setShowWinnerPopup(false)}
                className="mt-8 rounded-xl bg-background-secondary px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-border transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

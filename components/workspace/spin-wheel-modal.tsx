'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Participant {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: { name: string; avatar_url: string | null };
}

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  winnerId: string | null;
  isHost: boolean;
  isSpinning: boolean;
  onSpin: () => void;
  onComplete: () => void;
}

export function SpinWheelModal({
  isOpen,
  onClose,
  participants,
  winnerId,
  isHost,
  isSpinning,
  onSpin,
  onComplete
}: SpinWheelModalProps) {
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter out any invalid participants if needed
  const validParticipants = participants.length > 0 ? participants : [];

  useEffect(() => {
    if (isSpinning && winnerId && validParticipants.length > 0) {
      const winnerIndex = validParticipants.findIndex(p => p.user_id === winnerId);
      if (winnerIndex === -1) return;

      const sliceAngle = 360 / validParticipants.length;
      // Calculate the angle required to place the winner exactly at the top pointer (straight up).
      // Since our slices start at 0, the center of slice i is (i * sliceAngle + sliceAngle / 2).
      // We want this center to land at the top pointer (0 degrees in CSS rotate).
      
      const winnerCenterAngle = winnerIndex * sliceAngle + sliceAngle / 2;
      const targetRotation = 360 * 5 + (360 - winnerCenterAngle); // 5 full extra spins

      setRotation(prev => prev + targetRotation);
      
      setTimeout(() => {
        onComplete();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#5F27CD', '#FF6B6B', '#4ECDC4'],
          zIndex: 9999
        });
      }, 5000); // 5 seconds spin duration
    }
  }, [isSpinning, winnerId]);

  if (!isOpen) return null;

  const renderWheel = () => {
    if (validParticipants.length === 0) {
      return <div className="text-sm text-foreground-muted">No participants available.</div>;
    }

    const sliceAngle = 360 / validParticipants.length;

    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20">
          <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-foreground drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"></div>
        </div>

        {/* Wheel */}
        <motion.div 
          className="w-full h-full rounded-full border-[6px] border-surface shadow-2xl relative overflow-hidden bg-brand"
          animate={{ rotate: rotation }}
          transition={{ duration: 5, ease: [0.15, 0.8, 0.15, 1] }}
        >
          {validParticipants.map((p, i) => {
            const startAngle = i * sliceAngle;
            return (
              <div 
                key={p.id}
                className="absolute top-0 left-1/2 w-8 h-1/2 origin-bottom -translate-x-1/2 flex flex-col justify-start items-center pt-4 md:pt-6"
                style={{
                  transform: `translateX(-50%) rotate(${startAngle + sliceAngle / 2}deg)`
                }}
              >
                <span className="text-white font-bold text-xs md:text-sm -rotate-90 origin-center truncate w-20 sm:w-28 text-center drop-shadow-md">
                  {p.profiles?.name?.split(' ')[0] ?? 'Unknown'}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface border-[4px] border-background shadow-inner z-10 flex items-center justify-center">
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-brand"></div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSpinning && onClose()}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Spin the Wheel</h2>
              {!isSpinning && (
                <button onClick={onClose} className="rounded-full p-2 text-foreground-muted hover:bg-background-secondary transition-colors">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="py-6">
              {renderWheel()}
            </div>

            {isHost && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={onSpin}
                  disabled={isSpinning || validParticipants.length < 1}
                  className="w-full sm:w-auto px-8 py-3 bg-brand text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSpinning ? 'Spinning...' : validParticipants.length < 1 ? 'Need more people' : 'SPIN THE WHEEL'}
                </button>
              </div>
            )}
            
            {!isHost && isSpinning && (
              <div className="mt-6 text-center text-sm font-medium text-foreground-muted animate-pulse">
                The host is spinning the wheel...
              </div>
            )}
            
            {!isHost && !isSpinning && winnerId && (
              <div className="mt-6 text-center text-sm font-medium text-foreground">
                Waiting for the host to spin again...
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, ShieldCheck, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_TAGLINE } from '@/lib/constants';
import { JoinSessionModal } from './join-session-modal';
import { AuthModal, AuthView } from '@/components/auth/auth-modal';

export function HeroSection() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ isOpen: boolean, view: AuthView }>({ isOpen: false, view: 'signup' });
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        {/* Radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-brand-muted via-transparent to-transparent rounded-full blur-3xl opacity-60" />
        {/* Grid pattern */}

      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground-muted shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Supercharge your collaborative sessions
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block">Where Conversations</span>
            <span className="block gradient-text">Become Knowledge.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed md:text-xl"
          >
            The collaborative workspace for workshops, classrooms, conferences, and
            knowledge-sharing sessions. Create, share, and learn together in real-time.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <button
              onClick={() => setAuthModalConfig({ isOpen: true, view: 'signup' })}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white bg-brand shadow-md hover:shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Create Workspace
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-7 py-3.5 text-base font-semibold text-foreground shadow-xs hover:bg-surface-hover hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 text-brand" />
              Join Session
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-foreground-subtle font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <span>Privacy-first design</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand" />
              <span>Built for collaboration</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Zap className="h-5 w-5 text-brand" />
              <span>Real-time sync</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual — App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-16 md:mt-20"
        >
          <div className="relative mx-auto max-w-5xl">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-brand/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-50" />
            {/* App mockup */}
            <div className="relative rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-background-secondary">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-surface text-xs text-foreground-subtle">
                    app.suvadi.com/workspace
                  </div>
                </div>
              </div>
              {/* App content mockup */}
              <div className="grid grid-cols-12 min-h-[400px] md:min-h-[500px]">
                {/* Sidebar */}
                <div className="col-span-3 border-r border-border p-4 hidden md:block bg-background-secondary/50">
                  <div className="space-y-2">
                    {['Notes', 'Whiteboard', 'Resources', 'Q&A', 'Announcements'].map((item, i) => (
                      <div
                        key={item}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          i === 0 ? 'bg-brand-muted text-brand font-medium' : 'text-foreground-muted'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <div className="text-xs font-medium text-foreground-subtle mb-3 uppercase tracking-wider">Participants</div>
                    <div className="space-y-2">
                      {['Dr. Sarah Chen', 'Alex Rivera', 'Kim Park', '+12 more'].map((name) => (
                        <div key={name} className="flex items-center gap-2 text-sm text-foreground-muted">
                          <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center text-[10px] text-white font-bold">
                            {name[0]}
                          </div>
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Main content */}
                <div className="col-span-12 md:col-span-9 p-6 md:p-8 text-left flex flex-col h-full relative">
                  {/* Notes Header */}
                  <h3 className="text-xl font-bold text-foreground mb-4">Introduction to UX Research</h3>
                  
                  {/* Notes Body */}
                  <div className="space-y-3 mb-8">
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      User experience research is the systematic study of target users and their requirements, to add realistic contexts and insights to design processes. 
                    </p>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      Key methodologies include <strong className="text-foreground">interviews</strong>, <strong className="text-foreground">surveys</strong>, and <strong className="text-foreground">usability testing</strong>.
                    </p>
                    
                    <ul className="list-disc pl-5 text-sm text-foreground-muted space-y-1 pt-2">
                      <li>Qualitative research (Why?)</li>
                      <li>Quantitative research (What & How many?)</li>
                    </ul>
                  </div>
                  
                  {/* Q&A Popover/Section mockup */}
                  <div className="mt-auto p-4 rounded-xl border border-border bg-background-secondary shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                           <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-surface flex items-center justify-center text-[10px] text-white font-bold">M</div>
                           <div className="h-6 w-6 rounded-full bg-green-500 border-2 border-surface flex items-center justify-center text-[10px] text-white font-bold">A</div>
                        </div>
                        <span className="text-xs font-semibold text-foreground">Live Q&A</span>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-brand/10 text-brand">3 New</span>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-surface border border-border">
                      <p className="text-xs font-medium text-foreground mb-1">What sample size is ideal for usability testing?</p>
                      <div className="flex items-center gap-2 text-[10px] text-foreground-muted">
                        <span className="text-brand font-semibold">12 Upvotes</span>
                        <span>•</span>
                        <span>Asked by Alex</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {isJoinModalOpen && (
        <JoinSessionModal onClose={() => setIsJoinModalOpen(false)} />
      )}

      <AuthModal 
        isOpen={authModalConfig.isOpen} 
        onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} 
        defaultView={authModalConfig.view} 
      />
    </section>
  );
}

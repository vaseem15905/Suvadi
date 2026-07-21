'use client';

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_TAGLINE } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        {/* Radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-brand-muted via-transparent to-transparent rounded-full blur-3xl opacity-60" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
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
              Now in public beta — try it free
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
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white bg-brand shadow-md hover:shadow-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Create Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-7 py-3.5 text-base font-semibold text-foreground shadow-xs hover:bg-surface-hover hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 text-brand" />
              Join Session
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-foreground-subtle"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-background bg-brand flex items-center justify-center text-[10px] text-white font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>2,000+ users</span>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">4.9/5 rating</span>
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
                <div className="col-span-12 md:col-span-9 p-6 md:p-8">
                  <div className="space-y-4">
                    <div className="h-6 w-48 rounded bg-foreground/10 shimmer" />
                    <div className="h-4 w-full rounded bg-foreground/5 shimmer" />
                    <div className="h-4 w-5/6 rounded bg-foreground/5 shimmer" />
                    <div className="h-4 w-3/4 rounded bg-foreground/5 shimmer" />
                    <div className="mt-6 p-4 rounded-xl border border-border bg-background-secondary">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 w-2 rounded-full bg-brand" />
                        <div className="h-3 w-32 rounded bg-foreground/10" />
                      </div>
                      <div className="h-24 w-full rounded-lg bg-foreground/5" />
                    </div>
                    <div className="h-4 w-2/3 rounded bg-foreground/5 shimmer" />
                    <div className="h-4 w-4/5 rounded bg-foreground/5 shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

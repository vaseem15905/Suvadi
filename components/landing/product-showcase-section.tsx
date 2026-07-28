'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll';
import { cn } from '@/lib/utils';

const devices = ['desktop', 'tablet', 'mobile'] as const;
type Device = typeof devices[number];

const deviceWidths = {
  desktop: 1024,
  tablet: 768,
  mobile: 375
};

export function ProductShowcaseSection() {
  const [activeDevice, setActiveDevice] = useState<Device>('desktop');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDevice(prev => {
        const nextIndex = (devices.indexOf(prev) + 1) % devices.length;
        return devices[nextIndex];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isMobile = activeDevice === 'mobile';
  const isTablet = activeDevice === 'tablet';
  return (
    <section className="section-padding bg-background-secondary overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">
            Product
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Beautifully crafted for <span className="gradient-text">every device</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
            A premium experience whether you&apos;re on desktop, tablet, or mobile.
          </p>
        </AnimateOnScroll>

        {/* Device icons */}
        <AnimateOnScroll delay={0.2} className="mt-8 flex items-center justify-center gap-6">
          {[
            { id: 'desktop', Icon: Monitor, label: 'Desktop' },
            { id: 'tablet', Icon: Tablet, label: 'Tablet' },
            { id: 'mobile', Icon: Smartphone, label: 'Mobile' },
          ].map(({ id, Icon, label }) => (
            <div 
              key={id} 
              className={cn(
                "flex flex-col items-center gap-2 cursor-pointer transition-opacity duration-300",
                activeDevice === id ? "opacity-100" : "opacity-40"
              )}
              onClick={() => setActiveDevice(id as Device)}
            >
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border shadow-xs transition-colors duration-300",
                activeDevice === id ? "bg-brand text-white border-brand" : "bg-surface border-border text-foreground-muted"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                activeDevice === id ? "text-foreground" : "text-foreground-subtle"
              )}>{label}</span>
            </div>
          ))}
        </AnimateOnScroll>

        {/* Product Screenshot Mockup */}
        <AnimateOnScroll delay={0.3} variant="scaleIn" className="mt-12 flex justify-center">
          <motion.div 
            className="relative w-full"
            animate={{ maxWidth: deviceWidths[activeDevice] }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-brand/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

            <div className="relative rounded-2xl border border-border bg-surface shadow-xl overflow-hidden h-full flex flex-col">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-background-secondary">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-surface text-xs text-foreground-subtle font-mono">
                    suvadi.com/session/workshop-2026
                  </div>
                </div>
              </div>

              {/* App content */}
              <div className="p-6 md:p-8 min-h-[350px] md:min-h-[450px] flex-1">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
                    <div>
                      <div className="h-4 w-40 rounded bg-foreground/10" />
                      <div className="h-3 w-24 rounded bg-foreground/5 mt-1.5" />
                    </div>
                  </div>
                  <div className={cn("flex gap-2", isMobile && "hidden")}>
                    <div className="h-8 w-20 rounded-lg bg-brand-muted" />
                    <div className="h-8 w-8 rounded-lg bg-foreground/5" />
                  </div>
                </div>

                {/* Content grid */}
                <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-3")}>
                  {/* Card 1 — Notes */}
                  <div className="rounded-xl border border-border p-4 bg-background-secondary/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-brand" />
                      <div className="text-xs font-medium text-foreground-muted">Live Notes</div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-foreground/5" />
                      <div className="h-3 w-4/5 rounded bg-foreground/5" />
                      <div className="h-3 w-3/5 rounded bg-foreground/5" />
                    </div>
                  </div>

                  {/* Card 2 — Q&A */}
                  <div className="rounded-xl border border-border p-4 bg-background-secondary/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <div className="text-xs font-medium text-foreground-muted">Questions</div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-foreground/5 flex-shrink-0" />
                          <div className="h-3 flex-1 rounded bg-foreground/5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3 — Participants */}
                  <div className="rounded-xl border border-border p-4 bg-background-secondary/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-2 w-2 rounded-full bg-info" />
                      <div className="text-xs font-medium text-foreground-muted">15 Online</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-7 w-7 rounded-full bg-gradient-to-br from-brand/30 to-purple-500/30"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

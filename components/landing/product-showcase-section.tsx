'use client';

import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll';

export function ProductShowcaseSection() {
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
            { Icon: Monitor, label: 'Desktop' },
            { Icon: Tablet, label: 'Tablet' },
            { Icon: Smartphone, label: 'Mobile' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border text-foreground-muted shadow-xs">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-foreground-subtle">{label}</span>
            </div>
          ))}
        </AnimateOnScroll>

        {/* Product Screenshot Mockup */}
        <AnimateOnScroll delay={0.3} variant="scaleIn" className="mt-12">
          <div className="relative mx-auto max-w-5xl">
            {/* Glow */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-brand/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

            <div className="relative rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
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
              <div className="p-6 md:p-8 min-h-[350px] md:min-h-[450px]">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center text-white text-sm font-bold">
                      உ
                    </div>
                    <div>
                      <div className="h-4 w-40 rounded bg-foreground/10" />
                      <div className="h-3 w-24 rounded bg-foreground/5 mt-1.5" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 rounded-lg bg-brand-muted" />
                    <div className="h-8 w-8 rounded-lg bg-foreground/5" />
                  </div>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

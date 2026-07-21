'use client';

import * as LucideIcons from 'lucide-react';
import { FEATURES } from '@/lib/constants';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/components/shared/animate-on-scroll';

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">Features</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for
            <span className="gradient-text"> collaborative learning</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
            Powerful tools designed to make every session engaging, organized, and productive.
          </p>
        </AnimateOnScroll>

        {/* Feature Cards */}
        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {FEATURES.map((feature) => {
            const IconComponent = LucideIcons[feature.icon] as React.ComponentType<{ className?: string }>;

            return (
              <StaggerItem key={feature.title}>
                <div className="group relative rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-brand/20 hover:-translate-y-0.5">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-muted text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    {IconComponent && <IconComponent className="h-6 w-6" />}
                  </div>

                  {/* Content */}
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover glow */}
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

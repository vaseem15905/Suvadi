'use client';

import { HOW_IT_WORKS_STEPS } from '@/lib/constants';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/components/shared/animate-on-scroll';

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">How It Works</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Get started in <span className="gradient-text">three simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
            From creation to collaboration in under a minute.
          </p>
        </AnimateOnScroll>

        {/* Steps */}
        <StaggerContainer className="mt-16 relative" staggerDelay={0.15}>
          {/* Connecting line */}
          <div className="absolute top-16 left-1/2 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/20 to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <StaggerItem key={step.step}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white text-xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    {/* Glow */}
                    <div className="absolute -inset-2 rounded-2xl bg-brand/20 blur-xl -z-10" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-foreground-muted leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}

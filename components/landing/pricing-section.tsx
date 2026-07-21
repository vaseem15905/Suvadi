'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/constants';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/components/shared/animate-on-scroll';
import { cn } from '@/lib/utils';

export function PricingSection() {
  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">Pricing</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </AnimateOnScroll>

        {/* Pricing Cards */}
        <StaggerContainer className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
          {PRICING_PLANS.map((plan) => (
            <StaggerItem key={plan.name}>
              <div
                className={cn(
                  'relative flex flex-col rounded-2xl border p-8 transition-all duration-300 h-full',
                  plan.highlighted
                    ? 'border-brand bg-surface shadow-lg scale-[1.02] lg:scale-105'
                    : 'border-border bg-surface shadow-xs hover:shadow-md hover:border-brand/20'
                )}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm text-foreground-muted">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-foreground-muted">/{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={cn(
                        'h-4 w-4 mt-0.5 flex-shrink-0',
                        plan.highlighted ? 'text-brand' : 'text-success'
                      )} />
                      <span className="text-sm text-foreground-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
                      plan.highlighted
                        ? 'bg-brand text-white shadow-md hover:shadow-lg hover:opacity-90'
                        : 'border border-border bg-surface text-foreground hover:bg-surface-hover hover:shadow-sm'
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

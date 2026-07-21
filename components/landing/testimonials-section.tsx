'use client';

import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/components/shared/animate-on-scroll';

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">Testimonials</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by <span className="gradient-text">educators & teams</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
            See what our users say about their experience with Suvadi.
          </p>
        </AnimateOnScroll>

        {/* Testimonial Cards */}
        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
          {TESTIMONIALS.map((testimonial, index) => (
            <StaggerItem key={testimonial.name}>
              <div className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 h-full">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-brand/20 mb-4" />

                {/* Content */}
                <p className="text-sm text-foreground-muted leading-relaxed flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border-light">
                  <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.name[0]}{testimonial.name.split(' ').pop()?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-xs text-foreground-subtle">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

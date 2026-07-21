'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll';

export function CTASection() {
  return (
    <section className="section-padding bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-3xl bg-brand p-10 md:p-16 text-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            {/* Floating decoration */}
            <div className="absolute top-8 right-8 hidden md:block">
              <Sparkles className="h-8 w-8 text-white/30 animate-float" />
            </div>
            <div className="absolute bottom-8 left-8 hidden md:block">
              <Sparkles className="h-6 w-6 text-white/20 animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to transform your sessions?
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                Join thousands of educators, trainers, and teams who use Suvadi to create
                engaging, collaborative learning experiences.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-brand shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

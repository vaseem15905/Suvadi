import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/components/shared/animate-on-scroll';
import { ArrowRight, Heart, Zap, Globe, Users } from 'lucide-react';

export const metadata: Metadata = { title: 'About Suvadi' };

const values = [
  { icon: Heart, title: 'Human-Centered', description: 'Built with empathy for educators, trainers, and learners of all kinds.' },
  { icon: Zap, title: 'Real-Time First', description: 'Every feature is designed around live collaboration — no refresh needed.' },
  { icon: Globe, title: 'Accessible', description: 'Tamil-inspired, globally designed. Inclusive for every culture and language.' },
  { icon: Users, title: 'Community Driven', description: "Our roadmap is shaped by our users' feedback and real-world needs." },
];

export default function AboutPage() {
  return (
    <>
      <div className="pt-32 pb-16 bg-background-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold text-brand uppercase tracking-wider">Our Story</span>
            <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">
              Built for the <span className="gradient-text">curious minds</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted leading-relaxed">
              Suvadi (சுவடி) means &ldquo;a book&rdquo; in Tamil. We built it because every collaborative session
              writes a new chapter of knowledge — and we wanted to give you the perfect blank page to create together.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
          </AnimateOnScroll>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
            {values.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title}>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-muted text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section-padding bg-background-secondary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-foreground">Ready to join us?</h2>
            <p className="mt-4 text-lg text-foreground-muted">
              Whether you&apos;re a teacher, trainer, or curious learner — there&apos;s a place for you at Suvadi.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-hover transition-all">
                Contact Us
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}

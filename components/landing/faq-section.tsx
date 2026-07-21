'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_ITEMS } from '@/lib/constants';
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '@/components/shared/animate-on-scroll';
import { cn } from '@/lib/utils';

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200 hover:text-brand"
      >
        <span className="text-base font-medium text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 flex-shrink-0 text-foreground-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-foreground-muted leading-relaxed pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-brand uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-4 text-lg text-foreground-muted leading-relaxed">
            Everything you need to know about Suvadi.
          </p>
        </AnimateOnScroll>

        {/* FAQ Items */}
        <AnimateOnScroll delay={0.2} className="mt-12 mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-xs">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

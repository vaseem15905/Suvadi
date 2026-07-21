'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimateOnScroll } from '@/components/shared/animate-on-scroll';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(3, 'Subject required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSuccess(true);
    } catch {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="pt-24 pb-16 bg-background-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Get in <span className="gradient-text">touch</span>
            </h1>
            <p className="mt-4 text-lg text-foreground-muted">
              Have a question or want to discuss an enterprise plan? We&apos;d love to hear from you.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'hello@suvadi.com', href: 'mailto:hello@suvadi.com' },
                { icon: MessageSquare, label: 'Discord', value: 'Join community', href: '#' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href}
                  className="flex items-start gap-3 group">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-foreground-subtle">{label}</div>
                    <div className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">{value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              {success ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-surface p-8 text-center shadow-xs">
                  <CheckCircle className="h-12 w-12 text-success mx-auto" />
                  <h2 className="mt-4 text-xl font-semibold text-foreground">Message sent!</h2>
                  <p className="mt-2 text-sm text-foreground-muted">We&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                        <input id="contact-name" type="text" {...register('name')}
                          className={cn('w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors', errors.name ? 'border-error' : 'border-border')} />
                        {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                        <input id="contact-email" type="email" {...register('email')}
                          className={cn('w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors', errors.email ? 'border-error' : 'border-border')} />
                        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                      <input id="contact-subject" type="text" {...register('subject')}
                        className={cn('w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors', errors.subject ? 'border-error' : 'border-border')} />
                      {errors.subject && <p className="mt-1 text-xs text-error">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                      <textarea id="contact-message" rows={5} {...register('message')}
                        className={cn('w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none', errors.message ? 'border-error' : 'border-border')} />
                      {errors.message && <p className="mt-1 text-xs text-error">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isLoading}
                      className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60">
                      {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="h-4 w-4" />}
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, CheckCircle, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen bg-background selection:bg-brand/30">
      {/* Hero Section with subtle background pattern */}
      <div className="relative pt-32 pb-20 overflow-hidden">

        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Let's start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600">conversation</span>
            </h1>
            <p className="mt-6 text-lg text-foreground-muted leading-relaxed max-w-2xl mx-auto">
              Whether you have a question about features, trials, pricing, or need a demo, our team is ready to answer all your questions.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <section className="relative pb-24 -mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-8 items-start">
            
            {/* Left Column: Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <AnimateOnScroll variant="fadeInUp">
                <div className="rounded-3xl border border-border bg-surface/50 backdrop-blur-xl p-8 shadow-sm">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Contact Information</h3>
                  
                  <div className="space-y-8">
                    <a href="mailto:suvadi.app@gmail.com" className="group flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-muted mb-1">Email Us</p>
                        <p className="text-lg font-semibold text-foreground group-hover:text-brand transition-colors">suvadi.app@gmail.com</p>
                      </div>
                    </a>

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-surface border border-border text-foreground-muted">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-muted mb-1">Response Time</p>
                        <p className="text-lg font-semibold text-foreground">Within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-surface border border-border text-foreground-muted">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground-muted mb-1">Location</p>
                        <p className="text-lg font-semibold text-foreground">Global (Remote)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-purple-500/5 border border-brand/10">
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      "We are obsessed with providing the best support. Drop us a message and experience it yourself."
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-3">
              <AnimateOnScroll variant="fadeInUp" delay={0.1}>
                <div className="rounded-3xl border border-border bg-surface p-8 sm:p-10 shadow-xl relative overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/20 blur-[100px] rounded-full pointer-events-none" />
                  
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex flex-col items-center justify-center text-center py-12"
                      >
                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle className="h-10 w-10 text-success" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-3">Message Sent!</h2>
                        <p className="text-foreground-muted max-w-sm">
                          Thank you for reaching out. We have received your message and will get back to you shortly.
                        </p>
                        <button 
                          onClick={() => setSuccess(false)}
                          className="mt-8 text-brand font-medium hover:underline flex items-center gap-2"
                        >
                          Send another message <ArrowRight className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="text-2xl font-bold text-foreground mb-8">Send us a message</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label htmlFor="contact-name" className="text-sm font-semibold text-foreground">Your Name</label>
                              <input id="contact-name" type="text" placeholder="John Doe" {...register('name')}
                                className={cn(
                                  'w-full rounded-xl border bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-subtle',
                                  'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all duration-200',
                                  errors.name ? 'border-error ring-error/20 focus:ring-error/50' : 'border-border hover:border-foreground-subtle'
                                )} 
                              />
                              {errors.name && <p className="text-xs text-error font-medium">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="contact-email" className="text-sm font-semibold text-foreground">Email Address</label>
                              <input id="contact-email" type="email" placeholder="john@example.com" {...register('email')}
                                className={cn(
                                  'w-full rounded-xl border bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-subtle',
                                  'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all duration-200',
                                  errors.email ? 'border-error ring-error/20 focus:ring-error/50' : 'border-border hover:border-foreground-subtle'
                                )} 
                              />
                              {errors.email && <p className="text-xs text-error font-medium">{errors.email.message}</p>}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="contact-subject" className="text-sm font-semibold text-foreground">Subject</label>
                            <input id="contact-subject" type="text" placeholder="How can we help?" {...register('subject')}
                              className={cn(
                                'w-full rounded-xl border bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-subtle',
                                'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all duration-200',
                                errors.subject ? 'border-error ring-error/20 focus:ring-error/50' : 'border-border hover:border-foreground-subtle'
                              )} 
                            />
                            {errors.subject && <p className="text-xs text-error font-medium">{errors.subject.message}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor="contact-message" className="text-sm font-semibold text-foreground">Message</label>
                            <textarea id="contact-message" rows={6} placeholder="Tell us more about your inquiry..." {...register('message')}
                              className={cn(
                                'w-full rounded-xl border bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-subtle resize-none',
                                'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all duration-200',
                                errors.message ? 'border-error ring-error/20 focus:ring-error/50' : 'border-border hover:border-foreground-subtle'
                              )} 
                            />
                            {errors.message && <p className="text-xs text-error font-medium">{errors.message.message}</p>}
                          </div>
                          
                          <button type="submit" disabled={isLoading}
                            className={cn(
                              "group relative flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-lg shadow-brand/25",
                              "hover:bg-brand/90 hover:shadow-brand/40 transition-all active:scale-[0.98]",
                              "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-brand/25 overflow-hidden"
                            )}
                          >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative flex items-center gap-2">
                              {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <>
                                  Send Message <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </span>
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimateOnScroll>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

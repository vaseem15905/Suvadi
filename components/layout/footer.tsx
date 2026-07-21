import Link from 'next/link';
import { ExternalLink, MessageCircle, Briefcase, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Community', href: '#' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { label: 'Twitter / X', icon: MessageCircle, href: '#' },
  { label: 'GitHub', icon: ExternalLink, href: '#' },
  { label: 'LinkedIn', icon: Briefcase, href: '#' },
  { label: 'Email', icon: Mail, href: 'mailto:hello@suvadi.com' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-6 lg:py-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Logo size="md" showTagline />
            <p className="mt-4 max-w-xs text-sm text-foreground-muted leading-relaxed">
              The collaborative workspace for workshops, classrooms, conferences, and
              knowledge-sharing sessions.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
          <p className="text-xs text-foreground-subtle">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-foreground-subtle">
            Built with 💜 by <a href="https://vaseem.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Vaseem</a> & <a href="https://prasathdev.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Prasath</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

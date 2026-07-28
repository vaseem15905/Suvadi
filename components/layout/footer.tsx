import Link from 'next/link';
import { ExternalLink, MessageCircle, Briefcase, Mail } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { APP_NAME } from '@/lib/constants';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
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
            <p className="mt-4 max-w-xs text-sm text-foreground-muted leading-relaxed font-medium">
              Become Knowledge.
            </p>
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
            {/*Built with 💜 by <a href="https://vaseem.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Vaseem</a> & <a href="https://prasathdev.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Prasath</a>*/}
            Built with 💚 by <a href="https://vaseem.me" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Ben10</a> & <a href="https://prasathdev.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-medium">Sanji</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

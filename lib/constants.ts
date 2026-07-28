export const APP_NAME = 'Suvadi';
export const APP_NAME_TAMIL = 'சுவடி';
export const APP_TAGLINE = 'Where Conversations Become Knowledge.';
export const APP_DESCRIPTION =
  'Suvadi is a collaborative workspace for workshops, classrooms, conferences, bootcamps, corporate training, hackathons, and knowledge-sharing sessions.';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Docs', href: '/docs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export const FEATURES = [
  {
    title: 'Collaborative Notes',
    description: 'Real-time note-taking with rich text, markdown, and code blocks. Everyone stays on the same page.',
    icon: 'NotebookPen' as const,
  },
  {
    title: 'Interactive Whiteboard',
    description: 'Draw, diagram, and brainstorm together on a shared canvas with shapes, sticky notes, and connectors.',
    icon: 'PenTool' as const,
  },
  {
    title: 'Live Q&A',
    description: 'Participants ask questions, upvote the best ones, and hosts can pin, answer, or resolve them.',
    icon: 'MessageCircleQuestion' as const,
  },
  {
    title: 'Resource Sharing',
    description: 'Upload and share PDFs, presentations, code files, and more. Everything your session needs in one place.',
    icon: 'FolderOpen' as const,
  },
  {
    title: 'Instant Announcements',
    description: 'Broadcast important updates to all participants instantly. No one misses critical information.',
    icon: 'Megaphone' as const,
  },
  {
    title: 'Real-time Sync',
    description: 'Every change syncs instantly across all connected devices. See who\'s online and what they\'re doing.',
    icon: 'Zap' as const,
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Create a Session',
    description: 'Set up your workspace in seconds. Add a title, description, and choose your visibility settings.',
  },
  {
    step: 2,
    title: 'Invite Participants',
    description: 'Share a link or QR code. Participants join instantly — no sign-up required for public sessions.',
  },
  {
    step: 3,
    title: 'Collaborate Live',
    description: 'Use notes, whiteboard, Q&A, and resources together in real-time. Everything is saved automatically.',
  },
] as const;

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Suvadi with small groups.',
    features: [
      'Up to 3 active sessions',
      '10 participants per session',
      'Notes & Q&A',
      'Basic resource sharing',
      '100MB storage',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For educators, trainers, and teams who need more power.',
    features: [
      'Unlimited sessions',
      '100 participants per session',
      'All workspace features',
      'Whiteboard & Content Blocks',
      '10GB storage',
      'Custom branding',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per organization',
    description: 'For organizations that need scale, security, and control.',
    features: [
      'Everything in Pro',
      'Unlimited participants',
      'SSO & SAML',
      'Advanced analytics',
      'Unlimited storage',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
] as const;

export const TESTIMONIALS = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Professor, IIT Delhi',
    avatar: '',
    content: 'Suvadi transformed my lectures. Students engage more, ask better questions, and the real-time notes feature means no one falls behind.',
  },
  {
    name: 'Marcus Chen',
    role: 'Workshop Facilitator',
    avatar: '',
    content: 'I\'ve tried dozens of collaboration tools. Suvadi is the first one that feels like it was built specifically for workshops. The whiteboard alone is worth it.',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Head of Learning, TechCorp',
    avatar: '',
    content: 'We rolled out Suvadi for our entire training department. Onboarding time dropped 40% and trainer satisfaction scores are through the roof.',
  },
  {
    name: 'Raj Patel',
    role: 'Hackathon Organizer',
    avatar: '',
    content: 'Running hackathons with 200+ participants used to be chaos. Suvadi gives every team a dedicated workspace that just works.',
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: 'What is Suvadi?',
    answer: 'Suvadi is a real-time collaborative workspace designed for workshops, classrooms, conferences, bootcamps, and any knowledge-sharing session. It combines notes, whiteboard, Q&A, resource sharing, and announcements in one beautiful interface.',
  },
  {
    question: 'Do participants need to create an account?',
    answer: 'No! For public sessions, participants can join with just a link or QR code — no sign-up required. They get read-only access as guests. For full features like asking questions and downloading resources, a free account is recommended.',
  },
  {
    question: 'Is Suvadi free to use?',
    answer: 'Yes! Suvadi is completely free to use. You can create unlimited sessions, invite as many participants as you want, and access all features like notes, whiteboard, and Q&A without any restrictions.',
  },
  {
    question: 'How does real-time collaboration work?',
    answer: 'Suvadi uses Supabase Realtime to sync changes instantly across all connected devices. When someone adds a note, asks a question, or uploads a resource, everyone sees it immediately.',
  },
  {
    question: 'Can I use Suvadi for corporate training?',
    answer: 'Absolutely. Suvadi is perfect for corporate training, providing a fully real-time and interactive workspace that keeps trainees engaged and connected during sessions.',
  },
  {
    question: 'What file types can I upload?',
    answer: 'You can upload PDFs, PowerPoint presentations, images, ZIP archives, code files, and more to share resources seamlessly with all participants.',
  },
] as const;

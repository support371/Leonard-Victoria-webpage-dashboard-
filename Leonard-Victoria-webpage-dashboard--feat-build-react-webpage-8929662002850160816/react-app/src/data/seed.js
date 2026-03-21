export const ROLES = {
  LEONARD: 'leonard',
  VICTORIA: 'victoria',
  BERNARD: 'bernard',
  DEVELOPER: 'developer',
};

export const ROLE_CONFIG = {
  leonard: {
    label: 'Leonard M. Diana',
    title: 'Owner & Executive Director',
    initials: 'LD',
    color: 'from-amber-500 to-yellow-600',
    accent: 'amber',
    description: 'Owner Command — Full System Visibility',
  },
  victoria: {
    label: 'Victoria Eleanor',
    title: 'Operations Director',
    initials: 'VE',
    color: 'from-teal-500 to-emerald-600',
    accent: 'teal',
    description: 'Operations & Community Portal',
  },
  bernard: {
    label: 'Agent Bernard',
    title: 'Legal Counsel & Governance',
    initials: 'AB',
    color: 'from-indigo-500 to-purple-600',
    accent: 'indigo',
    description: 'Governance & Legal Records Portal',
  },
  developer: {
    label: 'Dev Portal',
    title: 'System Developer',
    initials: 'DV',
    color: 'from-slate-500 to-slate-700',
    accent: 'slate',
    description: 'Build & Technical Status',
  },
};

export const REPOSITORY_ITEMS = [
  { id: 1, name: 'IW Command Center Manifesto v2.1', category: 'Manifestos', owner: 'Leonard M. Diana', status: 'Active', updated: '2024-03-10', size: '2.4 MB', tags: ['foundational', 'strategy'] },
  { id: 2, name: 'PMA Operating Agreement — Final', category: 'PMA/FBO Documents', owner: 'Agent Bernard', status: 'Approved', updated: '2024-02-28', size: '1.8 MB', tags: ['legal', 'governance'] },
  { id: 3, name: 'FBO Formation Charter', category: 'PMA/FBO Documents', owner: 'Agent Bernard', status: 'Approved', updated: '2024-01-15', size: '3.1 MB', tags: ['legal', 'founding'] },
  { id: 4, name: 'Membership Agreement — Standard Tier', category: 'Membership Documents', owner: 'Victoria Eleanor', status: 'Active', updated: '2024-03-05', size: '0.9 MB', tags: ['membership', 'contract'] },
  { id: 5, name: 'Membership Agreement — Premium Tier', category: 'Membership Documents', owner: 'Victoria Eleanor', status: 'Active', updated: '2024-03-05', size: '1.1 MB', tags: ['membership', 'premium'] },
  { id: 6, name: 'Energy Healing Services Overview', category: 'Service Documents', owner: 'Victoria Eleanor', status: 'Active', updated: '2024-03-08', size: '1.6 MB', tags: ['services', 'healing'] },
  { id: 7, name: 'Wellness Education Curriculum v1', category: 'Service Documents', owner: 'Leonard M. Diana', status: 'Draft', updated: '2024-03-12', size: '4.2 MB', tags: ['education', 'wellness'] },
  { id: 8, name: 'GDPR Compliance Audit v4', category: 'Legal Records', owner: 'Agent Bernard', status: 'Approved', updated: '2024-02-20', size: '4.2 MB', tags: ['compliance', 'GDPR'] },
  { id: 9, name: 'Data Privacy Addendum — EU', category: 'Legal Records', owner: 'Agent Bernard', status: 'Approved', updated: '2024-01-30', size: '2.8 MB', tags: ['privacy', 'legal'] },
  { id: 10, name: 'Q1 2024 Strategic Report', category: 'Internal Notes', owner: 'Leonard M. Diana', status: 'Final', updated: '2024-03-15', size: '3.7 MB', tags: ['strategy', 'report'] },
  { id: 11, name: 'Platform Architecture v3', category: 'Technical References', owner: 'Dev Team', status: 'Active', updated: '2024-03-14', size: '6.1 MB', tags: ['technical', 'architecture'] },
  { id: 12, name: 'Brand Identity System', category: 'Brand Assets', owner: 'Design Team', status: 'Final', updated: '2024-02-10', size: '48.3 MB', tags: ['brand', 'design'] },
];

export const REVIEW_QUEUE = [
  { id: 1, title: 'PMA Membership Clause Amendment', type: 'Legal', priority: 'high', status: 'Pending Review', owner: 'Agent Bernard', due: '2024-03-20', flagged: true },
  { id: 2, title: 'Q2 Service Pricing Update', type: 'Operations', priority: 'medium', status: 'Draft', owner: 'Victoria Eleanor', due: '2024-03-25', flagged: false },
  { id: 3, title: 'Spiritual Coaching Program Outline', type: 'Service', priority: 'medium', status: 'In Review', owner: 'Leonard M. Diana', due: '2024-03-22', flagged: false },
  { id: 4, title: 'Platform Deployment Sign-off', type: 'Technical', priority: 'high', status: 'Pending Approval', owner: 'Dev Team', due: '2024-03-18', flagged: true },
  { id: 5, title: 'Membership Onboarding Flow Update', type: 'Operations', priority: 'low', status: 'Draft', owner: 'Victoria Eleanor', due: '2024-04-01', flagged: false },
  { id: 6, title: 'FBO Annual Compliance Review', type: 'Legal', priority: 'high', status: 'Action Required', owner: 'Agent Bernard', due: '2024-03-16', flagged: true },
];

export const ACTIVITY_LOG = [
  { id: 1, user: 'Leonard M. Diana', action: 'Approved Strategic Report Q1 2024', module: 'Repository', time: '12 min ago', type: 'approve' },
  { id: 2, user: 'Agent Bernard', action: 'Flagged PMA Amendment for urgent review', module: 'Review Center', time: '1 hour ago', type: 'flag' },
  { id: 3, user: 'Victoria Eleanor', action: 'Uploaded Membership Agreement v3', module: 'Repository', time: '2 hours ago', type: 'upload' },
  { id: 4, user: 'Dev Team', action: 'Pushed Platform Architecture v3 update', module: 'Technical', time: '3 hours ago', type: 'deploy' },
  { id: 5, user: 'Leonard M. Diana', action: 'Reviewed FBO Compliance checklist', module: 'Legal Status', time: 'Yesterday', type: 'review' },
  { id: 6, user: 'Agent Bernard', action: 'Completed GDPR Audit v4 approval', module: 'Legal Records', time: 'Yesterday', type: 'approve' },
  { id: 7, user: 'Victoria Eleanor', action: 'Created March Community Event', module: 'Events', time: '2 days ago', type: 'create' },
  { id: 8, user: 'Dev Team', action: 'Deployed dashboard shell v2 to staging', module: 'Technical', time: '2 days ago', type: 'deploy' },
];

export const COMPLIANCE_ITEMS = [
  { id: 1, area: 'GDPR Compliance', status: 'Compliant', lastReviewed: 'Feb 20, 2024', nextDue: 'Aug 20, 2024', owner: 'Bernard', severity: 'low', notes: 'Full audit completed.' },
  { id: 2, area: 'PMA Operating Agreement', status: 'Compliant', lastReviewed: 'Feb 28, 2024', nextDue: 'Feb 28, 2025', owner: 'Bernard', severity: 'low', notes: 'All parties signed.' },
  { id: 3, area: 'FBO Annual Filing', status: 'Action Required', lastReviewed: 'Jan 15, 2024', nextDue: 'Mar 16, 2024', owner: 'Bernard', severity: 'high', notes: 'Annual review overdue.' },
  { id: 4, area: 'Membership Terms Review', status: 'In Review', lastReviewed: 'Mar 5, 2024', nextDue: 'Mar 25, 2024', owner: 'Bernard', severity: 'medium', notes: 'Section 4.2 revision in progress.' },
  { id: 5, area: 'Data Privacy Addendum', status: 'Compliant', lastReviewed: 'Jan 30, 2024', nextDue: 'Jul 30, 2024', owner: 'Bernard', severity: 'low', notes: 'EU addendum signed.' },
  { id: 6, area: 'SOC 2 Security Audit', status: 'In Review', lastReviewed: 'Mar 10, 2024', nextDue: 'Apr 15, 2024', owner: 'Dev Team', severity: 'medium', notes: 'External auditor engaged.' },
];

export const SYSTEM_MODULES = [
  { name: 'Dashboard Shell', path: '/dashboard', status: 'live', version: 'v2.1', last: '2024-03-14' },
  { name: 'Leonard Portal', path: '/dashboard/leonard', status: 'live', version: 'v1.4', last: '2024-03-14' },
  { name: 'Victoria Portal', path: '/dashboard/victoria', status: 'live', version: 'v1.2', last: '2024-03-13' },
  { name: 'Bernard Portal', path: '/dashboard/bernard', status: 'live', version: 'v1.1', last: '2024-03-12' },
  { name: 'Developer Portal', path: '/dashboard/developer', status: 'live', version: 'v1.0', last: '2024-03-14' },
  { name: 'Central Repository', path: '/dashboard/repository', status: 'live', version: 'v2.0', last: '2024-03-11' },
  { name: 'Review Center', path: '/dashboard/reviews', status: 'live', version: 'v1.3', last: '2024-03-10' },
  { name: 'Live Preview', path: '/dashboard/preview', status: 'live', version: 'v1.0', last: '2024-03-09' },
  { name: 'Live Structure', path: '/dashboard/structure', status: 'live', version: 'v1.0', last: '2024-03-09' },
  { name: 'Live Status', path: '/dashboard/status', status: 'live', version: 'v1.0', last: '2024-03-09' },
  { name: 'Public Website', path: '/', status: 'live', version: 'v1.5', last: '2024-03-13' },
  { name: 'Auth Layer', path: '/auth', status: 'scaffolded', version: 'v0.1', last: '2024-03-08' },
];

export const EVENTS = [
  { id: 1, title: 'Monthly Healing Circle', date: 'Mar 21, 2024', time: '7:00 PM EST', type: 'Community', attendees: 48, status: 'Upcoming' },
  { id: 2, title: 'Strategic Wealth Alignment Webinar', date: 'Mar 26, 2024', time: '6:00 PM EST', type: 'Education', attendees: 120, status: 'Upcoming' },
  { id: 3, title: 'New Member Onboarding Session', date: 'Apr 2, 2024', time: '5:00 PM EST', type: 'Membership', attendees: 22, status: 'Scheduled' },
  { id: 4, title: 'Faith and Finances Workshop', date: 'Apr 10, 2024', time: '6:30 PM EST', type: 'Education', attendees: 65, status: 'Scheduled' },
  { id: 5, title: 'Leadership Roundtable — Q2 Planning', date: 'Apr 15, 2024', time: '3:00 PM EST', type: 'Internal', attendees: 6, status: 'Scheduled' },
];

export const SERVICES = [
  {
    id: 1,
    category: 'Energy Healing Services',
    icon: '✦',
    overview: 'Transformative healing modalities grounded in faith, intention, and energetic alignment.',
    offerings: ['One-on-One Energy Sessions', 'Group Distance Healing', 'Chakra Alignment Programs', 'Trauma Release Facilitation'],
    audience: 'Individuals seeking holistic restoration, emotional release, and spiritual renewal.',
    outcomes: 'Restored energetic balance, emotional clarity, and deepened spiritual connection.',
    cta: 'Book a Session',
  },
  {
    id: 2,
    category: 'Wellness Education',
    icon: '◈',
    overview: 'Structured learning experiences that integrate science, spirituality, and practical wellness strategies.',
    offerings: ['Holistic Health Curriculum', 'Nutrition & Intentional Living', 'Mind-Body Integration Courses', 'Live Workshops & Webinars'],
    audience: 'Wellness seekers, practitioners, and community educators.',
    outcomes: 'Sustainable health habits, expanded wellness knowledge, and practitioner-grade skills.',
    cta: 'Explore Courses',
  },
  {
    id: 3,
    category: 'Personal Development & Coaching',
    icon: '◉',
    overview: 'Executive-grade coaching rooted in purpose, identity, and intentional growth.',
    offerings: ['1:1 Coaching Engagements', 'Purpose & Identity Mapping', 'High-Performance Accountability', 'Faith-Based Leadership Development'],
    audience: 'Entrepreneurs, leaders, and purpose-driven individuals ready for transformation.',
    outcomes: 'Clarity of vision, accelerated personal growth, and aligned decision-making.',
    cta: 'Start Coaching',
  },
  {
    id: 4,
    category: 'Faith-Based Private Membership',
    icon: '◇',
    overview: 'A structured private membership association protecting and elevating member freedom and sovereignty.',
    offerings: ['PMA Member Rights & Protections', 'Private Community Access', 'Exclusive Member Resources', 'Annual Member Summits'],
    audience: 'Those seeking protected membership, community, and faith-aligned operational freedom.',
    outcomes: 'Legal protection, exclusive access, and community belonging.',
    cta: 'Join Membership',
  },
  {
    id: 5,
    category: 'Strategic Wealth & Real-Estate Alignment',
    icon: '◈',
    overview: 'Spiritually grounded real-estate consulting and wealth alignment for conscious investors.',
    offerings: ['Wealth Alignment Assessments', 'Real-Estate Investment Consulting', 'Portfolio Intention Setting', 'Abundance Mindset Programs'],
    audience: 'Faith-based investors, entrepreneurs, and families building generational wealth.',
    outcomes: 'Aligned financial strategy, reduced decision friction, and confident wealth stewardship.',
    cta: 'Book Consultation',
  },
  {
    id: 6,
    category: 'Community & Events',
    icon: '◎',
    overview: 'A thriving, intentional global community connected by shared values, purpose, and practice.',
    offerings: ['Monthly Healing Circles', 'Online & In-Person Retreats', 'Member Networking Events', 'Community Resource Library'],
    audience: 'Members, practitioners, and aligned community partners globally.',
    outcomes: 'Deep belonging, peer support, and access to a global network of purpose-driven individuals.',
    cta: 'Join Community',
  },
];

export const MEMBERSHIP_TIERS = [
  {
    name: 'Foundation',
    price: '$97',
    period: '/month',
    description: 'Begin your journey with foundational access to community, resources, and healing support.',
    features: ['Community Forum Access', 'Monthly Healing Circle', 'Digital Resource Library', 'Member Newsletter', 'Welcome Orientation Session'],
    cta: 'Join Foundation',
    highlight: false,
  },
  {
    name: 'Elevated',
    price: '$247',
    period: '/month',
    description: 'Deepen your practice with expanded access to courses, coaching, and premium content.',
    features: ['Everything in Foundation', 'Unlimited Course Access', 'Monthly Group Coaching Call', '2 Private Coaching Sessions/yr', 'Priority Event Access', 'PMA Member Protections'],
    cta: 'Join Elevated',
    highlight: true,
  },
  {
    name: 'Sovereign',
    price: '$597',
    period: '/month',
    description: 'The full executive experience — maximum access, private counsel, and strategic partnership.',
    features: ['Everything in Elevated', 'Monthly 1:1 with Leonard', 'Wealth Alignment Consulting', 'VIP Event Access & Retreats', 'Strategic Partnership Pathway', 'Direct Leadership Access'],
    cta: 'Apply for Sovereign',
    highlight: false,
  },
];

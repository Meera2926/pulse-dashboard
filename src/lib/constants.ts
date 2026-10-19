export const CHANNELS = ['Email', 'Social', 'Ads', 'Referral', 'Organic', 'SMS'] as const;
export type Channel = (typeof CHANNELS)[number];

export const EVENT_TYPES = ['Sign-up', 'Purchase', 'Feedback', 'Churn Risk', 'Upsell'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const NAMES = ['Alex', 'Jordan', 'Sam', 'Morgan', 'Casey', 'Riley', 'Drew', 'Quinn', 'Blake', 'Avery', 'Chris', 'Dana'];
export const PRODUCTS = ['Pro Plan', 'Starter Kit', 'Enterprise', 'Add-on Pack', 'Annual Renewal', 'Growth Bundle'];
export const FEEDBACKS = ["Loved the UX!", "Could improve onboarding", "5 stars!", "Feature request sent", "Very satisfied", "Best tool I've used"];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CHANNEL_HEX: Record<Channel, string> = {
  Email:    '#4f8eff',
  Social:   '#a855f7',
  Ads:      '#fb923c',
  Referral: '#22d3a5',
  Organic:  '#06b6d4',
  SMS:      '#f472b6',
};

export const TYPE_HEX: Record<EventType, string> = {
  'Sign-up':    '#4f8eff',
  'Purchase':   '#22d3a5',
  'Feedback':   '#a855f7',
  'Churn Risk': '#fb923c',
  'Upsell':     '#06b6d4',
};

export const TYPE_ICONS: Record<EventType, string> = {
  'Sign-up':    '👤',
  'Purchase':   '💰',
  'Feedback':   '💬',
  'Churn Risk': '⚠️',
  'Upsell':     '🚀',
};

export const DEMO_USER = { email: 'admin@pulse.io', password: 'password123', name: 'Meera K.', role: 'Admin' };

export const NAV_ITEMS = [
  { href: '/',          label: 'Overview',   icon: '🏠' },
  { href: '/events',    label: 'Live Events', icon: '⚡' },
  { href: '/channels',  label: 'Channels',   icon: '📡' },
  { href: '/demand',    label: 'Demand',     icon: '📈' },
  { href: '/customers', label: 'Customers',  icon: '👥' },
  { href: '/heatmap',   label: 'Heatmap',    icon: '🔥' },
  { href: '/settings',  label: 'Settings',   icon: '⚙️' },
];

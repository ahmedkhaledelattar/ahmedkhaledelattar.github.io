import { PROFILE } from './profile';

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  displayValue: string;
  icon: 'linkedin' | 'whatsapp' | 'qr' | 'email';
  external?: boolean;
}

export type SocialItem = SocialLink;

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: PROFILE.linkedin,
    displayValue: 'linkedin.com/in/ahmed-elattar-71026b321',
    icon: 'linkedin',
    external: true,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: PROFILE.whatsappPrimary,
    displayValue: '+20 109 220 5396',
    icon: 'whatsapp',
    external: true,
  },
  {
    id: 'whatsapp-qr',
    label: 'WhatsApp QR',
    href: PROFILE.whatsappQr,
    displayValue: 'wa.me/qr/7VIGDRELSZRHG1',
    icon: 'qr',
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    href: PROFILE.emailHref,
    displayValue: PROFILE.email,
    icon: 'email',
    external: false,
  },
];

export const FOOTER_NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#service' },
  { label: 'Work', href: '#project' },
  { label: 'Archive', href: '#showcase' },
  { label: 'Contact', href: '#contact' },
] as const;

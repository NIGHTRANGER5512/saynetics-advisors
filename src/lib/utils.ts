import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cardData = [
  {
    id: 1,
    title: 'AI Cinematic Videography',
    description: 'Photorealistic, AI-generated property films and walkthroughs, created from your photos with no film crew or location delays. We turn your listing into a cinematic video tour buyers fall in love with before they ever visit.',
    tag: 'Most Popular',
    src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    link: '#contact',
    color: '#C55221',
    textColor: 'white',
    iconType: 'video',
  },
  {
    id: 2,
    title: 'AR Property Viewer',
    description: 'Let buyers walk through your property from their phone before leaving home. Our AR viewer is built to cut wasted site visits and pre-qualify serious buyers automatically.',
    tag: 'Cutting Edge',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    link: '#contact',
    color: '#CC8800',
    textColor: 'white',
    iconType: 'home',
  },
  {
    id: 3,
    title: 'Virtual Staging',
    description: 'Transform bare spaces into beautifully styled interiors with AI-powered virtual staging. Buyers see the full potential of every room without costly physical staging or delays.',
    tag: '48hr Delivery',
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop',
    link: '#contact',
    color: '#C55221',
    textColor: 'white',
    iconType: 'staging',
  },
  {
    id: 4,
    title: 'Automated Follow-up',
    description: 'Never lose a lead to slow follow-up again. Our AI sends personalised WhatsApp and email messages within minutes of every enquiry, nurturing prospects 24/7 on full autopilot.',
    tag: 'AI-Powered',
    src: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=1200&auto=format&fit=crop',
    link: '#contact',
    color: '#CC8800',
    textColor: 'white',
    iconType: 'chat',
  },
  {
    id: 5,
    title: 'Agent Website Development',
    description: 'Premium, mobile-first websites for agents and developers, with lead capture, property listings, and WhatsApp integration built in from day one.',
    tag: 'Custom Built',
    src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    link: '#contact',
    color: '#C55221',
    textColor: 'white',
    iconType: 'web',
  },
]

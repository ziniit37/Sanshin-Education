import type { SiteContent } from '@/lib/types'

export const CONTENT_DEFAULTS: Omit<SiteContent, 'id'>[] = [
  { key: 'brand.name', value: 'Sanshin Education', group: 'brand', label: 'Brand name' },
  { key: 'brand.tagline', value: 'Your pathway to studying in South Korea', group: 'brand', label: 'Tagline' },
  { key: 'contact.phone', value: '+82-00-0000-0000', group: 'contact', label: 'Phone' },
  { key: 'contact.email', value: 'hello@sanshin.education', group: 'contact', label: 'Email' },
  { key: 'contact.address', value: 'Seoul, South Korea (address placeholder)', group: 'contact', label: 'Address' },
  { key: 'contact.hours', value: 'Mon–Fri 9:00–18:00 KST', group: 'contact', label: 'Office hours' },
  { key: 'social.facebook', value: '#', group: 'social', label: 'Facebook URL' },
  { key: 'social.instagram', value: '#', group: 'social', label: 'Instagram URL' },
  { key: 'social.linkedin', value: '#', group: 'social', label: 'LinkedIn URL' },
  { key: 'social.youtube', value: '#', group: 'social', label: 'YouTube URL' },
  { key: 'stats.students_placed', value: '500+', group: 'stats', label: 'Students placed' },
  { key: 'stats.universities', value: '40+', group: 'stats', label: 'Partner universities' },
  { key: 'stats.visa_success', value: '98%', group: 'stats', label: 'Visa success rate' },
  { key: 'stats.years', value: '8', group: 'stats', label: 'Years of guidance' },
  {
    key: 'home.hero_headline',
    value: 'Study in South Korea with a team that stays with you.',
    group: 'home',
    label: 'Hero headline',
  },
  {
    key: 'home.hero_subheadline',
    value:
      'Sanshin Education guides international students from first inquiry to enrollment — universities, scholarships, visas, and life in Korea.',
    group: 'home',
    label: 'Hero subheadline',
  },
  {
    key: 'home.korea_highlight',
    value:
      'South Korea offers globally ranked universities, generous scholarships, and a launchpad into East Asian careers — with English-taught degrees across Seoul, Daejeon, and beyond.',
    group: 'home',
    label: 'Korea highlight',
  },
  {
    key: 'about.story',
    value:
      'Sanshin Education was founded to make Korean higher education accessible to ambitious students worldwide. We combine local admissions knowledge with one-to-one counseling so every application is honest, complete, and on time.',
    group: 'about',
    label: 'Our story',
  },
  {
    key: 'about.mission',
    value: 'Help every student find a Korean university and program that fits their goals, budget, and timeline.',
    group: 'about',
    label: 'Mission',
  },
  {
    key: 'about.vision',
    value: 'Become the most trusted Korea-only study pathway for international families.',
    group: 'about',
    label: 'Vision',
  },
  {
    key: 'about.values',
    value: 'Clarity, care, and accountability. We never oversell a ranking or hide a deadline.',
    group: 'about',
    label: 'Values',
  },
  {
    key: 'legal.privacy',
    value:
      '<h2>Privacy Policy</h2><p>This is placeholder legal copy. Edit it from the admin Website Content panel before publishing. We collect only the information needed to counsel students on South Korea admissions.</p>',
    group: 'legal',
    label: 'Privacy policy',
  },
  {
    key: 'legal.terms',
    value:
      '<h2>Terms of Service</h2><p>This is placeholder legal copy. Counseling does not guarantee admission, scholarships, or visas. University and immigration decisions remain with the relevant authorities.</p>',
    group: 'legal',
    label: 'Terms of service',
  },
]

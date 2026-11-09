import type { SiteContent } from '@/lib/types'

export const DEFAULT_CONTACT_PHONE = '+82 10-2185-8650'

export const CONTENT_DEFAULTS: Omit<SiteContent, 'id'>[] = [
  { key: 'brand.name', value: 'Sanshin Global Education', group: 'brand', label: 'Brand name' },
  { key: 'brand.tagline', value: 'Your pathway to studying in South Korea', group: 'brand', label: 'Tagline' },
  { key: 'contact.phone', value: DEFAULT_CONTACT_PHONE, group: 'contact', label: 'Phone' },
  { key: 'contact.email', value: '', group: 'contact', label: 'Email' },
  { key: 'contact.address', value: '', group: 'contact', label: 'Address' },
  { key: 'contact.hours', value: '', group: 'contact', label: 'Office hours' },
  { key: 'social.facebook', value: '', group: 'social', label: 'Facebook URL' },
  { key: 'social.instagram', value: '', group: 'social', label: 'Instagram URL' },
  { key: 'social.linkedin', value: '', group: 'social', label: 'LinkedIn URL' },
  { key: 'social.youtube', value: '', group: 'social', label: 'YouTube URL' },
  { key: 'stats.students_placed', value: '', group: 'stats', label: 'Students placed' },
  { key: 'stats.universities', value: '', group: 'stats', label: 'Partner universities' },
  { key: 'stats.visa_success', value: '', group: 'stats', label: 'Visa success rate' },
  { key: 'stats.years', value: '', group: 'stats', label: 'Years of guidance' },
  {
    key: 'home.hero_headline',
    value: 'Study in South Korea with a team that stays with you.',
    group: 'home',
    label: 'Hero headline',
  },
  {
    key: 'home.hero_subheadline',
    value:
      'Sanshin Global Education guides international students from first inquiry to enrollment — universities, scholarships, visas, and life in Korea.',
    group: 'home',
    label: 'Hero subheadline',
  },
  {
    key: 'home.korea_highlight',
    value:
      'South Korea offers a range of universities and programs. Program availability, language of instruction, admissions requirements, and funding differ by institution and should be checked against current official information.',
    group: 'home',
    label: 'Korea highlight',
  },
  {
    key: 'about.story',
    value:
      'Sanshin Global Education focuses on helping international students understand study options in South Korea. This site provides information about admissions, funding, and preparation; students should confirm current requirements with each institution and relevant authority.',
    group: 'about',
    label: 'Our story',
  },
  {
    key: 'about.mission',
    value: 'Help students compare Korean study pathways and understand the steps involved in applying.',
    group: 'about',
    label: 'Mission',
  },
  {
    key: 'about.vision',
    value: 'Provide clear, student-centered information about higher education in South Korea.',
    group: 'about',
    label: 'Vision',
  },
  {
    key: 'about.values',
    value: 'Clarity, careful research, and transparent communication.',
    group: 'about',
    label: 'Values',
  },
  {
    key: 'legal.privacy',
    value:
      '<p><strong>Draft for business and legal review. Do not publish as a finalized policy.</strong></p><h2>Information submitted through this website</h2><p>Inquiry forms may request your name, email address, country of residence, study interests, and other information you choose to provide. The information is sent to the business by email through its configured email service so it can respond to your request. Do not include sensitive personal information in a form.</p><h2>Use and retention</h2><p>Information should be used only to respond to your inquiry and provide services you request. The business owner must specify and follow a retention period, access controls, and a process for deletion before this draft is published.</p><h2>Your choices and contact</h2><p>For a request to access, correct, or delete information, contact the business using contact details that have been verified and published on this site. This draft must be reviewed for applicable privacy requirements, including Korea’s Personal Information Protection Act where relevant.</p>',
    group: 'legal',
    label: 'Privacy policy',
  },
  {
    key: 'legal.terms',
    value:
      '<p><strong>Draft for business and legal review. Do not publish as finalized legal terms.</strong></p><h2>Information and guidance</h2><p>Website information is general and may change. Confirm program requirements, fees, deadlines, scholarship terms, and immigration rules with the relevant official institution or authority before acting.</p><h2>No decision guarantees</h2><p>Sanshin Global Education cannot guarantee admission, scholarships, employment, or visa approval. Decisions are made by universities, scholarship providers, employers, and government authorities.</p><h2>Business review required</h2><p>The business owner must add verified service terms, fees, cancellation and refund terms, governing law, and business contact details before publishing this page.</p>',
    group: 'legal',
    label: 'Terms of service',
  },
]

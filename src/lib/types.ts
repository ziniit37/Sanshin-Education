export type Role = 'admin' | 'super_admin' | 'student' | 'counselor' | 'user'

export type LeadStage =
  | 'new_lead'
  | 'contacted'
  | 'counseling_scheduled'
  | 'counseled'
  | 'documents_requested'
  | 'university_shortlisted'
  | 'application_started'
  | 'applicant'
  | 'enrolled'
  | 'lost_inactive'

export type ApplicationStatus =
  | 'profile_created'
  | 'documents_uploaded'
  | 'documents_verified'
  | 'university_shortlisted'
  | 'application_in_progress'
  | 'application_submitted'
  | 'under_review'
  | 'offer_received'
  | 'deposit_paid'
  | 'visa_preparation'
  | 'visa_submitted'
  | 'visa_approved'
  | 'pre_departure'
  | 'enrolled'

export type DocumentCategory =
  | 'passport'
  | 'transcript'
  | 'certificate'
  | 'english_score'
  | 'cv'
  | 'sop'
  | 'recommendation_letter'
  | 'financial'
  | 'offer_letter'
  | 'visa'
  | 'other'

export type DocumentStatus = 'uploaded' | 'under_review' | 'revision_required' | 'approved'
export type AppointmentType = 'online' | 'phone' | 'in_person'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type ScholarshipStatus = 'open' | 'closing_soon' | 'upcoming' | 'closed'
export type BlogUpdateType =
  | 'general'
  | 'scholarship_alert'
  | 'visa_update'
  | 'application_deadline'
  | 'university_update'

export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: Role
  emailVerified: boolean
  avatarUrl?: string
  createdAt: string
  googleId?: string
}

export interface StudentProfile {
  id: string
  userId: string
  counselorId?: string
  nationality: string
  dateOfBirth?: string
  phone?: string
  educationLevel: string
  gpa?: string
  englishScore?: string
  intendedIntake?: string
  budgetRange?: string
  notes?: string
  createdAt: string
}

export interface CounselorProfile {
  id: string
  userId: string
  title: string
  specialties: string
  bio: string
  languages: string
  createdAt: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  nationality?: string
  educationLevel?: string
  intendedIntake?: string
  message?: string
  stage: LeadStage
  leadSource: string
  counselorId?: string
  userId?: string
  createdAt: string
}

export interface Application {
  id: string
  studentId: string
  universityId: string
  programId: string
  status: ApplicationStatus
  intake: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface DocumentRecord {
  id: string
  studentId: string
  applicationId?: string
  category: DocumentCategory
  status: DocumentStatus
  fileName: string
  fileType: string
  fileSize: number
  dataUrl: string
  reviewNote?: string
  createdAt: string
}

export interface Appointment {
  id: string
  name: string
  email: string
  phone: string
  type: AppointmentType
  status: AppointmentStatus
  scheduledAt: string
  notes?: string
  studentId?: string
  counselorId?: string
  leadId?: string
  createdAt: string
}

export interface Message {
  id: string
  studentId: string
  counselorId: string
  senderId: string
  body: string
  createdAt: string
  readAt?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  href?: string
  read: boolean
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  completed: boolean
  assigneeId?: string
  studentId?: string
  createdAt: string
}

export interface Country {
  id: string
  name: string
  slug: string
  heroImage: string
  overview: string
  universitiesCount: number
  intakes: string
  tuitionRange: string
  livingCosts: string
  visaOverview: string
  workDuringStudy: string
  postStudy: string
  featured: boolean
}

export interface University {
  id: string
  countryId: string
  name: string
  slug: string
  city: string
  ranking: string
  image: string
  overview: string
  requirements: string
  tuitionRange: string
  deadlines: string
  intakes: string
  campus: string
  featured: boolean
}

export interface Program {
  id: string
  universityId: string
  name: string
  slug: string
  degree: string
  subject: string
  duration: string
  tuition: string
  requirements: string
  careerOutcomes: string
  deadlines: string
  intake: string
  featured: boolean
}

export interface Scholarship {
  id: string
  name: string
  slug: string
  universityId?: string
  status: ScholarshipStatus
  amount: string
  deadline: string
  overview: string
  eligibility: string
  coverage: string
}

export interface Service {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  whoItsFor: string
  included: string
  process: string
  faqs: string
  icon: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  university: string
  image: string
}

export interface SuccessStory {
  id: string
  studentName: string
  slug: string
  university: string
  program: string
  year: string
  image: string
  excerpt: string
  body: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  coverImage: string
  updateType: BlogUpdateType
  publishedAt: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  order: number
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export interface NewsletterSubscriber {
  id: string
  email: string
  createdAt: string
}

export interface SiteContent {
  id: string
  key: string
  value: string
  group: string
  label: string
}

export interface AuthMeta {
  otps: { email: string; code: string; expiresAt: number }[]
  resetTokens: { email: string; token: string; expiresAt: number }[]
}

export interface Database {
  users: User[]
  studentProfiles: StudentProfile[]
  counselorProfiles: CounselorProfile[]
  leads: Lead[]
  applications: Application[]
  documents: DocumentRecord[]
  appointments: Appointment[]
  messages: Message[]
  notifications: Notification[]
  tasks: Task[]
  countries: Country[]
  universities: University[]
  programs: Program[]
  scholarships: Scholarship[]
  services: Service[]
  testimonials: Testimonial[]
  successStories: SuccessStory[]
  blogPosts: BlogPost[]
  faqs: FAQ[]
  teamMembers: TeamMember[]
  contactMessages: ContactMessage[]
  newsletterSubscribers: NewsletterSubscriber[]
  siteContent: SiteContent[]
  authMeta: AuthMeta
}

export type CollectionName = Exclude<keyof Database, 'authMeta'>

export const LEAD_STAGES: LeadStage[] = [
  'new_lead',
  'contacted',
  'counseling_scheduled',
  'counseled',
  'documents_requested',
  'university_shortlisted',
  'application_started',
  'applicant',
  'enrolled',
  'lost_inactive',
]

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'profile_created',
  'documents_uploaded',
  'documents_verified',
  'university_shortlisted',
  'application_in_progress',
  'application_submitted',
  'under_review',
  'offer_received',
  'deposit_paid',
  'visa_preparation',
  'visa_submitted',
  'visa_approved',
  'pre_departure',
  'enrolled',
]

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'passport',
  'transcript',
  'certificate',
  'english_score',
  'cv',
  'sop',
  'recommendation_letter',
  'financial',
  'offer_letter',
  'visa',
  'other',
]

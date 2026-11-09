export type Intake = 'Spring' | 'Fall'
export type StudyLevel = "Bachelor's" | "Master's / Graduate"
export type AdmissionStatus = 'Open' | 'Upcoming' | 'Closed' | 'To Be Announced'

export interface AdmissionCycle {
  id: string
  university: string
  location: string
  academicYear: number
  intake: Intake
  studyLevel: StudyLevel
  admissionRoute: string
  language: string
  subject: string
  applicationOpens: string | null
  applicationCloses: string | null
  deadlineTime?: string
  documentDeadline?: string
  interviews?: string
  results?: string
  enrollment?: string
  tentative?: boolean
  officialUrl: string
  lastVerified: string
  notes?: string
}

export const ADMISSION_CYCLES: AdmissionCycle[] = [
  {
    id: 'seoultech-2027-spring-undergraduate-round-1',
    university: 'Seoul National University of Science and Technology (SeoulTech)',
    location: 'Seoul',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Bachelor's",
    admissionRoute: 'International undergraduate',
    language: 'Not specified in notice',
    subject: 'All eligible undergraduate fields',
    applicationOpens: '2026-09-07',
    applicationCloses: '2026-10-02',
    deadlineTime: '17:00 KST',
    officialUrl: 'https://global.seoultech.ac.kr/notice/notice?bidx=895056&bnum=58432&do=commonview',
    lastVerified: '2026-11-09',
    notes: 'The first round has closed. Check the official notice for the separate conditional admission routes and their own criteria.',
  },
  {
    id: 'seoultech-2027-spring-undergraduate-round-2',
    university: 'Seoul National University of Science and Technology (SeoulTech)',
    location: 'Seoul',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Bachelor's",
    admissionRoute: 'International undergraduate',
    language: 'Not specified in notice',
    subject: 'All eligible undergraduate fields',
    applicationOpens: '2026-11-09',
    applicationCloses: '2026-11-18',
    deadlineTime: '17:00 KST',
    officialUrl: 'https://global.seoultech.ac.kr/notice/notice?bidx=895056&bnum=58432&do=commonview',
    lastVerified: '2026-11-09',
    notes: 'The official notice lists the deadline as 17:00 KST. Confirm current application availability on SeoulTech’s portal before applying.',
  },
  {
    id: 'ajou-gsis-2027-spring-round-1',
    university: 'Ajou University — Graduate School of International Studies',
    location: 'Suwon',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Master's / Graduate",
    admissionRoute: 'Graduate',
    language: 'Check the current program guide',
    subject: 'International studies',
    applicationOpens: '2026-10-12',
    applicationCloses: '2026-10-30',
    interviews: 'November 16–20, 2026',
    results: 'November 30–December 4, 2026',
    enrollment: 'January 4–8, 2027',
    tentative: true,
    officialUrl: 'https://gsis.ajou.ac.kr/gsis/admissions/procedures.do',
    lastVerified: '2026-11-09',
    notes: 'Ajou states that its 2027 schedule is tentative and subject to change.',
  },
  {
    id: 'ajou-gsis-2027-spring-round-2',
    university: 'Ajou University — Graduate School of International Studies',
    location: 'Suwon',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Master's / Graduate",
    admissionRoute: 'Graduate',
    language: 'Check the current program guide',
    subject: 'International studies',
    applicationOpens: '2026-11-02',
    applicationCloses: '2026-11-20',
    interviews: 'December 7–11, 2026',
    results: 'December 21–25, 2026',
    enrollment: 'January 11–15, 2027',
    tentative: true,
    officialUrl: 'https://gsis.ajou.ac.kr/gsis/admissions/procedures.do',
    lastVerified: '2026-11-09',
    notes: 'Ajou states that its 2027 schedule is tentative and subject to change.',
  },
  {
    id: 'ajou-gsis-2027-spring-round-3',
    university: 'Ajou University — Graduate School of International Studies',
    location: 'Suwon',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Master's / Graduate",
    admissionRoute: 'Graduate',
    language: 'Check the current program guide',
    subject: 'International studies',
    applicationOpens: '2026-11-23',
    applicationCloses: '2026-12-18',
    interviews: 'January 4–8, 2027',
    results: 'January 18–22, 2027',
    enrollment: 'January 25–29, 2027',
    tentative: true,
    officialUrl: 'https://gsis.ajou.ac.kr/gsis/admissions/procedures.do',
    lastVerified: '2026-11-09',
    notes: 'Ajou states that its 2027 schedule is tentative and subject to change.',
  },
  {
    id: 'ajou-gsis-2027-fall-round-1',
    university: 'Ajou University — Graduate School of International Studies',
    location: 'Suwon',
    academicYear: 2027,
    intake: 'Fall',
    studyLevel: "Master's / Graduate",
    admissionRoute: 'Graduate',
    language: 'Check the current program guide',
    subject: 'International studies',
    applicationOpens: '2027-04-12',
    applicationCloses: '2027-04-30',
    tentative: true,
    officialUrl: 'https://gsis.ajou.ac.kr/gsis/admissions/procedures.do',
    lastVerified: '2026-11-09',
    notes: 'Tentative application window; confirm the latest GSIS schedule.',
  },
  {
    id: 'ajou-gsis-2027-fall-round-2',
    university: 'Ajou University — Graduate School of International Studies',
    location: 'Suwon',
    academicYear: 2027,
    intake: 'Fall',
    studyLevel: "Master's / Graduate",
    admissionRoute: 'Graduate',
    language: 'Check the current program guide',
    subject: 'International studies',
    applicationOpens: '2027-05-03',
    applicationCloses: '2027-05-21',
    tentative: true,
    officialUrl: 'https://gsis.ajou.ac.kr/gsis/admissions/procedures.do',
    lastVerified: '2026-11-09',
    notes: 'Tentative application window; confirm the latest GSIS schedule.',
  },
  {
    id: 'ajou-gsis-2027-fall-round-3',
    university: 'Ajou University — Graduate School of International Studies',
    location: 'Suwon',
    academicYear: 2027,
    intake: 'Fall',
    studyLevel: "Master's / Graduate",
    admissionRoute: 'Graduate',
    language: 'Check the current program guide',
    subject: 'International studies',
    applicationOpens: '2027-05-24',
    applicationCloses: '2027-06-18',
    tentative: true,
    officialUrl: 'https://gsis.ajou.ac.kr/gsis/admissions/procedures.do',
    lastVerified: '2026-11-09',
    notes: 'Tentative application window; confirm the latest GSIS schedule.',
  },
  {
    id: 'korea-university-2027-spring-undergraduate',
    university: 'Korea University',
    location: 'Seoul',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Bachelor's",
    admissionRoute: 'International undergraduate — confirm route in current guide',
    language: 'Check the current program guide',
    subject: 'Program dependent',
    applicationOpens: '2026-08-03',
    applicationCloses: '2026-08-31',
    officialUrl: 'https://oia.korea.ac.kr/oia2026/Admission-Guide.do',
    lastVerified: '2026-11-09',
    notes: 'Check the official guide for route-specific eligibility and document instructions.',
  },
  {
    id: 'korea-university-2027-fall-undergraduate',
    university: 'Korea University',
    location: 'Seoul',
    academicYear: 2027,
    intake: 'Fall',
    studyLevel: "Bachelor's",
    admissionRoute: 'International undergraduate — confirm route in current guide',
    language: 'Check the current program guide',
    subject: 'Program dependent',
    applicationOpens: null,
    applicationCloses: null,
    officialUrl: 'https://oia.korea.ac.kr/oia2026/Admission-Guide.do',
    lastVerified: '2026-11-09',
    notes: 'The official page indicates a March 2027 application period; exact dates are to be announced.',
  },
  {
    id: 'yonsei-2027-spring-undergraduate',
    university: 'Yonsei University',
    location: 'Seoul',
    academicYear: 2027,
    intake: 'Spring',
    studyLevel: "Bachelor's",
    admissionRoute: 'International undergraduate',
    language: 'Check the current program guide',
    subject: 'Program dependent',
    applicationOpens: '2026-09-01',
    applicationCloses: '2026-09-17',
    documentDeadline: '2026-09-30 17:00 KST',
    officialUrl: 'https://admission.yonsei.ac.kr/seoul/admission/html/counsel/noticeView.asp?BBS_NO=3520&s_data=2027',
    lastVerified: '2026-11-09',
    notes: 'The online application and original-document deadlines have passed.',
  },
]

export function getAdmissionStatus(cycle: AdmissionCycle, todayKst: string, timeKst = '00:00'): AdmissionStatus {
  if (!cycle.applicationOpens || !cycle.applicationCloses) return 'To Be Announced'
  if (todayKst < cycle.applicationOpens) return 'Upcoming'
  if (todayKst < cycle.applicationCloses) return 'Open'
  if (todayKst === cycle.applicationCloses) {
    const deadline = cycle.deadlineTime?.match(/(\d{2}):(\d{2})/)
    if (!deadline || timeKst < `${deadline[1]}:${deadline[2]}`) return 'Open'
  }
  return 'Closed'
}

export function getTodayInKorea() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function getTimeInKorea() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date())
}

export function formatKoreanDate(date: string | null) {
  if (!date) return 'To Be Announced'
  return new Intl.DateTimeFormat('en', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00Z`))
}

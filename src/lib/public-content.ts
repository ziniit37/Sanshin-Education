import type { Scholarship, University } from '@/lib/types'

const universitySummaries: Record<string, string> = {
  'seoul-national-university': 'A national research university in Seoul. Check the official admissions site for current programs, eligibility, and application details.',
  'korea-university': 'A private research university in Seoul. Check the official admissions site for current programs, eligibility, and application details.',
  'yonsei-university': 'A private research university in Seoul. Check the official admissions site for current programs, eligibility, and application details.',
  kaist: 'A science and technology university based in Daejeon. Check the official admissions site for current programs, eligibility, and application details.',
}

export function getPublicUniversitySummary(university: University) {
  return universitySummaries[university.slug] ?? university.overview
}

const scholarshipSummaries: Record<string, Pick<Scholarship, 'name' | 'overview' | 'eligibility' | 'coverage'>> = {
  'global-korea-scholarship': {
    name: 'Global Korea Scholarship (GKS)',
    overview: 'A Korean government scholarship program. Participating programs, eligibility, application routes, benefits, and dates are set out in the current annual notice.',
    eligibility: 'Eligibility criteria can change by cycle and program. Consult the current official notice before applying.',
    coverage: 'Benefits depend on the current scholarship notice and selected program. Verify details with the official provider.',
  },
  'snu-global-scholarship': {
    name: 'University-based scholarships',
    overview: 'Some Korean universities offer scholarships for international students. Names, eligibility, selection, and benefits vary by institution and academic cycle.',
    eligibility: 'Review the current scholarship notice and confirm whether you must apply separately or be considered through admission.',
    coverage: 'Coverage varies. Confirm amounts, duration, renewal conditions, and academic requirements with the university.',
  },
  'kaist-international-scholarship': {
    name: 'Graduate research funding',
    overview: 'Research programs may provide institution-, department-, or project-specific funding. Availability is not universal and should be confirmed with the graduate program.',
    eligibility: 'Requirements and selection vary by program. Ask the relevant graduate office about current funding and whether a separate application is required.',
    coverage: 'Funding terms vary by award and may be conditional. Review the current written offer and award rules.',
  },
}

export function getPublicScholarship(scholarship: Scholarship): Scholarship {
  const summary = scholarshipSummaries[scholarship.slug]
  return summary ? { ...scholarship, ...summary } : scholarship
}

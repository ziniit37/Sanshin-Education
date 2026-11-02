const campus = '/images/snu.jpg'
const library = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80'
const airport = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80'
const studyGroup = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80'
const technology = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80'
const business = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80'

const programImages: Record<string, string> = {
  Engineering: technology,
  'International Studies': studyGroup,
  Business: business,
  'Computer Science': technology,
}

const serviceImages: Record<string, string> = {
  'university-selection': campus,
  'application-support': library,
  'visa-guidance': airport,
  'scholarship-counseling': library,
  'pre-departure-support': airport,
}

const scholarshipImages: Record<string, string> = {
  'global-korea-scholarship': library,
  'snu-global-scholarship': campus,
  'kaist-international-scholarship': technology,
}

export function getProgramImage(subject: string) {
  return programImages[subject] ?? campus
}

export function getServiceImage(slug: string) {
  return serviceImages[slug] ?? campus
}

export function getScholarshipImage(slug: string) {
  return scholarshipImages[slug] ?? library
}

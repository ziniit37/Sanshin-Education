export interface StudyResource {
  slug: string
  title: string
  excerpt: string
  category: string
  reviewedOn: string
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[]
  sources: { label: string; url: string }[]
  related: string[]
}

const studyInKoreaAdmissions = 'https://www.studyinkorea.go.kr/en/plan/schoolInfo.do'
const applicationCalendar = 'https://www.studyinkorea.go.kr/'
const visaSource = 'https://www.studyinkorea.go.kr/en/plan/visaAndStay.do'
const gksNotice = 'https://www.studyinkorea.go.kr/en/plan/scholarship.do'
const expenseSource = 'https://www.studyinkorea.go.kr/en/plan/abroadExpenses.do'
const reviewedOn = '2026-11-09'

export const STUDY_RESOURCES: StudyResource[] = [
  {
    slug: 'korean-university-admissions-2027',
    title: 'Complete Guide to Korean University Admissions for 2027',
    excerpt: 'A practical route through program research, deadlines, documents, application review, and post-admission preparation.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'Start with the program, not a general deadline',
        paragraphs: [
          'Korean universities set their own international admissions calendars. Spring classes usually begin in March and fall classes usually begin in September, but application windows, available departments, transfer routes, and language evidence vary by school and program.',
          'For 2027, use the linked intake calendar as a planning index. Confirm every date in the institution’s current admissions notice, including online submission, original documents, interviews, tuition, and time zone.',
        ],
        bullets: ['Choose a degree level and subject.', 'Check whether the program admits international applicants for your target intake.', 'Record every deadline and required delivery method from the official guide.'],
      },
      {
        heading: 'Prepare and submit a complete application',
        paragraphs: [
          'Typical materials can include application forms, school records, graduation evidence, identity documents, language results, a study plan, recommendations, and proof of funds. Exact requirements depend on the applicant and institution.',
          'After submission, track document delivery and interview notices. An application or scholarship is not successful until the institution issues its official decision.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea: university search and study planning', url: studyInKoreaAdmissions }],
    related: ['march-vs-september-intake', 'apply-to-korean-university', 'prepare-korean-application-documents'],
  },
  {
    slug: 'march-vs-september-intake',
    title: 'March vs September Intake in South Korea',
    excerpt: 'Compare the two main degree-entry seasons without treating their application dates as universal.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'The semester calendar',
        paragraphs: [
          'March is commonly the start of the spring semester; September commonly starts the fall semester. These are academic start months, not application deadlines. Many spring applications happen in the preceding year and many fall applications happen earlier in the same year, but each institution publishes its own rounds.',
          'Some programs recruit for one intake only, offer multiple rounds, or set a separate original-document deadline. Korean language institutes often follow their own term calendars and should be researched separately.',
        ],
      },
      {
        heading: 'Choosing a target intake',
        paragraphs: [
          'Compare your document readiness, language preparation, graduation timing, and funding applications against the exact program calendar. If you miss a round, do not assume there will be another one.',
          'Use the intake calendar to make a shortlist, then follow the official notice linked on each university profile.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea official portal', url: applicationCalendar }],
    related: ['korean-university-admissions-2027', 'korean-language-program-admission', 'prepare-korean-application-documents'],
  },
  {
    slug: 'apply-to-korean-university',
    title: 'How to Apply to Korean Universities as an International Student',
    excerpt: 'A step-by-step overview from selecting an eligible program to confirming enrollment.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'Build a verified shortlist',
        paragraphs: [
          'Search by subject, degree, location, and language of instruction. Read the current international guide for each exact program: a university’s general profile does not establish that every department accepts international applicants.',
          'Confirm prior education equivalency, language evidence, application channel, fees, and deadlines before investing in document translation or authentication.',
        ],
        bullets: ['Create a separate checklist for each university.', 'Note whether originals, certified copies, apostilles, or consular confirmation are requested.', 'Keep proof of online submission and courier tracking.'],
      },
      {
        heading: 'After applying',
        paragraphs: [
          'Respond to official requests and interview notices within the stated time. If admitted, review the offer, tuition payment schedule, scholarship conditions, and visa documents directly with the institution.',
          'The university decides admission. Immigration authorities decide visa matters; neither decision is guaranteed by submitting an application.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea: study information', url: studyInKoreaAdmissions }],
    related: ['korean-university-admissions-2027', 'prepare-korean-application-documents', 'apostilles-and-document-verification'],
  },
  {
    slug: 'korean-language-program-admission',
    title: 'Korean Language Program Admission Process',
    excerpt: 'Understand how university language institutes set their own terms, application windows, fees, and visa documentation.',
    category: 'Language study',
    reviewedOn,
    sections: [
      {
        heading: 'Compare institutes and terms',
        paragraphs: [
          'University-affiliated language centers publish separate course levels, term dates, attendance rules, tuition, refund policies, and application steps. Many have multiple terms each year, but start dates and deadlines differ.',
          'Confirm that the course fits your learning goal and that the institute can issue the documents needed for your intended visa route. Language study does not itself guarantee later degree admission.',
        ],
      },
      {
        heading: 'Apply and prepare',
        paragraphs: [
          'Follow the institute’s current application checklist and verify the deadline for both online materials and originals. Ask the school which documents it issues after admission and check the Korean embassy’s current visa instructions.',
        ],
      },
    ],
    sources: [
      { label: 'Yonsei Korean Language Institute', url: 'https://www.yskli.com/course.php?mid=E01_01' },
      { label: 'SNU Korean Language Education Center', url: 'https://lei.snu.ac.kr/mobile/en/klec/regular/regular.jsp' },
    ],
    related: ['language-program-or-degree', 'study-in-korea-without-topik', 'd2-vs-d4-student-visas'],
  },
  {
    slug: 'study-in-korea-without-topik',
    title: 'Studying in Korea Without TOPIK',
    excerpt: 'Learn why Korean-language test requirements are program-specific and where an alternative route may exist.',
    category: 'Language study',
    reviewedOn,
    sections: [
      {
        heading: 'There is no universal TOPIK rule',
        paragraphs: [
          'Some programs teach in English or accept other evidence; Korean-taught programs may require a TOPIK level or another specified qualification. Requirements can vary by department and admission cycle, so a university-wide statement is not enough.',
          'Do not assume that no TOPIK score means automatic rejection—or that an English track waives every language condition. Read the exact current guide and contact the international admissions office if the wording is unclear.',
        ],
      },
      {
        heading: 'Practical next steps',
        paragraphs: [
          'Search for programs whose published instruction language matches your current ability. Check whether language scores are required at application, enrollment, or graduation, and whether a language institute route is appropriate for your goals.',
        ],
      },
    ],
    sources: [{ label: 'TOPIK official site', url: 'https://www.topik.go.kr/' }, { label: 'Study in Korea', url: studyInKoreaAdmissions }],
    related: ['study-in-korea-without-ielts', 'korean-language-program-admission', 'language-program-or-degree'],
  },
  {
    slug: 'study-in-korea-without-ielts',
    title: 'Studying in Korea Without IELTS',
    excerpt: 'Check the language evidence accepted by each English-taught or Korean-taught program.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'Requirements depend on the program',
        paragraphs: [
          'A university may accept more than one English test, prior education in English, or another form of evidence for some programs. This is not a general exemption: accepted tests, minimum scores, validity periods, and waiver rules must come from the current official guide.',
          'Korean-taught tracks may separately require Korean proficiency. Confirm both the teaching language and the language condition for admission and graduation.',
        ],
      },
      {
        heading: 'Verify before applying',
        paragraphs: [
          'Use the department’s current international guide and retain written confirmation if you rely on a waiver. Do not book a test or submit an application based solely on third-party summaries.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea: university study information', url: studyInKoreaAdmissions }],
    related: ['study-in-korea-without-topik', 'apply-to-korean-university', 'prepare-korean-application-documents'],
  },
  {
    slug: 'transfer-from-foreign-university',
    title: 'How to Transfer From a Foreign University to a Korean University',
    excerpt: 'A transfer is a university-specific admission route, not a guarantee that prior credits will count.',
    category: 'Transfer',
    reviewedOn,
    sections: [
      {
        heading: 'Check eligibility and timing',
        paragraphs: [
          'Institutions may define transfer eligibility using completed semesters, earned credits, prior degree status, and the intended department. Some programs may not recruit transfer applicants in every cycle.',
          'Ask the receiving university which translated and authenticated records it needs, whether course descriptions are required, and how credit review is handled.',
        ],
      },
      {
        heading: 'Plan for credit decisions',
        paragraphs: [
          'Admission and credit recognition are separate decisions. The receiving institution determines whether a course can be counted toward its degree; students should not assume that all previously earned credits will transfer.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea', url: studyInKoreaAdmissions }],
    related: ['korean-university-credit-transfer', 'change-major-korean-university', 'korean-university-admissions-2027'],
  },
  {
    slug: 'change-major-korean-university',
    title: 'Changing Majors Within a Korean University',
    excerpt: 'Internal major changes follow each institution’s academic regulations and are distinct from international transfer admission.',
    category: 'Transfer',
    reviewedOn,
    sections: [
      {
        heading: 'Understand the institution’s rules',
        paragraphs: [
          'Internal changes may be called change of major, transfer, or another term in university regulations. Eligibility can depend on completed semesters, grades, department capacity, prerequisites, and additional assessments.',
          'International students should ask the academic office and international student office whether a change affects scholarship conditions, graduation timing, or visa documentation.',
        ],
      },
      {
        heading: 'Do not assume approval',
        paragraphs: [
          'A student’s current enrollment does not guarantee a move into another department. Obtain the current written procedure from the university before making course or financial plans.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea official portal', url: applicationCalendar }],
    related: ['transfer-from-foreign-university', 'korean-university-credit-transfer', 'korean-university-admissions-2027'],
  },
  {
    slug: 'korean-university-credit-transfer',
    title: 'Korean University Credit Transfer Explained',
    excerpt: 'Learn which questions to ask before assuming overseas study will shorten a Korean degree.',
    category: 'Transfer',
    reviewedOn,
    sections: [
      {
        heading: 'Credit review is institution-specific',
        paragraphs: [
          'The receiving department may compare course level, content, credits, grades, and documentation. Decisions can happen after admission and may differ between departments or degree requirements.',
          'Collect official transcripts and detailed course descriptions or syllabi. Ask whether translations, institutional seals, or authentication are required and when the credit decision is made.',
        ],
      },
      {
        heading: 'Plan conservatively',
        paragraphs: [
          'Until the university confirms transferable credits in writing, budget and plan around the published degree structure rather than an assumed shorter program.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea', url: studyInKoreaAdmissions }],
    related: ['transfer-from-foreign-university', 'change-major-korean-university', 'apply-to-korean-university'],
  },
  {
    slug: 'language-program-or-degree',
    title: 'Language Program vs Undergraduate Degree',
    excerpt: 'Compare the purpose, admissions process, calendar, and visa planning for non-degree language study and degree study.',
    category: 'Study pathways',
    reviewedOn,
    sections: [
      {
        heading: 'Different goals and admissions',
        paragraphs: [
          'A university language institute focuses on Korean learning and generally has its own term-based application process. An undergraduate degree is an academic program with separate entry qualifications, major-specific requirements, and a degree admissions calendar.',
          'Language study can support preparation, but it does not guarantee entry into a degree program, scholarship, or visa change. Students must apply separately and satisfy the receiving program’s rules.',
        ],
      },
      {
        heading: 'Choose based on readiness',
        paragraphs: [
          'Compare your current language ability, academic record, target major, budget, and desired start date. Verify the language institute’s attendance and visa documentation rules as well as future degree prerequisites.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea student visa and stay', url: visaSource }, { label: 'Yonsei KLI', url: 'https://www.yskli.com/course.php?mid=E01_01' }],
    related: ['korean-language-program-admission', 'd2-vs-d4-student-visas', 'study-in-korea-without-topik'],
  },
  {
    slug: 'd2-vs-d4-student-visas',
    title: 'D-2 vs D-4 Student Visas',
    excerpt: 'The broad distinction is degree study versus training, but the correct status and process depend on current rules.',
    category: 'Visa',
    reviewedOn,
    sections: [
      {
        heading: 'D-2 and D-4 at a glance',
        paragraphs: [
          'The Korean government’s Study in Korea portal describes D-2 as the category for degree programs and certain research or exchange activities, while D-4 covers designated non-degree training such as Korean-language study.',
          'Subcategories, required evidence, application procedures, and stay conditions depend on the activity and current regulations. Confirm the exact code with the Korean embassy or immigration authority handling your case.',
        ],
      },
      {
        heading: 'Changing study plans',
        paragraphs: [
          'Moving from language study to degree study does not automatically change immigration status. A change of status or a new visa process may be necessary, and the right route depends on nationality, current status, timing, and official rules.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea: student visa and stay status', url: visaSource }, { label: 'Hi Korea', url: 'https://www.hikorea.go.kr/' }],
    related: ['prepare-for-korean-student-visa', 'working-part-time-in-korea', 'korean-language-program-admission'],
  },
  {
    slug: 'gks-undergraduate-scholarship-guide',
    title: 'GKS Undergraduate Scholarship Guide',
    excerpt: 'Use the current GKS-U annual guidelines and track-specific notices; country quotas and deadlines are not uniform.',
    category: 'Scholarships',
    reviewedOn,
    sections: [
      {
        heading: 'Two application tracks',
        paragraphs: [
          'The Embassy Track and University Track use different application channels and selection steps. Participating countries, institutions, departments, quotas, documents, timelines, and benefits are defined in the current annual guideline and attachments.',
          'The 2027 undergraduate guidelines and University Track notice are published on the official Study in Korea notice board. A scholarship cycle year refers to that selection cycle, not necessarily the month classes begin.',
        ],
      },
      {
        heading: 'Prepare from the official files',
        paragraphs: [
          'Download the current guideline, eligible-university information, and country-specific instructions. Check whether applications are accepted by the embassy or a participating university in your country and follow that office’s exact deadline.',
          'Do not rely on an old checklist or assume that a benefit, country quota, or department is unchanged from a previous cycle.',
        ],
      },
    ],
    sources: [
      { label: '2027 GKS Undergraduate Guidelines', url: 'https://studyinkorea.go.kr/ko/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4522' },
      { label: '2027 GKS-U University Track notice', url: 'https://www.studyinkorea.go.kr/en/plan/gksNoticeRead.do?bbsId=BBSMSTR_000000000461&nttId=4527' },
    ],
    related: ['gks-graduate-scholarship-guide', 'prepare-korean-application-documents', 'korean-university-admissions-2027'],
  },
  {
    slug: 'gks-graduate-scholarship-guide',
    title: 'GKS Graduate Scholarship Guide',
    excerpt: 'Graduate applicants should use the current GKS-G notice rather than reusing undergraduate requirements or dates.',
    category: 'Scholarships',
    reviewedOn,
    sections: [
      {
        heading: 'GKS-G is a separate cycle',
        paragraphs: [
          'Graduate scholarship guidelines can have different eligible degree levels, applicant criteria, university lists, documents, and timelines from GKS-U. Embassy and University Track details must be taken from the relevant current GKS-G notice.',
          'This guide does not treat the 2027 graduate announcement as released unless its official notice is confirmed. Check the Study in Korea notice board for current publication status.',
        ],
      },
      {
        heading: 'Research fit and documents',
        paragraphs: [
          'Graduate applicants should confirm department participation, research or study-plan expectations, supervisor contact practices where relevant, and degree-specific eligibility. A university’s participation in one GKS cycle does not establish its participation in another.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea GKS notices', url: gksNotice }],
    related: ['gks-undergraduate-scholarship-guide', 'prepare-korean-application-documents', 'write-korean-university-study-plan'],
  },
  {
    slug: 'prepare-korean-application-documents',
    title: 'How to Prepare Korean University Application Documents',
    excerpt: 'Build a program-specific checklist for records, translations, identity materials, essays, and delivery.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'Follow the exact checklist',
        paragraphs: [
          'Common items include application forms, passport details, academic transcripts, graduation certificates, language results, study plans, recommendations, and financial evidence. The list is not universal; the current institutional guide controls.',
          'Check whether documents must be originals, certified copies, translated copies, apostilled, or confirmed by a Korean consulate. Keep the order and format requested by the university.',
        ],
      },
      {
        heading: 'Avoid last-minute document risk',
        paragraphs: [
          'Request records early and allow time for translation, authentication, and international delivery. Track separate online and hard-copy deadlines and retain proof of courier delivery.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea admissions portal', url: studyInKoreaAdmissions }],
    related: ['apostilles-and-document-verification', 'write-korean-university-study-plan', 'apply-to-korean-university'],
  },
  {
    slug: 'apostilles-and-document-verification',
    title: 'Understanding Apostilles and Academic Document Verification',
    excerpt: 'Authentication steps depend on the issuing country and the university’s current document rules.',
    category: 'Documents',
    reviewedOn,
    sections: [
      {
        heading: 'What to confirm first',
        paragraphs: [
          'Universities may require an apostille, consular legalization, certified translation, or another form of verification for educational records. Which method applies depends on where the document was issued, the issuing authority, and the current admissions guide.',
          'An apostille is not a substitute for the document itself, a required translation, or a university-specific format. Check the receiving institution’s instructions before starting authentication.',
        ],
      },
      {
        heading: 'Use official channels',
        paragraphs: [
          'Ask the institution that issued your records and the competent authority in that country how verification works. If instructions conflict, get written clarification from the Korean university before submitting.',
        ],
      },
    ],
    sources: [{ label: 'Hague Conference: Apostille Section', url: 'https://www.hcch.net/en/instruments/specialised-sections/apostille' }],
    related: ['prepare-korean-application-documents', 'apply-to-korean-university', 'korean-university-admissions-2027'],
  },
  {
    slug: 'write-korean-university-study-plan',
    title: 'How to Write a Korean University Study Plan',
    excerpt: 'Connect your academic preparation, program choice, learning goals, and realistic next steps.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'Answer the program’s prompt',
        paragraphs: [
          'Study-plan prompts vary by university and degree. Read the current instructions carefully for length, language, required topics, and format before drafting.',
          'Explain why the selected subject and program fit your background, what you plan to study, and how you will approach language or academic preparation. Use specific, truthful examples from your own experience.',
        ],
      },
      {
        heading: 'Make the plan credible',
        paragraphs: [
          'Avoid unsupported claims, generic praise, and promises of guaranteed career outcomes. Show that you understand the curriculum and connect short-term study goals to a practical longer-term direction.',
          'Ask a trusted reviewer to check clarity and consistency, but ensure the final application accurately represents your own work and plans.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea application information', url: studyInKoreaAdmissions }],
    related: ['prepare-korean-application-documents', 'gks-graduate-scholarship-guide', 'apply-to-korean-university'],
  },
  {
    slug: 'conditional-admission-south-korea',
    title: 'Understanding Conditional Admission in South Korea',
    excerpt: 'A conditional route is defined by a specific university notice; do not assume a universal pathway.',
    category: 'Admissions',
    reviewedOn,
    sections: [
      {
        heading: 'Read the institution’s definition',
        paragraphs: [
          'A university may publish a conditional route tied to a particular qualification, language requirement, department, or application round. The conditions and consequences are set by that institution’s current written guide.',
          'Do not interpret conditional admission as guaranteed admission after language study, a waiver from academic requirements, or a promise of later transfer unless the official notice explicitly says so.',
        ],
      },
      {
        heading: 'Confirm each condition',
        paragraphs: [
          'Ask what must be completed, by when, and what happens if a condition is not met. Verify tuition, scholarship, visa, and enrollment implications before accepting an offer.',
        ],
      },
    ],
    sources: [{ label: 'SeoulTech International Admissions', url: 'https://global.seoultech.ac.kr/' }],
    related: ['korean-university-admissions-2027', 'study-in-korea-without-topik', 'language-program-or-degree'],
  },
  {
    slug: 'korean-university-tuition-and-living-costs',
    title: 'Korean University Tuition and Living Costs',
    excerpt: 'Use government-published averages as context, then build a budget from your actual university and city.',
    category: 'Budget',
    reviewedOn,
    sections: [
      {
        heading: 'Tuition is only one part of the budget',
        paragraphs: [
          'The Study in Korea portal publishes national average annual tuition figures and explains that institution fees vary. An average is a planning reference, not a quote for a particular university or program.',
          'Also budget application and admission fees, housing deposits, dormitory or rent, food, transport, insurance, document authentication, visa processing, flights, and an emergency reserve.',
        ],
      },
      {
        heading: 'Build a personalized estimate',
        paragraphs: [
          'Use the budget tool as a transparent scenario: it labels government tuition averages, asks you to enter your own living and one-time costs, and shows its calculation assumptions. Do not assume part-time work will cover study expenses.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea official study expenses', url: expenseSource }],
    related: ['international-student-housing-korea', 'prepare-for-korean-student-visa', 'working-part-time-in-korea'],
  },
  {
    slug: 'international-student-housing-korea',
    title: 'International Student Housing in Korea',
    excerpt: 'Compare university dormitories and off-campus housing, and verify deposits, contracts, and move-in dates.',
    category: 'Student life',
    reviewedOn,
    sections: [
      {
        heading: 'Compare the total housing cost',
        paragraphs: [
          'University dormitory availability, application dates, room types, meal plans, and eligibility are institution-specific. Ask the housing office for the current schedule and full fee list before accepting a place.',
          'Off-campus housing may involve a deposit, monthly rent, utilities, brokerage or setup costs, and contract terms. Costs vary by location and property; never rely on a generic estimate as a quote.',
        ],
      },
      {
        heading: 'Plan arrival logistics',
        paragraphs: [
          'Coordinate move-in dates with your program orientation and flight. Confirm the address-registration procedure and required documents with your school and the relevant immigration authority after arrival.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea: life and study information', url: 'https://www.studyinkorea.go.kr/en/plan/lifeInfo.do' }],
    related: ['korean-university-tuition-and-living-costs', 'prepare-for-korean-student-visa', 'korean-university-admissions-2027'],
  },
  {
    slug: 'working-part-time-in-korea',
    title: 'Working Part-Time as an International Student in Korea',
    excerpt: 'Work permissions depend on visa status and prior approval; student work is not unrestricted income.',
    category: 'Visa',
    reviewedOn,
    sections: [
      {
        heading: 'Get permission before working',
        paragraphs: [
          'International students may need immigration permission, school confirmation, qualifying language ability, and compliance with limits that depend on visa type and circumstances. Rules and permitted hours can change.',
          'Some D-4 language trainees may face a six-month eligibility condition, but students must confirm the rule applicable to their status and case with official immigration guidance before accepting work.',
        ],
      },
      {
        heading: 'Do not base your budget on unapproved work',
        paragraphs: [
          'Unauthorized employment can affect immigration status. Plan for tuition and living costs without assuming immediate or unrestricted part-time work, and confirm any proposed employment with your university and Hi Korea.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea visa and stay information', url: visaSource }, { label: 'Hi Korea', url: 'https://www.hikorea.go.kr/' }],
    related: ['d2-vs-d4-student-visas', 'prepare-for-korean-student-visa', 'korean-university-tuition-and-living-costs'],
  },
  {
    slug: 'prepare-for-korean-student-visa',
    title: 'Preparing for a Korean Student Visa',
    excerpt: 'Use the embassy or consulate responsible for your application to confirm current forms and required evidence.',
    category: 'Visa',
    reviewedOn,
    sections: [
      {
        heading: 'Common preparation categories',
        paragraphs: [
          'Applicants may need a passport, application form and photographs, admission documents, educational records, financial evidence, and additional materials such as family relationship documents. Exact requirements depend on visa category, nationality, application location, and current rules.',
          'Start with the official visa category and the Korean diplomatic mission that will process your application. School guidance is helpful but does not replace the authority’s requirements.',
        ],
      },
      {
        heading: 'After arrival',
        paragraphs: [
          'Qualifying long-stay residents may need to complete foreigner registration and address reporting, maintain valid status, and follow health-insurance and university procedures. Check current deadlines with Hi Korea and your institution.',
        ],
      },
    ],
    sources: [{ label: 'Study in Korea student visa guidance', url: visaSource }, { label: 'Hi Korea', url: 'https://www.hikorea.go.kr/' }, { label: 'Korea Immigration Service', url: 'https://www.immigration.go.kr/' }],
    related: ['d2-vs-d4-student-visas', 'working-part-time-in-korea', 'korean-university-tuition-and-living-costs'],
  },
]

export function getStudyResource(slug: string) {
  return STUDY_RESOURCES.find((resource) => resource.slug === slug)
}

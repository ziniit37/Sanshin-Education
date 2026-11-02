import { useMemo, useState, type ReactNode } from 'react'
import { Link } from '@/lib/navigation'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BookOpen,
  Building2,
  CalendarDays,
  FileText,
  Flag,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LineChart as LineChartIcon,
  Mail,
  Map as MapIcon,
  MessageSquare,
  Newspaper,
  Sparkles,
  Star,
  Users,
  UserRound,
  Briefcase,
  Globe,
  PenSquare,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { createRecord, useData, useQuery } from '@/contexts/DataProvider'
import { useToast } from '@/contexts/ToastProvider'
import { LEAD_STAGES, type CollectionName, type LeadStage } from '@/lib/types'
import { labelize, slugify } from '@/lib/utils'

export const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics', icon: LineChartIcon },
  { to: '/admin/leads', label: 'Leads', icon: Flag },
  { to: '/admin/students', label: 'Students', icon: GraduationCap },
  { to: '/admin/counselors', label: 'Counselors', icon: UserRound },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/applications', label: 'Applications', icon: Briefcase },
  { to: '/admin/universities', label: 'Universities', icon: Building2 },
  { to: '/admin/programs', label: 'Programs', icon: BookOpen },
  { to: '/admin/services', label: 'Services', icon: Sparkles },
  { to: '/admin/countries', label: 'Countries', icon: Globe },
  { to: '/admin/scholarships', label: 'Scholarships', icon: Star },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: '/admin/success-stories', label: 'Success stories', icon: PenSquare },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/contacts', label: 'Contacts', icon: Mail },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/content', label: 'Website content', icon: MapIcon },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShell links={adminLinks}>{children}</AppShell>
}

export function AdminDashboard() {
  const { count } = useData()
  const kpis = [
    ['Leads', count('leads')],
    ['Students', count('studentProfiles')],
    ['Applications', count('applications')],
    ['Appointments', count('appointments')],
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([label, value]) => (
          <Card key={String(label)}>
            <CardHeader><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent className="font-heading text-3xl">{value}</CardContent>
          </Card>
        ))}
      </div>
      <Button asChild variant="accent"><Link to="/admin/analytics">Open analytics</Link></Button>
    </div>
  )
}

export function AdminAnalytics() {
  const leads = useQuery('leads')
  const apps = useQuery('applications')
  const leadData = LEAD_STAGES.map((stage) => ({
    name: labelize(stage).split(' ')[0],
    count: leads.items.filter((l) => l.stage === stage).length,
  }))
  const appData = apps.items.reduce<Record<string, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] ?? 0) + 1
    return acc
  }, {})
  const line = Object.entries(appData).map(([name, count]) => ({ name: labelize(name), count }))

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <Card>
        <CardHeader><CardTitle>Lead pipeline</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide={false} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Application statuses</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={line.length ? line : [{ name: 'None', count: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--gold))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminLeads() {
  const { update } = useData()
  const [stage, setStage] = useState('all')
  const [q, setQ] = useState('')
  const result = useQuery('leads', { filters: { stage }, search: q, searchFields: ['name', 'email', 'leadSource'] })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {LEAD_STAGES.map((s) => <SelectItem key={s} value={s}>{labelize(s)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">{result.total} leads</p>
      {result.total === 0 ? <EmptyState title="No leads" /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </TableCell>
                <TableCell>{lead.leadSource}</TableCell>
                <TableCell><StatusBadge value={lead.stage} /></TableCell>
                <TableCell>
                  <Select value={lead.stage} onValueChange={(v) => update('leads', lead.id, { stage: v as LeadStage })}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {LEAD_STAGES.map((s) => <SelectItem key={s} value={s}>{labelize(s)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

type FieldType = 'text' | 'textarea' | 'select' | 'number' | 'checkbox'

interface FieldConfig {
  key: string
  label: string
  type?: FieldType
  options?: string[]
}

interface EntityConfig {
  collection: CollectionName
  title: string
  searchFields: string[]
  columns: { key: string; label: string }[]
  fields: FieldConfig[]
  slugFrom?: string
}

function EntityManager({ config }: { config: EntityConfig }) {
  const { create, update, remove } = useData()
  const { toast } = useToast()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const result = useQuery(config.collection, { search: q, searchFields: config.searchFields, sortKey: 'createdAt', sortDir: 'desc' })

  const startNew = () => {
    setEditingId(null)
    setForm({})
    setOpen(true)
  }
  const startEdit = (row: Record<string, unknown>) => {
    setEditingId(String(row.id))
    setForm(Object.fromEntries(config.fields.map((f) => [f.key, String(row[f.key] ?? '')])))
    setOpen(true)
  }
  const save = () => {
    const payload: Record<string, unknown> = { ...form }
    if (config.slugFrom && !payload.slug) payload.slug = slugify(String(form[config.slugFrom] ?? ''))
    config.fields.forEach((f) => {
      if (f.type === 'checkbox') payload[f.key] = form[f.key] === 'true'
    })
    if (editingId) {
      update(config.collection, editingId, payload)
      toast('Updated')
    } else {
      create(config.collection, createRecord(payload as never))
      toast('Created')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <Button variant="accent" onClick={startNew}>Add</Button>
      </div>
      <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <p className="text-sm text-muted-foreground">{result.total} records</p>
      {result.total === 0 ? <EmptyState title="Nothing here yet" /> : (
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.items.map((item) => {
              const row: Record<string, unknown> = Object.fromEntries(Object.entries(item))
              return (
              <TableRow key={String(row.id)}>
                {config.columns.map((c) => (
                  <TableCell key={c.key}>{String(row[c.key] ?? '—')}</TableCell>
                ))}
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(row)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(config.collection, String(row.id))}>Delete</Button>
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Create'} {config.title}</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea value={form[field.key] ?? ''} onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))} />
                ) : field.type === 'select' ? (
                  <Select value={form[field.key] ?? ''} onValueChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((o) => <SelectItem key={o} value={o}>{labelize(o)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : field.type === 'checkbox' ? (
                  <Select value={form[field.key] ?? 'false'} onValueChange={(v) => setForm((f) => ({ ...f, [field.key]: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form[field.key] ?? ''} onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))} />
                )}
              </div>
            ))}
            <Button variant="accent" onClick={save}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function AdminStudents() {
  const students = useQuery('studentProfiles')
  const users = useQuery('users')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students</h1>
      {students.total === 0 ? <EmptyState title="No students" /> : (
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Intake</TableHead></TableRow></TableHeader>
          <TableBody>
            {students.items.map((s) => {
              const u = users.items.find((x) => x.id === s.userId)
              return (
                <TableRow key={s.id}>
                  <TableCell>{u?.name}</TableCell>
                  <TableCell>{u?.email}</TableCell>
                  <TableCell>{s.intendedIntake || '—'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export function AdminCounselors() {
  const counselors = useQuery('counselorProfiles')
  const users = useQuery('users')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Counselors</h1>
      {counselors.items.map((c) => {
        const u = users.items.find((x) => x.id === c.userId)
        return (
          <Card key={c.id}>
            <CardHeader><CardTitle>{u?.name} — {c.title}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{c.bio}</CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function AdminContent() {
  const { db, update } = useData()
  const { toast } = useToast()
  const groups = useMemo(() => {
    const map = new Map<string, NonNullable<typeof db>['siteContent']>()
    db?.siteContent.forEach((item) => {
      const list = map.get(item.group) ?? []
      list.push(item)
      map.set(item.group, list)
    })
    return [...map.entries()]
  }, [db])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Website content</h1>
      <p className="text-sm text-muted-foreground">Phone, address, stats, social links, and public copy. These are placeholders until you verify them.</p>
      {groups.map(([group, items]) => (
        <section key={group} className="space-y-3">
          <h2 className="font-heading text-lg font-semibold capitalize">{group}</h2>
          {items.map((item) => (
            <div key={item.id} className="grid gap-2">
              <Label>{item.label}</Label>
              {item.value.length > 80 ? (
                <Textarea defaultValue={item.value} onBlur={(e) => { update('siteContent', item.id, { value: e.target.value }); toast('Saved', item.label) }} />
              ) : (
                <Input defaultValue={item.value} onBlur={(e) => { update('siteContent', item.id, { value: e.target.value }); toast('Saved', item.label) }} />
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export function AdminContacts() {
  const items = useQuery('contactMessages', { sortKey: 'createdAt', sortDir: 'desc' })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Contact messages</h1>
      {items.total === 0 ? <EmptyState title="No messages" /> : items.items.map((m) => (
        <Card key={m.id}><CardHeader><CardTitle className="text-lg">{m.subject}</CardTitle></CardHeader><CardContent><p className="text-sm">{m.name} · {m.email}</p><p className="mt-2 text-sm text-muted-foreground">{m.message}</p></CardContent></Card>
      ))}
    </div>
  )
}

export function AdminMessages() {
  const items = useQuery('messages', { sortKey: 'createdAt', sortDir: 'desc' })
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Counselor messages</h1>
      {items.total === 0 ? <EmptyState title="No messages" /> : items.items.map((m) => (
        <Card key={m.id}><CardContent className="pt-6 text-sm">{m.body}</CardContent></Card>
      ))}
    </div>
  )
}

export function AdminNewsletter() {
  const items = useQuery('newsletterSubscribers')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Newsletter</h1>
      {items.total === 0 ? <EmptyState title="No subscribers" /> : (
        <ul className="space-y-2">{items.items.map((s) => <li key={s.id} className="rounded-lg border bg-card p-3 text-sm">{s.email}</li>)}</ul>
      )}
    </div>
  )
}

export function AdminUniversities() {
  return (
    <EntityManager
      config={{
        collection: 'universities',
        title: 'Universities',
        searchFields: ['name', 'city'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'city', label: 'City' }, { key: 'ranking', label: 'Ranking' }],
        slugFrom: 'name',
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'countryId', label: 'Country ID' },
          { key: 'city', label: 'City' },
          { key: 'ranking', label: 'Ranking' },
          { key: 'image', label: 'Image URL' },
          { key: 'overview', label: 'Overview', type: 'textarea' },
          { key: 'requirements', label: 'Requirements', type: 'textarea' },
          { key: 'tuitionRange', label: 'Tuition' },
          { key: 'deadlines', label: 'Deadlines' },
          { key: 'intakes', label: 'Intakes' },
          { key: 'campus', label: 'Campus', type: 'textarea' },
          { key: 'featured', label: 'Featured', type: 'checkbox' },
        ],
      }}
    />
  )
}

export function AdminPrograms() {
  return (
    <EntityManager
      config={{
        collection: 'programs',
        title: 'Programs',
        searchFields: ['name', 'subject'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'degree', label: 'Degree' }, { key: 'subject', label: 'Subject' }],
        slugFrom: 'name',
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'universityId', label: 'University ID' },
          { key: 'degree', label: 'Degree' },
          { key: 'subject', label: 'Subject' },
          { key: 'duration', label: 'Duration' },
          { key: 'tuition', label: 'Tuition' },
          { key: 'requirements', label: 'Requirements', type: 'textarea' },
          { key: 'careerOutcomes', label: 'Career outcomes', type: 'textarea' },
          { key: 'deadlines', label: 'Deadlines' },
          { key: 'intake', label: 'Intake' },
          { key: 'featured', label: 'Featured', type: 'checkbox' },
        ],
      }}
    />
  )
}

export function AdminServices() {
  return (
    <EntityManager
      config={{
        collection: 'services',
        title: 'Services',
        searchFields: ['name'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'tagline', label: 'Tagline' }],
        slugFrom: 'name',
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'tagline', label: 'Tagline' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'whoItsFor', label: 'Who it is for', type: 'textarea' },
          { key: 'included', label: 'Included', type: 'textarea' },
          { key: 'process', label: 'Process', type: 'textarea' },
          { key: 'faqs', label: 'FAQs', type: 'textarea' },
          { key: 'icon', label: 'Icon' },
        ],
      }}
    />
  )
}

export function AdminCountries() {
  return (
    <EntityManager
      config={{
        collection: 'countries',
        title: 'Countries',
        searchFields: ['name'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }],
        slugFrom: 'name',
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'heroImage', label: 'Hero image' },
          { key: 'overview', label: 'Overview', type: 'textarea' },
          { key: 'intakes', label: 'Intakes' },
          { key: 'tuitionRange', label: 'Tuition' },
          { key: 'livingCosts', label: 'Living costs' },
          { key: 'visaOverview', label: 'Visa', type: 'textarea' },
          { key: 'workDuringStudy', label: 'Work during study', type: 'textarea' },
          { key: 'postStudy', label: 'Post-study', type: 'textarea' },
          { key: 'featured', label: 'Featured', type: 'checkbox' },
        ],
      }}
    />
  )
}

export function AdminScholarships() {
  return (
    <EntityManager
      config={{
        collection: 'scholarships',
        title: 'Scholarships',
        searchFields: ['name'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }, { key: 'deadline', label: 'Deadline' }],
        slugFrom: 'name',
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'status', label: 'Status', type: 'select', options: ['open', 'closing_soon', 'upcoming', 'closed'] },
          { key: 'amount', label: 'Amount' },
          { key: 'deadline', label: 'Deadline' },
          { key: 'overview', label: 'Overview', type: 'textarea' },
          { key: 'eligibility', label: 'Eligibility', type: 'textarea' },
          { key: 'coverage', label: 'Coverage', type: 'textarea' },
        ],
      }}
    />
  )
}

export function AdminAppointments() {
  return (
    <EntityManager
      config={{
        collection: 'appointments',
        title: 'Appointments',
        searchFields: ['name', 'email'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' }],
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'type', label: 'Type', type: 'select', options: ['online', 'phone', 'in_person'] },
          { key: 'status', label: 'Status', type: 'select', options: ['pending', 'confirmed', 'completed', 'cancelled'] },
          { key: 'scheduledAt', label: 'Scheduled at' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
      }}
    />
  )
}

export function AdminDocuments() {
  return (
    <EntityManager
      config={{
        collection: 'documents',
        title: 'Documents',
        searchFields: ['fileName', 'category'],
        columns: [{ key: 'fileName', label: 'File' }, { key: 'category', label: 'Category' }, { key: 'status', label: 'Status' }],
        fields: [
          { key: 'fileName', label: 'File name' },
          { key: 'category', label: 'Category' },
          { key: 'status', label: 'Status', type: 'select', options: ['uploaded', 'under_review', 'revision_required', 'approved'] },
          { key: 'reviewNote', label: 'Review note', type: 'textarea' },
        ],
      }}
    />
  )
}

export function AdminTestimonials() {
  return (
    <EntityManager
      config={{
        collection: 'testimonials',
        title: 'Testimonials',
        searchFields: ['name', 'quote'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'university', label: 'University' }],
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'quote', label: 'Quote', type: 'textarea' },
          { key: 'university', label: 'University' },
          { key: 'image', label: 'Image' },
        ],
      }}
    />
  )
}

export function AdminStories() {
  return (
    <EntityManager
      config={{
        collection: 'successStories',
        title: 'Success stories',
        searchFields: ['studentName', 'university'],
        columns: [{ key: 'studentName', label: 'Student' }, { key: 'university', label: 'University' }],
        slugFrom: 'studentName',
        fields: [
          { key: 'studentName', label: 'Student name' },
          { key: 'slug', label: 'Slug' },
          { key: 'university', label: 'University' },
          { key: 'program', label: 'Program' },
          { key: 'year', label: 'Year' },
          { key: 'image', label: 'Image' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'body', label: 'Body (HTML)', type: 'textarea' },
        ],
      }}
    />
  )
}

export function AdminBlog() {
  return (
    <EntityManager
      config={{
        collection: 'blogPosts',
        title: 'Blog',
        searchFields: ['title', 'excerpt'],
        columns: [{ key: 'title', label: 'Title' }, { key: 'updateType', label: 'Type' }],
        slugFrom: 'title',
        fields: [
          { key: 'title', label: 'Title' },
          { key: 'slug', label: 'Slug' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'body', label: 'Body (HTML)', type: 'textarea' },
          { key: 'coverImage', label: 'Cover image' },
          { key: 'updateType', label: 'Update type', type: 'select', options: ['general', 'scholarship_alert', 'visa_update', 'application_deadline', 'university_update'] },
          { key: 'publishedAt', label: 'Published at' },
        ],
      }}
    />
  )
}

export function AdminFaqs() {
  return (
    <EntityManager
      config={{
        collection: 'faqs',
        title: 'FAQs',
        searchFields: ['question', 'category'],
        columns: [{ key: 'category', label: 'Category' }, { key: 'question', label: 'Question' }],
        fields: [
          { key: 'category', label: 'Category' },
          { key: 'question', label: 'Question' },
          { key: 'answer', label: 'Answer', type: 'textarea' },
        ],
      }}
    />
  )
}

export function AdminTeam() {
  return (
    <EntityManager
      config={{
        collection: 'teamMembers',
        title: 'Team',
        searchFields: ['name', 'role'],
        columns: [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }],
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'bio', label: 'Bio', type: 'textarea' },
          { key: 'image', label: 'Image' },
          { key: 'order', label: 'Order' },
        ],
      }}
    />
  )
}

export function AdminApplications() {
  return (
    <EntityManager
      config={{
        collection: 'applications',
        title: 'Applications',
        searchFields: ['intake', 'status'],
        columns: [{ key: 'intake', label: 'Intake' }, { key: 'status', label: 'Status' }],
        fields: [
          { key: 'studentId', label: 'Student user ID' },
          { key: 'universityId', label: 'University ID' },
          { key: 'programId', label: 'Program ID' },
          { key: 'status', label: 'Status', type: 'select', options: ['profile_created', 'documents_uploaded', 'documents_verified', 'university_shortlisted', 'application_in_progress', 'application_submitted', 'under_review', 'offer_received', 'deposit_paid', 'visa_preparation', 'visa_submitted', 'visa_approved', 'pre_departure', 'enrolled'] },
          { key: 'intake', label: 'Intake' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
      }}
    />
  )
}

import type { ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { Link } from '@/lib/navigation'
import { useForm } from 'react-hook-form'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthProvider'
import { createRecord, useData, useQuery } from '@/contexts/DataProvider'
import { useToast } from '@/contexts/ToastProvider'
import { APPLICATION_STATUSES, DOCUMENT_CATEGORIES, type DocumentCategory, type DocumentRecord, type Message } from '@/lib/types'
import { fileToDataUrl, formatDate, formatDateTime, labelize } from '@/lib/utils'
import {
  Bell,
  CalendarDays,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'

export const portalLinks = [
  { to: '/portal', label: 'Overview', icon: LayoutDashboard },
  { to: '/portal/profile', label: 'Profile', icon: UserRound },
  { to: '/portal/applications', label: 'Applications', icon: GraduationCap },
  { to: '/portal/documents', label: 'Documents', icon: FileText },
  { to: '/portal/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/portal/recommendations', label: 'Recommendations', icon: Sparkles },
  { to: '/portal/messages', label: 'Messages', icon: MessageSquare },
]

export function PortalLayout({ children }: { children: ReactNode }) {
  return <AppShell links={portalLinks}>{children}</AppShell>
}

export function PortalHome() {
  const { user } = useAuth()
  const applications = useQuery('applications', { filters: { studentId: user?.id } })
  const documents = useQuery('documents', { filters: { studentId: user?.id } })
  const appointments = useQuery('appointments', { filters: { studentId: user?.id } })
  const notifications = useQuery('notifications', { filters: { userId: user?.id } })
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hello, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">Your Korea study pathway at a glance.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>Applications</CardTitle></CardHeader><CardContent className="text-3xl font-heading">{applications.total}</CardContent></Card>
        <Card><CardHeader><CardTitle>Documents</CardTitle></CardHeader><CardContent className="text-3xl font-heading">{documents.total}</CardContent></Card>
        <Card><CardHeader><CardTitle>Appointments</CardTitle></CardHeader><CardContent className="text-3xl font-heading">{appointments.total}</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {notifications.items.length === 0 ? <EmptyState title="No notifications" /> : notifications.items.map((n) => (
            <p key={n.id}><strong>{n.title}</strong> — {n.body}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function PortalProfile() {
  const { user } = useAuth()
  const { db, update, create } = useData()
  const { toast } = useToast()
  const profile = db?.studentProfiles.find((p) => p.userId === user?.id)
  const { register, handleSubmit } = useForm({
    values: {
      nationality: profile?.nationality ?? '',
      phone: profile?.phone ?? '',
      educationLevel: profile?.educationLevel ?? '',
      gpa: profile?.gpa ?? '',
      englishScore: profile?.englishScore ?? '',
      intendedIntake: profile?.intendedIntake ?? '',
      budgetRange: profile?.budgetRange ?? '',
    },
  })

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form
        className="grid gap-4"
        onSubmit={handleSubmit((values) => {
          if (profile) update('studentProfiles', profile.id, values)
          else if (user) create('studentProfiles', createRecord({ ...values, userId: user.id }))
          toast('Profile saved')
        })}
      >
        {Object.keys({ nationality: 1, phone: 1, educationLevel: 1, gpa: 1, englishScore: 1, intendedIntake: 1, budgetRange: 1 }).map((key) => (
          <div key={key} className="space-y-2">
            <Label>{labelize(key)}</Label>
            <Input {...register(key as 'nationality')} />
          </div>
        ))}
        <Button type="submit" variant="accent">Save profile</Button>
      </form>
    </div>
  )
}

export function PortalApplications() {
  const { user } = useAuth()
  const apps = useQuery('applications', { filters: { studentId: user?.id } })
  const unis = useQuery('universities')
  const programs = useQuery('programs')
  if (apps.total === 0) {
    return <EmptyState title="No applications yet" description="Ask your counselor to open a Korea application." action={<Button asChild><Link to="/book-consultation">Book counseling</Link></Button>} />
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Applications</h1>
      {apps.items.map((app) => (
        <Link key={app.id} to={`/portal/applications/${app.id}`} className="block rounded-lg border bg-card p-4">
          <p className="font-heading font-semibold">{programs.items.find((p) => p.id === app.programId)?.name}</p>
          <p className="text-sm text-muted-foreground">{unis.items.find((u) => u.id === app.universityId)?.name} · {app.intake}</p>
          <div className="mt-2"><StatusBadge value={app.status} /></div>
        </Link>
      ))}
    </div>
  )
}

export function PortalApplicationDetail() {
  const { id } = useParams()
  const app = useQuery('applications', { filters: { id } }).items[0]
  const idx = app ? APPLICATION_STATUSES.indexOf(app.status) : 0
  const pct = ((idx + 1) / APPLICATION_STATUSES.length) * 100
  if (!app) return <EmptyState title="Application not found" />
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Application timeline</h1>
      <Progress value={pct} />
      <ol className="grid gap-2">
        {APPLICATION_STATUSES.map((status, i) => (
          <li key={status} className={i <= idx ? 'font-medium text-accent' : 'text-muted-foreground'}>
            {i + 1}. {labelize(status)}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function PortalDocuments() {
  const { user } = useAuth()
  const { create, update } = useData()
  const { toast } = useToast()
  const docs = useQuery('documents', { filters: { studentId: user?.id } })
  const { register, handleSubmit, setValue, watch, reset } = useForm<{ category: DocumentCategory; file?: FileList }>({
    defaultValues: { category: 'passport' },
  })
  const category = watch('category')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Documents</h1>
      <form
        className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-3"
        onSubmit={handleSubmit(async (values) => {
          const file = values.file?.[0]
          if (!file || !user) return
          const dataUrl = await fileToDataUrl(file)
          create(
            'documents',
            createRecord<Omit<DocumentRecord, 'id' | 'createdAt'>>({
              studentId: user.id,
              category: values.category,
              status: 'uploaded',
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              dataUrl,
            }),
          )
          toast('Document uploaded')
          reset()
        })}
      >
        <Select value={category} onValueChange={(v) => setValue('category', v as DocumentCategory)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {DOCUMENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{labelize(c)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="file" {...register('file')} />
        <Button type="submit" variant="accent">Upload</Button>
      </form>
      {docs.total === 0 ? <EmptyState title="No documents yet" /> : (
        <div className="space-y-2">
          {docs.items.map((doc) => (
            <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
              <div>
                <p className="font-medium">{doc.fileName}</p>
                <p className="text-xs text-muted-foreground">{labelize(doc.category)} · {formatDate(doc.createdAt)}</p>
                {doc.reviewNote ? <p className="text-xs text-destructive">{doc.reviewNote}</p> : null}
              </div>
              <StatusBadge value={doc.status} />
              {user?.role !== 'student' ? (
                <Button size="sm" variant="outline" onClick={() => update('documents', doc.id, { status: 'under_review' })}>Mark review</Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function PortalAppointments() {
  const { user } = useAuth()
  const filters = user?.role === 'counselor' ? { counselorId: user.id } : { studentId: user?.id }
  const items = useQuery('appointments', { filters })
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button asChild variant="accent"><Link to="/book-consultation">Book</Link></Button>
      </div>
      {items.total === 0 ? <EmptyState title="No appointments" /> : items.items.map((a) => (
        <Card key={a.id}>
          <CardHeader><CardTitle className="text-lg">{formatDateTime(a.scheduledAt)}</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between text-sm">
            <span>{labelize(a.type)} · {a.name}</span>
            <StatusBadge value={a.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PortalRecommendations() {
  const unis = useQuery('universities', { filters: { featured: true } })
  const programs = useQuery('programs', { filters: { featured: true } })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recommended for Korea</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {unis.items.map((u) => (
          <Link key={u.id} to={`/universities/${u.slug}`} className="rounded-lg border bg-card p-4">{u.name}</Link>
        ))}
        {programs.items.map((p) => (
          <Link key={p.id} to={`/programs/${p.slug}`} className="rounded-lg border bg-card p-4">{p.name}</Link>
        ))}
      </div>
    </div>
  )
}

export function PortalMessages() {
  const { user } = useAuth()
  const { db, create } = useData()
  const { toast } = useToast()
  const profile = db?.studentProfiles.find((p) => p.userId === (user?.role === 'student' ? user.id : undefined))
  const studentId = user?.role === 'student' ? user.id : db?.studentProfiles[0]?.userId
  const counselorId = user?.role === 'counselor' ? user.id : profile?.counselorId ?? db?.users.find((u) => u.role === 'counselor')?.id
  const messages = (db?.messages ?? []).filter((m) => m.studentId === studentId && m.counselorId === counselorId)
  const { register, handleSubmit, reset } = useForm<{ body: string }>()

  if (!studentId || !counselorId) return <EmptyState title="No counselor assigned yet" />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Messages</h1>
      <div className="space-y-2 rounded-lg border bg-card p-4">
        {messages.length === 0 ? <p className="text-sm text-muted-foreground">Start the conversation.</p> : messages.map((m) => (
          <div key={m.id} className={m.senderId === user?.id ? 'text-right' : ''}>
            <p className="inline-block rounded-lg bg-muted px-3 py-2 text-sm">{m.body}</p>
            <p className="text-[11px] text-muted-foreground">{formatDateTime(m.createdAt)}</p>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={handleSubmit((values) => {
          if (!user) return
          create(
            'messages',
            createRecord<Omit<Message, 'id' | 'createdAt'>>({
              studentId,
              counselorId,
              senderId: user.id,
              body: values.body,
            }),
          )
          reset()
          toast('Message sent')
        })}
      >
        <Input required {...register('body', { required: true })} placeholder="Write a message" />
        <Button type="submit" variant="accent">Send</Button>
      </form>
    </div>
  )
}

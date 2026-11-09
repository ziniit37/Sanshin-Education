import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from '@/lib/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/contexts/ToastProvider'

export function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <LoginPage />
  return <Navigate to={user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/portal'} replace />
}

export function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<{ email: string; password: string }>()
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">Student, counselor, or admin access.</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          const err = await login(values.email, values.password)
          if (err) {
            setError(err)
            return
          }
          navigate('/portal')
        })}
      >
        <div className="space-y-2"><Label>Email</Label><Input type="email" required {...register('email')} /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" required {...register('password')} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" variant="accent">Sign in</Button>
      </form>
      <Button
        variant="outline"
        className="mt-3 w-full"
        onClick={async () => {
          await loginWithGoogle('Google Student', 'google.student@sanshin.education')
          toast('Signed in with Google (demo)', 'Connect a Google client ID for production OAuth.')
          navigate('/portal')
        }}
      >
        Continue with Google
      </Button>
      <div className="mt-4 space-y-1 text-sm">
        <p><Link className="text-accent" to="/forgot-password">Forgot password?</Link></p>
        <p>New here? <Link className="text-accent" to="/register">Create an account</Link></p>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Demo: admin@sanshin.education / Admin123! · counselor@sanshin.education / Counsel123! · student@sanshin.education / Student123!
      </p>
    </div>
  )
}

export function RegisterPage() {
  const { register: signup } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<{ name: string; email: string; password: string }>()
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Create your student account</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          const result = await signup(values.name, values.email, values.password)
          if (result.error) {
            setError(result.error)
            return
          }
          navigate(`/verify-email?email=${encodeURIComponent(values.email)}&otp=${result.otp ?? ''}`)
        })}
      >
        <div className="space-y-2"><Label>Full name</Label><Input required {...register('name')} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" required {...register('email')} /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" required {...register('password')} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" variant="accent">Register</Button>
      </form>
      <p className="mt-4 text-sm">Already registered? <Link className="text-accent" to="/login">Sign in</Link></p>
    </div>
  )
}

export function VerifyEmailPage() {
  const [params] = useSearchParams()
  const { verifyOtp } = useAuth()
  const navigate = useNavigate()
  const email = params.get('email') ?? ''
  const demoOtp = params.get('otp') ?? ''
  const { register, handleSubmit } = useForm({ defaultValues: { code: demoOtp } })
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Verify email</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter the OTP sent to {email || 'your email'}.</p>
      {demoOtp ? <p className="mt-2 text-sm text-accent">Demo OTP (would be emailed): {demoOtp}</p> : null}
      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          const err = await verifyOtp(email, values.code)
          if (err) {
            setError(err)
            return
          }
          navigate('/portal')
        })}
      >
        <div className="space-y-2"><Label>OTP</Label><Input required {...register('code')} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" variant="accent">Verify and continue</Button>
      </form>
    </div>
  )
}

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const { toast } = useToast()
  const { register, handleSubmit } = useForm<{ email: string }>()
  const [emailSent, setEmailSent] = useState(false)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Reset password</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          const result = await requestPasswordReset(values.email)
          if (result.error) {
            toast('Unable to reset', result.error)
            return
          }
          try {
            const response = await fetch('/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: values.email, token: result.token }),
            })
            const responseBody: unknown = await response.json()
            if (!response.ok) {
              const message =
                typeof responseBody === 'object'
                && responseBody !== null
                && 'error' in responseBody
                && typeof responseBody.error === 'string'
                  ? responseBody.error
                  : 'We could not send your reset email. Please try again shortly.'
              toast('Unable to send reset email', message)
              return
            }
            setEmailSent(true)
          } catch {
            toast('Unable to send reset email', 'We could not send your reset email. Please try again shortly.')
          }
        })}
      >
        <div className="space-y-2"><Label>Email</Label><Input type="email" required {...register('email')} /></div>
        <Button type="submit" variant="accent">Send reset link</Button>
      </form>
      {emailSent ? <p className="mt-4 text-sm text-muted-foreground">If an account exists for that address, a password reset link has been emailed.</p> : null}
    </div>
  )
}

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<{ password: string }>()
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Choose a new password</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          const err = await resetPassword(token, values.password)
          if (err) {
            setError(err)
            return
          }
          navigate('/login')
        })}
      >
        <div className="space-y-2"><Label>New password</Label><Input type="password" required {...register('password')} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" variant="accent">Update password</Button>
      </form>
    </div>
  )
}

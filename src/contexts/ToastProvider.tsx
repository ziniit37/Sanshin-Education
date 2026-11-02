import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Toast {
  id: number
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((title: string, description?: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description }])
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[80] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              'rounded-lg border bg-card p-4 shadow-lg animate-fade-up',
            )}
          >
            <p className="font-heading text-sm font-semibold">{item.title}</p>
            {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

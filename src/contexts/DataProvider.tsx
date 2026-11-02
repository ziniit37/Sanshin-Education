import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { countWhere, getDb, initDb, queryCollection, setDb, subscribeDb, type QueryOptions } from '@/lib/db'
import type { CollectionName, Database } from '@/lib/types'
import { nowIso, uid } from '@/lib/utils'

interface DataContextValue {
  ready: boolean
  db: Database | null
  query: typeof queryCollection
  count: typeof countWhere
  create: <K extends CollectionName>(name: K, record: Database[K][number]) => void
  update: <K extends CollectionName>(name: K, id: string, patch: Partial<Database[K][number]>) => void
  remove: <K extends CollectionName>(name: K, id: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    void initDb().then(() => {
      setReady(true)
      setVersion((v) => v + 1)
    })
    return subscribeDb(() => setVersion((v) => v + 1))
  }, [])

  const value = useMemo<DataContextValue>(() => {
    const db = ready ? getDb() : null
    return {
      ready,
      db,
      query: queryCollection,
      count: countWhere,
      create: (name, record) => {
        setDb((current) => ({
          ...current,
          [name]: [...current[name], record],
        }))
      },
      update: (name, id, patch) => {
        setDb((current) => ({
          ...current,
          [name]: current[name].map((row) =>
            (row as { id: string }).id === id ? { ...row, ...patch } : row,
          ),
        }))
      },
      remove: (name, id) => {
        setDb((current) => ({
          ...current,
          [name]: current[name].filter((row) => (row as { id: string }).id !== id),
        }))
      },
    }
  }, [ready, version])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export function useQuery<K extends CollectionName>(name: K, options: QueryOptions = {}) {
  const { ready, db } = useData()
  const serialized = JSON.stringify(options)
  return useMemo(() => {
    if (!ready || !db) return { items: [] as Database[K], total: 0, loading: true }
    return { ...queryCollection(name, JSON.parse(serialized) as QueryOptions), loading: false }
  }, [ready, db, name, serialized])
}

export function createRecord<T extends object>(
  partial: T & { id?: string; createdAt?: string },
): T & { id: string; createdAt: string } {
  return {
    ...partial,
    id: partial.id ?? uid(),
    createdAt: partial.createdAt ?? nowIso(),
  }
}

import { createSeed } from '@/lib/seed'
import type { CollectionName, Database } from '@/lib/types'

const STORAGE_KEY = 'sanshin.db.v2'

let memory: Database | null = null
const listeners = new Set<() => void>()

export function subscribeDb(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit() {
  listeners.forEach((fn) => fn())
}

function persist(db: Database) {
  memory = db
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  emit()
}

export function getDb(): Database {
  if (memory) return memory
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    memory = JSON.parse(raw) as Database
    return memory
  }
  throw new Error('Database not initialized')
}

export async function initDb() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    memory = JSON.parse(raw) as Database
    return memory
  }
  const seed = await createSeed()
  persist(seed)
  return seed
}

export function resetDb(next: Database) {
  persist(next)
}

export function setDb(updater: (db: Database) => Database) {
  persist(updater(structuredClone(getDb())))
}

export function listCollection<K extends CollectionName>(name: K): Database[K] {
  return getDb()[name]
}

export interface QueryOptions {
  filters?: Record<string, unknown>
  search?: string
  searchFields?: string[]
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export function queryCollection<K extends CollectionName>(name: K, options: QueryOptions = {}) {
  const {
    filters = {},
    search = '',
    searchFields = [],
    sortKey,
    sortDir = 'asc',
    page = 1,
    pageSize,
  } = options
  let rows = [...getDb()[name]].map((value) => ({
    value,
    fields: Object.fromEntries(Object.entries(value)) as Record<string, unknown>,
  }))

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '' || value === 'all') continue
    rows = rows.filter((row) => row.fields[key] === value)
  }

  const q = search.trim().toLowerCase()
  if (q && searchFields.length) {
    rows = rows.filter((row) =>
      searchFields.some((field) => String(row.fields[field] ?? '').toLowerCase().includes(q)),
    )
  }

  if (sortKey) {
    rows.sort((a, b) => {
      const av = String(a.fields[sortKey] ?? '')
      const bv = String(b.fields[sortKey] ?? '')
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }

  const total = rows.length
  const start = pageSize ? (page - 1) * pageSize : 0
  const items = pageSize ? rows.slice(start, start + pageSize) : rows
  return { items: items.map(({ value }) => value) as unknown as Database[K], total }
}

export function countWhere<K extends CollectionName>(name: K, filters: Record<string, unknown> = {}) {
  return queryCollection(name, { filters }).total
}

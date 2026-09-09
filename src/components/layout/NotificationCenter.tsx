'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bell, Check, Loader2 } from 'lucide-react'

type NotificationItem = {
  id: string
  title: string
  body: string
  href: string | null
  read_at: string | null
  created_at: string
}

function relativeDate(value: string) {
  const age = Math.max(0, Date.now() - new Date(value).getTime())
  const minutes = Math.floor(age / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])

  async function load() {
    setLoading(true)
    try {
      const response = await fetch('/api/notifications', { cache: 'no-store' })
      if (response.ok) {
        const payload = await response.json() as { data?: NotificationItem[] }
        setItems(payload.data ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function markRead(id: string) {
    setItems(current => current.map(item => item.id === id ? { ...item, read_at: new Date().toISOString() } : item))
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) })
  }

  async function markAllRead() {
    setItems(current => current.map(item => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })))
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllRead: true }) })
  }

  const unreadCount = items.filter(item => !item.read_at).length

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(current => !current)} className="relative rounded-xl p-2 text-slate-500 hover:bg-white" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} aria-expanded={open}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-orange-500 px-0.5 text-[8px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>
      {open && <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><p className="text-sm font-bold text-slate-900">Notifications</p><p className="text-[11px] text-slate-400">Deadlines and application updates</p></div>{unreadCount > 0 && <button type="button" onClick={() => void markAllRead()} className="text-[11px] font-semibold text-indigo-600 hover:underline">Mark all read</button>}</div>
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && <div className="flex items-center justify-center gap-2 p-6 text-xs text-slate-400"><Loader2 size={14} className="animate-spin" />Loading</div>}
          {!loading && items.length === 0 && <div className="p-6 text-center text-xs leading-5 text-slate-400"><Check className="mx-auto mb-2 text-emerald-500" size={18} />You are all caught up.</div>}
          {!loading && items.map(item => <div key={item.id} className={`rounded-xl p-3 ${item.read_at ? '' : 'bg-indigo-50/60'}`}>
            {item.href ? <Link href={item.href} onClick={() => void markRead(item.id)} className="block"><p className="text-xs font-bold text-slate-800">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.body}</p><p className="mt-1 text-[10px] text-slate-400">{relativeDate(item.created_at)}</p></Link> : <button type="button" onClick={() => void markRead(item.id)} className="block w-full text-left"><p className="text-xs font-bold text-slate-800">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.body}</p><p className="mt-1 text-[10px] text-slate-400">{relativeDate(item.created_at)}</p></button>}
          </div>)}
        </div>
      </div>}
    </div>
  )
}

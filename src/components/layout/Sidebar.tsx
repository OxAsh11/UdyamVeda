'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GTM_TOOLS_ENABLED } from '@/lib/features/gtm'
import { BarChart2, Bell, Building2, Calendar, ClipboardCheck, Files, Landmark, LayoutDashboard, LogOut, Menu, Search, Settings, ShieldCheck, Target, User, X, Play } from 'lucide-react'

interface SidebarProps { userName: string; setupSchemes: boolean; gtmPlatform: boolean }

function NavItem({ href, icon: Icon, label, pathname, onNavigate }: { href: string; icon: React.ElementType; label: string; pathname: string; onNavigate: () => void }) {
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`))
  return <Link href={href} onClick={onNavigate} className={`nav-item ${isActive ? 'active' : ''}`}><Icon size={16} strokeWidth={isActive ? 2.4 : 1.9} /><span className="flex-1">{label}</span></Link>
}

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const nav = (href: string, icon: React.ElementType, label: string) => <NavItem href={href} icon={icon} label={label} pathname={pathname} onNavigate={closeMobile} />

  const navContent = <>
    <div className="mb-6 flex items-center justify-between px-3"><Link href="/dashboard" onClick={closeMobile} className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-lg shadow-indigo-200">✦</span><span><span className="block text-lg font-extrabold tracking-tight text-slate-900">UdyamVeda</span><span className="block text-[10px] font-medium text-slate-400">Business lifecycle OS</span></span></Link><button onClick={closeMobile} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden" aria-label="Close menu"><X size={18} /></button></div>
    <nav className="flex flex-col gap-1">
      {nav('/dashboard', LayoutDashboard, 'Home')}
      <div className="section-label">Start & Operate</div>
      {nav('/dashboard/registration', Building2, 'Registration & Licences')}
      {nav('/dashboard/schemes', Landmark, 'Opportunities')}
      {nav('/dashboard/applications', ClipboardCheck, 'Applications')}
      {nav('/dashboard/compliance', ShieldCheck, 'Compliance')}
      {nav('/dashboard/documents', Files, 'Document Vault')}
      {GTM_TOOLS_ENABLED && <>
        <div className="section-label">Grow</div>
        {nav('/dashboard/strategy', Target, 'Strategy')}
        {nav('/dashboard/plays', Play, 'Plays')}
        {nav('/dashboard/calendar', Calendar, 'Calendar')}
        {nav('/dashboard/track', BarChart2, 'Track')}
      </>}
    </nav>
    <div className="mt-auto flex flex-col gap-1"><div className="mb-3 mt-5 border-t border-slate-200" />{nav('/dashboard/settings', Settings, 'Settings')}<div className="nav-item mt-1 cursor-default hover:bg-transparent hover:text-slate-500"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-rose-200"><User size={13} className="text-rose-700" /></div><span className="truncate text-xs text-slate-600">{userName}</span><Bell size={14} className="ml-auto text-slate-300" /></div><button onClick={handleSignOut} className="nav-item text-slate-400 hover:text-rose-500"><LogOut size={16} /><span>Sign out</span></button></div>
  </>

  return <><div className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md md:hidden"><button onClick={() => setMobileOpen(true)} className="-ml-2 rounded-xl p-2 text-slate-600 hover:bg-slate-100" aria-label="Open menu"><Menu size={20} /></button><span className="font-extrabold tracking-tight text-slate-900">UdyamVeda</span><Search size={17} className="ml-auto text-slate-400" /></div>{mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm md:hidden" onClick={closeMobile} />}<aside className={['glass-sidebar flex shrink-0 flex-col px-3 py-5', 'fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 md:static md:min-h-screen md:w-64 md:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full'].join(' ')}>{navContent}</aside></>
}

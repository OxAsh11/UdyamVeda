'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Building2,
  Landmark,
  ShieldCheck,
  Lightbulb,
  PenTool,
  Megaphone,
  Share2,
  BarChart2,
  Settings,
  LogOut,
  User,
} from 'lucide-react'

interface SidebarProps {
  userName: string
  setupSchemes: boolean
  gtmPlatform: boolean
}

export default function Sidebar({ userName, setupSchemes, gtmPlatform }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function NavItem({ href, icon: Icon, label, active }: {
    href: string
    icon: React.ElementType
    label: string
    active?: boolean
  }) {
    const isActive = active ?? pathname === href
    return (
      <Link href={href} className={`nav-item ${isActive ? 'active' : ''}`}>
        <Icon size={16} />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <aside className="glass-sidebar w-56 flex flex-col min-h-screen py-5 px-3 shrink-0">
      {/* Logo */}
      <div className="px-3 mb-6">
        <div className="text-lg font-bold text-neutral-900 tracking-tight">Center</div>
        <div className="text-neutral-400 text-xs mt-0.5">Your business OS</div>
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />

        {/* Module 1 */}
        {setupSchemes && (
          <>
            <div className="section-label mt-3">Setup & Schemes</div>
            <NavItem href="/dashboard/registration" icon={Building2} label="Registration" />
            <NavItem href="/dashboard/schemes" icon={Landmark} label="Schemes" />
            <NavItem href="/dashboard/compliance" icon={ShieldCheck} label="Compliance" />
          </>
        )}

        {/* Module 2 */}
        {gtmPlatform && (
          <>
            <div className="section-label mt-3">GTM Platform</div>
            <NavItem href="/dashboard/ideate" icon={Lightbulb} label="Ideate" />
            <NavItem href="/dashboard/drawing-board" icon={PenTool} label="Drawing Board" />
            <NavItem href="/dashboard/campaigns" icon={Megaphone} label="Campaigns" />
            <NavItem href="/dashboard/distribute" icon={Share2} label="Distribute" />
            <NavItem href="/dashboard/track" icon={BarChart2} label="Track" />
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="mt-auto flex flex-col gap-0.5">
        <div className="border-t border-neutral-200 mb-3" />
        <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />

        {/* User */}
        <div className="nav-item mt-1">
          <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center shrink-0">
            <User size={12} className="text-neutral-500" />
          </div>
          <span className="truncate text-neutral-600 text-xs">{userName}</span>
        </div>

        <button onClick={handleSignOut} className="nav-item text-neutral-400 hover:text-red-400">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

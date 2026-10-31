import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: { default: 'Udyam Veda — clearer paths for Indian businesses', template: '%s · Udyam Veda' },
  description: 'Find trusted government resources, practical business guides, and fresh signals for your next move.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Udyam Veda' },
  icons: { icon: '/icons/icon.svg', apple: '/icons/icon.svg' },
  other: { 'mobile-web-app-capable': 'yes' },
}

export const viewport: Viewport = { themeColor: '#102a43', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full">{children}<Toaster /><Script id="service-worker" strategy="afterInteractive">{`if ('serviceWorker' in navigator) { window.addEventListener('load', async function() { const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1'; if (isLocal) { const registrations = await navigator.serviceWorker.getRegistrations(); await Promise.all(registrations.map(function(registration) { return registration.unregister(); })); const cacheKeys = await caches.keys(); await Promise.all(cacheKeys.map(function(key) { return caches.delete(key); })); return; } navigator.serviceWorker.register('/sw.js').catch(function() {}); }); }`}</Script></body></html>
}

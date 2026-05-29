import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Primo CS Dashboard',
  description: 'Customer health dashboard for the Primo CS team',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-primo-bg text-primo-dark">
        <header className="bg-primo-dark px-6 py-3 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#0EC8CC"/>
            <path d="M8 22V10h8a5 5 0 010 10H8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white font-semibold text-sm tracking-wide">Primo</span>
          <span className="text-white/30 text-sm mx-1">·</span>
          <span className="text-white/50 text-sm">CS Dashboard</span>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  )
}

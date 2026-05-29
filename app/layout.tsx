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
        <header className="bg-primo-dark px-6 py-3 flex items-center gap-3">
          <img src="/logo.png" alt="Primo" style={{ height: '24px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          <span className="text-white/30 text-sm">·</span>
          <span className="text-white/50 text-sm">CS Dashboard</span>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  )
}

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
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <span className="font-semibold text-gray-800">Primo CS</span>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  )
}

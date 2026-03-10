import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobCard – Digital Setup Sheets for CNC Shops',
  description: 'Replace paper job cards with a fast, mobile-first digital tool. Track setups, tooling, and process routes — all in one place.',
  openGraph: {
    title: 'JobCard – Digital Setup Sheets for CNC Shops',
    description: 'Replace paper job cards with a fast, mobile-first digital tool.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

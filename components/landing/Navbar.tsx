'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold text-blue-700 tracking-tight">
          JobCard
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="text-sm bg-blue-700 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 flex flex-col gap-4">
          <a href="#features" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm text-gray-700" onClick={() => setOpen(false)}>How It Works</a>
          <a href="#pricing" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Pricing</a>
          <a href="#contact" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Contact</a>
          <hr className="border-gray-200" />
          <Link href="/login" className="text-sm text-gray-700 font-medium" onClick={() => setOpen(false)}>Log In</Link>
          <Link href="/signup" className="text-sm bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  )
}

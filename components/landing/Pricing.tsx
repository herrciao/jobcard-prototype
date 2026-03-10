'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'Perfect for trying JobCard.',
    features: [
      '1 active job card',
      '1 product flow sheet',
      'Photo & video capture',
      'Mobile-optimized',
      'Cloud save',
    ],
    cta: 'Get Started Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 12, yearly: 99 },
    desc: 'For shops that run daily.',
    features: [
      'Unlimited job cards',
      'Unlimited product flows',
      'Photo & video capture',
      'Mobile-optimized',
      'Cloud save',
      'Team sharing (coming soon)',
      'Export to PDF (coming soon)',
    ],
    cta: 'Start Pro Trial',
    href: '/signup?plan=pro',
    highlight: true,
  },
]

export default function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-gray-500 text-lg mb-8">Start free. Upgrade when you&apos;re ready.</p>

          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!yearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${yearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Yearly <span className="text-green-600 font-semibold">–30%</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${plan.highlight ? 'border-blue-600 bg-blue-700 text-white' : 'border-gray-200 bg-white text-gray-900'}`}
            >
              <div className={`text-sm font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                {plan.name}
              </div>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-extrabold">
                  ${yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && (
                  <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>
                    /{yearly ? 'yr' : 'mo'}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.desc}</p>

              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${plan.highlight ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-white text-blue-700 hover:bg-blue-50'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

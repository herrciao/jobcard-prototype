import { useTranslations } from 'next-intl'

export default function Features() {
  const t = useTranslations('features')

  const features = [
    {
      tag: t('jobcardTag'),
      title: t('jobcardTitle'),
      desc: t('jobcardDesc'),
      highlights: [t('jobcardH1'), t('jobcardH2'), t('jobcardH3'), t('jobcardH4')],
      color: 'blue' as const,
    },
    {
      tag: t('flowTag'),
      title: t('flowTitle'),
      desc: t('flowDesc'),
      highlights: [t('flowH1'), t('flowH2'), t('flowH3'), t('flowH4')],
      color: 'indigo' as const,
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f) => (
            <div key={f.tag} className={`rounded-2xl p-8 border ${f.color === 'blue' ? 'border-blue-100 bg-blue-50' : 'border-indigo-100 bg-indigo-50'}`}>
              <span className={`text-xs font-semibold uppercase tracking-widest ${f.color === 'blue' ? 'text-blue-600' : 'text-indigo-600'}`}>
                {f.tag}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{f.desc}</p>
              <ul className="space-y-2">
                {f.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${f.color === 'blue' ? 'bg-blue-600' : 'bg-indigo-600'}`}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

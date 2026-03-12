import { useTranslations } from 'next-intl'

export default function Problem() {
  const t = useTranslations('problem')

  const problems = [
    { icon: '📄', title: t('card1Title'), desc: t('card1Desc') },
    { icon: '🔁', title: t('card2Title'), desc: t('card2Desc') },
    { icon: '📞', title: t('card3Title'), desc: t('card3Desc') },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

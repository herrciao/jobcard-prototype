import { useTranslations } from 'next-intl'

export default function HowItWorks() {
  const t = useTranslations('howItWorks')

  const steps = [
    { number: '01', title: t('step1Title'), desc: t('step1Desc') },
    { number: '02', title: t('step2Title'), desc: t('step2Desc') },
    { number: '03', title: t('step3Title'), desc: t('step3Desc') },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-700 text-white text-xl font-bold rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

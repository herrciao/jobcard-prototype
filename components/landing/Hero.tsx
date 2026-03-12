import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          {t('badge')}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          {t('titleLine1')}<br />
          <span className="text-blue-700">{t('titleLine2')}</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
          >
            {t('ctaStart')}
          </Link>
          <a
            href="#features"
            className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl text-base border border-gray-300 hover:border-gray-400 transition-colors"
          >
            {t('ctaFeatures')}
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">{t('noCreditCard')}</p>

        <div className="mt-16 mx-auto max-w-sm bg-gray-900 rounded-3xl p-3 shadow-2xl">
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
              <span className="text-white text-sm font-medium">CNCLog</span>
              <span className="text-gray-400 text-xs">{t('mockSaved')}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">{t('mockPartName')}</div>
                <div className="text-gray-900 text-sm font-medium">{t('mockPartValue')}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">{t('mockMachine')}</div>
                  <div className="text-gray-900 text-sm font-medium">CNC-03</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">{t('mockMaterial')}</div>
                  <div className="text-gray-900 text-sm font-medium">12L14</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-blue-700 text-xs font-medium mb-2">{t('mockTools')}</div>
                <div className="flex justify-between text-xs text-gray-700">
                  <span>T01</span><span>BT40-ER32</span><span>CCMT 09T304</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

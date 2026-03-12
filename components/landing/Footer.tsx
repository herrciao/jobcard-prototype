import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="text-white text-xl font-bold tracking-tight">
              JobCard
            </Link>
            <p className="text-sm mt-3 leading-relaxed">{t('description')}</p>
            <p className="text-xs mt-3 text-gray-500 leading-relaxed">{t('gdpr')}</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t('product')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">{tn('features')}</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">{tn('pricing')}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{tn('howItWorks')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#contact" className="hover:text-white transition-colors">{tn('contact')}</a></li>
              <li><Link href="/login" className="hover:text-white transition-colors">{tn('login')}</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">{tn('getStarted')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm">{t('copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-xs text-gray-600">{t('tagline')}</p>
        </div>
      </div>
    </footer>
  )
}

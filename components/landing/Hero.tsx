import Link from 'next/link'

export default function Hero() {
  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Built for CNC Shops
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          Ditch the Paper.<br />
          <span className="text-blue-700">Go Digital with JobCard.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          A mobile-first digital job card for CNC setters. Log tooling, setup parameters,
          process routes, and photos — fast, from your phone, on the shop floor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
          >
            Start Free Trial
          </Link>
          <a
            href="#features"
            className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl text-base border border-gray-300 hover:border-gray-400 transition-colors"
          >
            See How It Works
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">No credit card required for free plan.</p>

        {/* Mock phone screenshot */}
        <div className="mt-16 mx-auto max-w-sm bg-gray-900 rounded-3xl p-3 shadow-2xl">
          <div className="bg-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-gray-700 px-4 py-3 flex items-center justify-between">
              <span className="text-white text-sm font-medium">Job Card</span>
              <span className="text-gray-400 text-xs">Saved ✓</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-400 text-xs mb-1">Part Name</div>
                <div className="text-gray-900 text-sm font-medium">309N-27B Sanding Disc</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Machine</div>
                  <div className="text-gray-900 text-sm font-medium">CNC-03</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-400 text-xs mb-1">Material</div>
                  <div className="text-gray-900 text-sm font-medium">12L14</div>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-blue-700 text-xs font-medium mb-2">Tools</div>
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

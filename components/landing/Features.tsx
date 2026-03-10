const features = [
  {
    tag: 'Job Card',
    title: 'Digital Setup Sheet',
    desc: 'Log part name, machine, material, program ID, cycle time, collets, guide bush, coolant, ejector bar, tooling table, warnings, photos, and video — all in one tap.',
    highlights: ['Tool table with holder + insert', 'Photo & video capture', 'Setup parameters grid', 'Auto-saved to cloud'],
    color: 'blue',
  },
  {
    tag: 'Product Flow',
    title: 'Process Route Sheet',
    desc: 'Track where each part goes after your machine. Map out every vendor, subcontractor, and process step in a clear visual route.',
    highlights: ['Visual step-by-step route', 'Vendor per step', 'Multi-customer support', 'Instant search by part no.'],
    color: 'indigo',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Two tools. One workflow.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything a CNC setter needs to document a setup and track a part.
          </p>
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

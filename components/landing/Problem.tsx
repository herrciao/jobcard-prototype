const problems = [
  {
    icon: '📄',
    title: 'Paper job cards get lost',
    desc: 'Handwritten setup sheets disappear, get oil-stained, or are illegible by the next shift.',
  },
  {
    icon: '🔁',
    title: 'No setup history',
    desc: 'Every time you run a part again, you start from scratch — because nothing was saved.',
  },
  {
    icon: '📞',
    title: 'Chasing information',
    desc: 'Setters call each other trying to remember tooling or collet sizes from months ago.',
  },
]

export default function Problem() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sound familiar?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            CNC shops run on tribal knowledge. JobCard fixes that.
          </p>
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

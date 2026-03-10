const steps = [
  {
    number: '01',
    title: 'Create an account',
    desc: 'Sign up in 30 seconds with your email or Google account.',
  },
  {
    number: '02',
    title: 'Fill in your setup',
    desc: 'Open a new Job Card on your phone, fill in tooling, parameters, and snap photos right on the shop floor.',
  },
  {
    number: '03',
    title: 'Access from anywhere',
    desc: 'Your setup is saved to the cloud. Any team member can pull up the card on any device, any time.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No training required. If you can fill in a form, you can use JobCard.
          </p>
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

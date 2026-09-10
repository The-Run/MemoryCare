import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '📔', title: 'Care & Memory Passport', desc: 'A personalized profile of who this person is — their language, life story, and preferences.' },
  { icon: '🗺️', title: 'NER Cultural Intelligence', desc: 'Music, food, festivals and stories from all 8 North Eastern states, used as candidate stimuli — never assumptions.' },
  { icon: '🧠', title: 'Adaptive Care Engine', desc: 'Activities shift automatically across Early → Moderate → Advanced dementia stages.' },
  { icon: '👀', title: 'Learns From Every Response', desc: 'Every observed engagement compares against the patient\'s own baseline — not a generic score.' },
  { icon: '📶', title: 'Offline-First', desc: 'Works fully on-device with no connectivity, and syncs safely when back online.' },
  { icon: '🤖', title: 'Caregiver AI Copilot', desc: 'Action-oriented recommendations, not a generic chatbot.' },
]

const LOOP = ['Interact', 'Observe', 'Compare with baseline', 'Learn', 'Adapt next activity', 'Caregiver feedback', 'Update profile']

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-navy-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <div>
            <div className="text-base font-bold leading-tight text-navy-800">MemoryCare</div>
            <div className="text-[11px] tracking-wide text-navy-400">NER</div>
          </div>
        </div>
        <Link to="/login" className="rounded-full bg-navy-600 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          Sign in
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-10 text-center">
        <span className="inline-block rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-500">
          Smart India Hackathon Prototype
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-navy-900 sm:text-5xl">
          Dementia care that knows the person, <span className="text-navy-500">not just the diagnosis.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-navy-500 sm:text-lg">
          A culturally intelligent, multilingual, offline-first care companion for elderly people across the North
          Eastern Region of India — adapting to each patient's stage, culture and responses.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login" className="rounded-full bg-navy-600 px-6 py-3 text-sm font-semibold text-white hover:bg-navy-700">
            Get Started
          </Link>
          <Link to="/login" className="rounded-full border border-navy-200 bg-white px-6 py-3 text-sm font-semibold text-navy-700 hover:bg-navy-50">
            Continue as Demo Caregiver
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-5 card-shadow">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-navy-800">{f.title}</h3>
              <p className="mt-1 text-sm text-navy-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl bg-navy-800 p-8 text-white sm:p-10">
          <h2 className="text-center text-xl font-semibold">The core product loop</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            {LOOP.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-navy-600 px-3 py-1.5 font-medium">{step}</span>
                {i < LOOP.length - 1 && <span className="text-navy-400">→</span>}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-navy-200">
            This system knows the person → understands their culture → adapts to their stage → observes their
            response → learns from it → changes the next interaction → helps the caregiver.
          </p>
        </div>
      </section>

      <footer className="border-t border-navy-100 py-6 text-center text-xs text-navy-400">
        MemoryCare NER · Not a diagnostic tool · Observational insights only, always reviewed by a caregiver/clinician.
      </footer>
    </div>
  )
}

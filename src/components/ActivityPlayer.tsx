import { useState } from 'react'
import type { Activity, Memory, Patient, PatientPicture } from '../types'
import { usePatientData } from '../store/DataContext'
import { getCulturalData } from '../data/cultural'
import { VoiceService } from '../services/voiceService'
import { PrimaryButton } from './atoms'

interface ChoiceOption {
  id: string
  /** The name the question asks by — must match the prompt exactly. */
  name: string
  /** Optional warmer sub-label, e.g. "My Son — Rohan". */
  sublabel?: string
  icon: string
  correct: boolean
}

interface Task {
  prompt: string
  options: ChoiceOption[]
  /** Item the patient must memorize before answering (memory tasks). */
  study?: { name: string; icon: string }
  /** Item shown alongside the question to match against (attention tasks). */
  target?: { name: string; icon: string }
}

interface Item {
  id: string
  name: string
  sublabel?: string
  icon: string
}

/**
 * Task content, split by provenance so the spec's priority order holds:
 * the patient's OWN pictures and recorded memories are always preferred,
 * and generic cultural content is only a candidate — used to fill in when
 * a patient has little personal content yet (e.g. a brand-new profile).
 */
function itemPools(patient: Patient, pics: PatientPicture[], memories: Memory[]): { personal: Item[]; cultural: Item[] } {
  const personal: Item[] = pics.map((p) => ({ id: p.id, name: p.personOrPlace, sublabel: p.label, icon: p.icon }))
  for (const m of memories) {
    if (!personal.some((i) => i.name.toLowerCase() === m.title.toLowerCase())) {
      personal.push({ id: m.id, name: m.title, icon: m.icon })
    }
  }
  const data = getCulturalData(patient.state)
  const cultural: Item[] = []
  for (const c of [...(data?.visualObjects ?? []), ...(data?.places ?? []), ...(data?.food ?? [])]) {
    if (!personal.some((i) => i.name.toLowerCase() === c.title.toLowerCase())) {
      cultural.push({ id: `cul-${c.title}`, name: c.title, icon: c.icon })
    }
  }
  return { personal, cultural }
}

const randomOf = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

/**
 * Pick the item being asked about plus one distractor. The target is drawn
 * from personal content whenever the patient has any; cultural content only
 * backfills. Runs once per mount — never re-randomizes mid-question.
 */
function pickTwo(personal: Item[], cultural: Item[]): [Item, Item] | null {
  const target = personal.length > 0 ? randomOf(personal) : cultural.length > 0 ? randomOf(cultural) : null
  if (!target) return null

  const others = [...personal, ...cultural].filter((i) => i.id !== target.id && i.icon !== target.icon)
  if (others.length === 0) return null
  return [target, randomOf(others)]
}

function firstWord(text: string) {
  return (text.split(/[\s,(]/)[0] ?? text).replace(/[^A-Za-z-]/g, '')
}

function buildTask(activity: Activity, patient: Patient, pics: PatientPicture[], memories: Memory[]): Task | null {
  const { personal, cultural } = itemPools(patient, pics, memories)

  if (activity.type === 'recognition' || activity.type === 'memory' || activity.type === 'attention') {
    const pair = pickTwo(personal, cultural)
    if (!pair) return null
    const [target, distractor] = pair
    const correctFirst = Math.random() < 0.5
    const options: ChoiceOption[] = [
      { id: target.id, name: target.name, sublabel: target.sublabel, icon: target.icon, correct: true },
      { id: distractor.id, name: distractor.name, sublabel: distractor.sublabel, icon: distractor.icon, correct: false },
    ]
    if (!correctFirst) options.reverse()

    if (activity.type === 'recognition') {
      // Asks by the exact same name shown on the button.
      return { prompt: `Which one is ${target.name}?`, options }
    }
    if (activity.type === 'attention') {
      // "Find the matching object" — the target is on screen to match against.
      return { prompt: 'Find the one that matches.', target: { name: target.name, icon: target.icon }, options }
    }
    // memory: study the item first, then choose it from memory.
    return {
      prompt: 'Which picture did you just see?',
      study: { name: target.name, icon: target.icon },
      options,
    }
  }

  if (activity.type === 'language') {
    const person = patient.importantPeople[0]
    const relation = person ? firstWord(person.relation) : 'friend'
    return {
      prompt: 'Complete the sentence: "Good morning, this is my ___"',
      options: [
        { id: 'a', name: relation, icon: '👤', correct: true },
        { id: 'b', name: 'stranger', icon: '❓', correct: false },
      ],
    }
  }

  if (activity.type === 'sequencing') {
    return {
      prompt: 'What comes first in the morning?',
      options: [
        { id: 'a', name: 'Wake up and wash', icon: '🪥', correct: true },
        { id: 'b', name: 'Go to sleep', icon: '🛌', correct: false },
      ],
    }
  }

  return null
}

export function ActivityPlayer({
  activity,
  patient,
  patientMode = false,
  onOutcome,
  onAdvance,
}: {
  activity: Activity
  patient: Patient
  patientMode?: boolean
  /** Fired when the patient actually responds (answer chosen, media played). */
  onOutcome?: (outcome: { correct?: boolean; label?: string }) => void
  /** Fired when moving on — never records a response on its own. */
  onAdvance?: () => void
}) {
  const { pictures, music, memories } = usePatientData(patient.id)

  // Built ONCE per mount. Callers remount via key={activity.id}, so a new
  // activity gets a fresh task — but recording a response (which mutates
  // global data and re-renders this component) can never reshuffle the
  // options underneath the person answering.
  const [task] = useState(() => buildTask(activity, patient, pictures, memories))
  const [selected, setSelected] = useState<string | null>(null)
  const [studied, setStudied] = useState(false)
  const [playing, setPlaying] = useState(false)

  const track = music[0]
  const isAudio = activity.type === 'music' || activity.type === 'comfort'
  const isVoicePrompt = activity.type === 'voice' || activity.type === 'conversation'
  const chosen = task?.options.find((o) => o.id === selected)
  const answered = !!chosen

  const handleChoice = (opt: ChoiceOption) => {
    if (answered) return
    setSelected(opt.id)
    if (patientMode) {
      VoiceService.speak(opt.correct ? 'Great!' : "That's alright. Let's try another one.", patient.language)
    }
    onOutcome?.({ correct: opt.correct, label: opt.name })
  }

  const handlePlay = () => {
    setPlaying(true)
    VoiceService.speak(track ? track.title : activity.title, patient.language)
    setTimeout(() => setPlaying(false), 3000)
    onOutcome?.({ label: track?.title ?? activity.title })
  }

  // Memory tasks: study the item, then answer from memory.
  const inStudyPhase = !!task?.study && !studied

  return (
    <div className={`rounded-2xl border border-navy-100 bg-white p-6 text-center ${patientMode ? 'py-10' : ''}`}>
      <div className={patientMode ? 'text-6xl' : 'text-4xl'}>{activity.icon}</div>
      <h3 className={`mt-3 font-semibold text-navy-800 ${patientMode ? 'text-2xl' : 'text-lg'}`}>{activity.title}</h3>
      {!patientMode && <p className="mt-1 text-sm text-navy-400">{activity.description}</p>}

      {isAudio && (
        <div className="mt-6">
          {track && <div className={`mb-3 font-medium text-navy-600 ${patientMode ? 'text-lg' : 'text-sm'}`}>{track.title}</div>}
          <button
            onClick={handlePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className={`rounded-full bg-navy-600 text-white transition hover:bg-navy-700 ${patientMode ? 'h-24 w-24 text-4xl' : 'h-16 w-16 text-2xl'}`}
          >
            {playing ? '❚❚' : '▶'}
          </button>
        </div>
      )}

      {isVoicePrompt && (
        <div className="mt-6">
          <p className={`mb-3 text-navy-600 ${patientMode ? 'text-xl' : 'text-sm'}`}>
            {`"${activity.title === 'Simple yes/no check-in' ? `Would you like some tea, ${patient.preferredName}?` : `Tell me about ${patient.occupation.toLowerCase()}.`}"`}
          </p>
          <button
            onClick={() => VoiceService.speak(activity.title, patient.language)}
            aria-label="Speak prompt"
            className={`rounded-full bg-navy-600 text-white transition hover:bg-navy-700 ${patientMode ? 'h-24 w-24 text-4xl' : 'h-14 w-14 text-xl'}`}
          >
            🎙️
          </button>
        </div>
      )}

      {/* STUDY PHASE — memory tasks show the item to remember first */}
      {task?.study && inStudyPhase && (
        <div className="mt-6">
          <p className={`text-navy-600 ${patientMode ? 'text-xl' : 'text-sm'}`}>Look at this picture.</p>
          <div className="mx-auto mt-4 w-fit rounded-2xl border-2 border-navy-100 px-10 py-6">
            <div className={patientMode ? 'text-6xl' : 'text-4xl'}>{task.study.icon}</div>
            <div className={`mt-2 font-semibold text-navy-700 ${patientMode ? 'text-xl' : 'text-sm'}`}>{task.study.name}</div>
          </div>
          <PrimaryButton className={`mt-6 ${patientMode ? 'px-10 py-4 text-lg' : ''}`} onClick={() => setStudied(true)}>
            I've looked at it
          </PrimaryButton>
        </div>
      )}

      {/* ANSWER PHASE */}
      {task && !inStudyPhase && (
        <div className="mt-6">
          {task.target && (
            <div className="mx-auto mb-4 w-fit rounded-2xl bg-navy-50 px-8 py-4">
              <div className={patientMode ? 'text-5xl' : 'text-3xl'}>{task.target.icon}</div>
              <div className={`mt-1 font-semibold text-navy-700 ${patientMode ? 'text-lg' : 'text-xs'}`}>{task.target.name}</div>
            </div>
          )}
          <p className={`mb-4 font-medium text-navy-700 ${patientMode ? 'text-xl' : 'text-sm'}`}>{task.prompt}</p>
          <div className="grid grid-cols-2 gap-3">
            {task.options.map((opt) => {
              const isChosen = selected === opt.id
              const revealCorrect = answered && opt.correct
              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(opt)}
                  disabled={answered}
                  className={`patient-target rounded-2xl border-2 p-4 text-center transition disabled:cursor-default ${
                    revealCorrect
                      ? 'border-[var(--color-alert-green)] bg-[var(--color-alert-green-bg)]'
                      : isChosen
                        ? 'border-[var(--color-alert-red)] bg-[var(--color-alert-red-bg)]'
                        : 'border-navy-100 hover:border-navy-400'
                  }`}
                >
                  <div className={patientMode ? 'text-5xl' : 'text-3xl'}>{opt.icon}</div>
                  <div className={`mt-2 font-semibold text-navy-800 ${patientMode ? 'text-lg' : 'text-sm'}`}>{opt.name}</div>
                  {opt.sublabel && opt.sublabel !== opt.name && (
                    <div className={`text-navy-400 ${patientMode ? 'text-sm' : 'text-[11px]'}`}>{opt.sublabel}</div>
                  )}
                  {revealCorrect && <div className="mt-1 text-lg">✓</div>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {answered && (
        <p
          className={`mt-5 font-semibold ${patientMode ? 'text-2xl' : 'text-base'}`}
          style={{ color: chosen?.correct ? 'var(--color-alert-green)' : 'var(--color-navy-500)' }}
        >
          {chosen?.correct ? 'Great! 🎉' : "That's alright — let's try another one."}
        </p>
      )}

      <PrimaryButton className={`mt-6 ${patientMode ? 'w-full py-4 text-lg' : ''}`} onClick={() => onAdvance?.()}>
        {patientMode ? 'Next' : "I've shown this activity"}
      </PrimaryButton>
    </div>
  )
}

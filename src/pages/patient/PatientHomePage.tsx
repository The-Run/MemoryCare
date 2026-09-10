import { useNavigate } from 'react-router-dom'
import { useData, usePatientData, useActivitiesForStage } from '../../store/DataContext'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function PatientHomePage() {
  const { activePatientId } = useData()
  const navigate = useNavigate()
  const { patient, pictures: allPictures, music: allMusic, routines } = usePatientData(activePatientId)
  const activities = useActivitiesForStage(patient?.stage)
  if (!patient) return null

  const pictures = allPictures.slice(0, 2)
  const music = allMusic[0]
  const nextRoutine = routines.find((r) => r.status === 'upcoming')

  return (
    <div className="mx-auto max-w-xl space-y-8 pb-10">
      <div className="text-center">
        <div className="text-4xl">☀️</div>
        <h1 className="mt-2 text-3xl font-bold text-navy-800">
          {greeting()}, {patient.preferredName}.
        </h1>
        <p className="mt-1 text-lg text-navy-400">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {nextRoutine && (
        <button
          onClick={() => navigate('/patient/routine')}
          className="patient-target flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left card-shadow"
        >
          <span className="text-4xl">🔔</span>
          <span className="text-xl text-navy-700">
            {nextRoutine.title} at {nextRoutine.time}
          </span>
        </button>
      )}

      <button
        onClick={() => navigate('/patient/pictures')}
        className="patient-target flex w-full items-center gap-4 rounded-3xl p-5 text-left text-white card-shadow"
        style={{ background: pictures[0]?.color ? '#4d729a' : '#4d729a' }}
      >
        <span className="text-4xl">{pictures[0]?.icon ?? '🖼️'}</span>
        <span className="text-xl">Would you like to look at your pictures?</span>
      </button>

      <button
        onClick={() => navigate('/patient/games')}
        className="patient-target flex w-full items-center gap-4 rounded-3xl bg-navy-600 p-5 text-left text-xl text-white card-shadow"
      >
        <span className="text-4xl">{activities[0]?.icon ?? '🧩'}</span>
        Let's play a game.
      </button>

      {music && (
        <button
          onClick={() => navigate('/patient/music')}
          className="patient-target flex w-full items-center gap-4 rounded-3xl bg-white p-5 text-left card-shadow"
        >
          <span className="text-4xl">🎵</span>
          <span className="text-xl text-navy-700">Listen to {music.title}</span>
        </button>
      )}

      <button onClick={() => navigate('/patient/memories')} className="mx-auto block text-lg font-medium text-navy-400 underline">
        View my memories
      </button>
    </div>
  )
}

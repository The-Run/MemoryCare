import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { PatientLayout } from './layouts/PatientLayout'
import { RequireAuth } from './pages/RequireAuth'

import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PatientListPage } from './pages/PatientListPage'
import { PassportsPage } from './pages/PassportsPage'
import { PatientProfilePage } from './pages/PatientProfilePage'
import { CreatePatientPage } from './pages/CreatePatientPage'
import { VoiceProfileBuilderPage } from './pages/VoiceProfileBuilderPage'
import { CareSessionPage } from './pages/CareSessionPage'
import { AdaptiveCarePage } from './pages/AdaptiveCarePage'
import { CulturalEnginePage } from './pages/CulturalEnginePage'
import { InsightsHubPage } from './pages/InsightsHubPage'
import { PatientInsightsPage } from './pages/PatientInsightsPage'
import { AlertsPage } from './pages/AlertsPage'
import { CopilotPage } from './pages/CopilotPage'
import { RoutinePage } from './pages/RoutinePage'
import { CareHomePage } from './pages/CareHomePage'
import { OfflinePage } from './pages/OfflinePage'
import { SettingsPage } from './pages/SettingsPage'
import { SessionsListPage } from './pages/SessionsListPage'
import { FamilyPortalPage } from './pages/FamilyPortalPage'

import { PatientHomePage } from './pages/patient/PatientHomePage'
import { PatientPicturesPage } from './pages/patient/PatientPicturesPage'
import { PatientMemoriesPage } from './pages/patient/PatientMemoriesPage'
import { PatientGamesPage } from './pages/patient/PatientGamesPage'
import { PatientMusicPage } from './pages/patient/PatientMusicPage'
import { PatientRoutinePage } from './pages/patient/PatientRoutinePage'
import { PatientVoicePage } from './pages/patient/PatientVoicePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/passports" element={<PassportsPage />} />
        <Route path="/patients/new" element={<CreatePatientPage />} />
        <Route path="/patients/:id" element={<PatientProfilePage />} />
        <Route path="/patients/:id/profile-builder" element={<VoiceProfileBuilderPage />} />
        <Route path="/patients/:id/behavior" element={<PatientInsightsPage />} />
        <Route path="/patients/:id/insights" element={<PatientInsightsPage />} />
        <Route path="/session/:patientId" element={<CareSessionPage />} />
        <Route path="/adaptive-care/:patientId" element={<AdaptiveCarePage />} />
        <Route path="/cultural-engine" element={<CulturalEnginePage />} />
        <Route path="/insights" element={<InsightsHubPage />} />
        <Route path="/sessions" element={<SessionsListPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/copilot" element={<CopilotPage />} />
        <Route path="/routine" element={<RoutinePage />} />
        <Route path="/care-home" element={<CareHomePage />} />
        <Route path="/family" element={<FamilyPortalPage />} />
        <Route path="/offline" element={<OfflinePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <PatientLayout />
          </RequireAuth>
        }
      >
        <Route path="/patient/home" element={<PatientHomePage />} />
        <Route path="/patient/pictures" element={<PatientPicturesPage />} />
        <Route path="/patient/memories" element={<PatientMemoriesPage />} />
        <Route path="/patient/games" element={<PatientGamesPage />} />
        <Route path="/patient/music" element={<PatientMusicPage />} />
        <Route path="/patient/routine" element={<PatientRoutinePage />} />
        <Route path="/patient/voice" element={<PatientVoicePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

# MemoryCare NER — Session Handoff

**Last updated:** 2026-09-11
**Status:** Feature-complete browser prototype. Type-checks clean, production build passes, all 25 routes render with no console errors. Two open items listed under *Open / Unverified*.

Read this together with `README.md` (product + architecture) and the build spec
`MEMORYCARE_NER_CLAUDE_BUILD_SPEC_UPDATED (1).md`.

---

## 1. How to run

```bash
cd c:\Users\Lavanya\MemoryCare
npm install      # only needed on a fresh machine
npm run dev      # http://localhost:5173
```
Click **"Continue as Demo Caregiver"**. No signup, no backend.

```bash
npm run build    # tsc -b && vite build  → dist/
npm run preview  # serves the build on :4173 (service worker only active here)
npm run lint     # oxlint — currently 4 warnings, 0 errors (all cosmetic, see §7)
```

### CRITICAL: there are NO API keys anywhere in this project
- **Text-to-speech** = the browser's built-in `window.speechSynthesis`. Free, offline, no key.
- **Speech-to-text** = mocked. `VoiceService.transcribe()` returns one of 3 canned transcripts.
- **All "AI"** = deterministic rule-based TypeScript in `src/services/`. No LLM call is made anywhere.
- No cloud, no AWS, no database, no `.env` file. Nothing to provision or rotate.
- Data persists to `localStorage` under the single key `memorycare_ner_v1`.

---

## 2. Stack

| | |
|---|---|
| Build | Vite 8 |
| UI | React 19, TypeScript 6, React Router 7 |
| Styling | **Tailwind CSS v4** (CSS-first config via `@theme` in `src/index.css` — there is NO `tailwind.config.js`) |
| Persistence | `localStorage` (stand-in for IndexedDB/SQLite) |
| PWA | `public/manifest.webmanifest` + `public/sw.js`, registered in `main.tsx` (production only) |

---

## 3. File map — what each file does

### Entry / shell
| File | Purpose |
|---|---|
| `index.html` | Root HTML, manifest link, theme-color, title |
| `src/main.tsx` | Mounts React; wraps app in BrowserRouter → AuthProvider → DataProvider → ToastProvider; registers service worker in prod |
| `src/App.tsx` | **All route definitions.** Caregiver routes wrapped in `AppShell`, patient routes in `PatientLayout`, both behind `RequireAuth` |
| `src/index.css` | Tailwind import + `@theme` design tokens (navy palette, stage colors, alert colors) + `.card-shadow` / `.input` / `.chip` utilities + **global `cursor: pointer` fix** |

### Layouts
| File | Purpose |
|---|---|
| `src/layouts/AppShell.tsx` | Caregiver chrome: Sidebar + TopBar + `<Outlet/>`, mobile drawer |
| `src/layouts/Sidebar.tsx` | Caregiver nav list (`NAV_ITEMS` + `SECONDARY_ITEMS`). **Edit nav here.** |
| `src/layouts/TopBar.tsx` | Caregiver name, DEMO MODE badge, connectivity toggle, language select, alert bell, Enter Patient Mode, profile menu |
| `src/layouts/PatientLayout.tsx` | Patient chrome: big bottom nav (Home/Pictures/Games/Music/Routine), floating mic button, discreet "Exit Patient Mode" |

### State
| File | Purpose |
|---|---|
| `src/store/DataContext.tsx` | **The heart of the app.** Holds all app data; CRUD (`addPatient`, `addMemory`, `addObservation`, `addSession`, `addAlert`, `updateAlertStatus`, `updateRoutineStatus`, `addRoutine`, `logAudit`); offline sync queue (`goOffline`/`goOnline`/`pendingCount`); patient mode (`enterPatientMode`/`activePatientId`); exports **`usePatientData(id)`** and **`useActivitiesForStage(stage)`** selectors |
| `src/store/AuthContext.tsx` | Demo auth only — `isAuthenticated` in sessionStorage, `login(role)`, `logout()` |
| `src/services/storage.ts` | `AppData` shape, `loadState()` / `saveState()` / `resetState()`, seeds from `src/data/*` on first run. Bump `SCHEMA_VERSION` to force a reseed |

### Services (mock now, swappable later — this is where real integrations go)
| File | Replace later with |
|---|---|
| `src/services/voiceService.ts` | Bhashini / AI4Bharat / Whisper. `speak()` already real (browser TTS) |
| `src/services/profileExtractionService.ts` | LLM/NLU. Currently regex rules mapping transcript → passport fields |
| `src/services/activityGenerationService.ts` | **The adaptive rule engine.** Scores the stage's activity pool by prior engagement / assistance / preferences. Keep deterministic — safety-sensitive |
| `src/services/culturalRecommendationService.ts` | Cultural content service |
| `src/services/behavioralAnalysisService.ts` | Analytics — engagement summaries, response-time trend |
| `src/services/baselineService.ts` | Analytics — deviation from personal baseline + severity |
| `src/services/caregiverCopilotService.ts` | LLM + retrieval. Produces structured recommendation cards and canned Q&A |
| `src/services/id.ts` | `newId(prefix)`, `nowIso()` |

### Seed data (`src/data/`) — **seed only, never read directly from a component**
`patients.ts` (6 patients), `caregivers.ts`, `memories.ts`, `preferences.ts`, `activities.ts` (16 stage-tagged activities), `pictures.ts`, `music.ts`, `routines.ts`, `sessions.ts` (sessions + observations), `baselines.ts`, `alerts.ts`, `cultural.ts` (all 8 NER states), `index.ts` (barrel).

### Components (`src/components/`)
`atoms.tsx` (Card, PrimaryButton, SecondaryButton, StageBadge, SeverityBadge, StatusBadge, ConsentBadge, EmptyState, LoadingState, Modal), `Toast.tsx`, `PatientAvatar.tsx`, `PatientCard.tsx`, `MemoryPassportCard.tsx` (PassportSection/SourceTag/FieldRow), `MemoryGraph.tsx`, `PreferenceCard.tsx`, `ActivityCard.tsx`, **`ActivityPlayer.tsx`** (the game/task engine — see §6), `ResponseControls.tsx`, `AddObservationModal.tsx`, `EngagementMeter.tsx`, `BaselineChart.tsx`, `ChangeIndicator.tsx`, `AlertCard.tsx`, `CopilotRecommendation.tsx`, `RoutineTimeline.tsx`, `OfflineSyncIndicator.tsx`, `ConnectivitySimulator.tsx`, `CulturalStateCard.tsx`, `StepWizard.tsx`.

### Pages
Caregiver: `LandingPage`, `LoginPage`, `RequireAuth`, `DashboardPage`, `PatientListPage`, **`PassportsPage`** (passport gallery), `PatientProfilePage` (the full passport), `CreatePatientPage` (5-step wizard), `VoiceProfileBuilderPage`, `CareSessionPage`, `AdaptiveCarePage` (incl. stage-switch demo control), `SessionsListPage`, `InsightsHubPage`, `PatientInsightsPage` (behavior + baseline), `AlertsPage`, `CopilotPage`, `RoutinePage`, `CareHomePage`, `CulturalEnginePage`, `FamilyPortalPage`, `OfflinePage`, `SettingsPage`.

Patient (`src/pages/patient/`): `PatientHomePage`, `PatientPicturesPage`, `PatientMemoriesPage`, `PatientGamesPage`, `PatientMusicPage`, `PatientRoutinePage`, `PatientVoicePage`.

---

## 4. Routes

`/` `/login` `/dashboard` `/patients` `/passports` `/patients/new` `/patients/:id` `/patients/:id/profile-builder` `/patients/:id/insights` `/patients/:id/behavior` `/session/:patientId` `/adaptive-care/:patientId` `/sessions` `/insights` `/alerts` `/copilot` `/routine` `/care-home` `/cultural-engine` `/family` `/offline` `/settings`
Patient: `/patient/home` `/pictures` `/memories` `/games` `/music` `/routine` `/voice`

---

## 5. THREE RULES that will bite you if broken

1. **Never import from `src/data/*` inside a component.** Those are seed arrays; they don't reflect runtime writes. Use `usePatientData(id)` / `useActivitiesForStage(stage)` / `useData().data`. A whole class of bugs (stage changes not applying, new memories invisible, live observations missing from charts) came from this and was fixed by refactoring every consumer.
2. **`ActivityPlayer` must be rendered with `key={activity.id}`.** Its task is built once in a `useState` initializer specifically so recording a response (which mutates global state and re-renders) cannot reshuffle the answer options mid-question. The `key` is what resets it for a new activity.
3. **Tailwind v4 has no `cursor: pointer` on buttons.** `src/index.css` restores it globally. If you add a new control type, check the cursor.

---

## 6. `ActivityPlayer` — the task engine (most bug-prone file)

Builds a `Task` from the activity type:
- **recognition** → "Which one is *X*?" — prompt and button label use the **same** string.
- **attention** → shows a target card, "Find the one that matches."
- **memory** → two-phase: study the item → hide → "Which picture did you just see?"
- **language / sequencing** → fixed two-choice tasks.
- **music / comfort** → play button (browser TTS speaks the track title).
- **voice / conversation** → spoken prompt + mic button.

Content priority: the patient's **own** pictures → their memories → cultural items from their state as backfill only. Target is always personal when any personal content exists.

Two callbacks, deliberately separate: `onOutcome` (a real response — records an observation) and `onAdvance` (just move on — records nothing). Merging these caused phantom "positive" observations.

---

## 7. Open / unverified — START HERE

1. **Sidebar click-through audit incomplete.** An automated audit meant to click every sidebar item and assert each lands on a *distinct* route printed zero rows — the Playwright locator returned no items while a parallel check on the same selector *did* find elements, so it is almost certainly a broken test script, not an app bug. From code inspection all 13 nav entries now point to unique routes (the `/patients` duplicate is fixed). **Re-run this audit to confirm.**
2. **`/patients` vs `/passports` overlap.** Now distinct (management list vs passport gallery) but worth a UX review.
3. **oxlint:** 4 warnings, 0 errors — all `only-export-components` on context files exporting hooks alongside providers. Conventional; affects HMR granularity only. Safe to ignore or silence.
4. **`Today's Sessions` on the dashboard reads 0** because seed session dates are pinned to Sept 2026 and compared against the real system clock. Cosmetic; fix by generating seed dates relative to `new Date()`.
5. **No automated test suite is committed.** All verification so far was ad-hoc Playwright scripts run and then deleted. **Recommend adding Playwright as a real dev dependency with the specs committed** — see §8.

---

## 8. Verification history (what's proven vs. what's only been eyeballed)

**Proven by assertion:** the full §22 demo flow end-to-end; all 25 routes render; no console/page errors; game options are answerable (asked name IS on a button); correct/wrong feedback; options never reshuffle after answering or after a state mutation; personal content prioritized 8/8 rounds; exactly one observation per recorded response; offline write → pending → restore → synced; stage switch propagates into patient-mode games; family memory appears in passport AND patient mode; voice-extracted field written to passport; `cursor: pointer` on all four control types; no horizontal overflow at 390px and 820px.

**Only eyeballed (verification debt):** visual polish of `/care-home`, `/settings`, `/sessions`, `/cultural-engine`, `/family`; the `/patients` filter combinations; the 5-step create-patient wizard past step 1; `PatientVoicePage` responses.

> Honest note for whoever picks this up: two real bugs (unanswerable game questions, and a dead duplicate nav link) shipped because earlier checks confirmed *"a click happened"* rather than *"the right thing resulted."* Assert on outcomes, not on interactions.

---

## 9. Suggested next steps, in order

1. Re-run the sidebar audit (§7.1); fix or discard.
2. Commit a real Playwright suite (`npm i -D playwright`, `tests/`) covering the §22 demo flow + the game-task assertions, so regressions can't hide.
3. Clear the verification debt in §8.
4. Make seed session dates relative to today (§7.4).
5. `git init` — **the project is not under version control yet.**
6. Only then: real integrations. Swap the service modules in §3; the UI needs no redesign.

---

## 10. Product guardrails (do not regress these — they are spec requirements)

- No diagnosis/prediction language anywhere. Use "observed", "appears to engage", "possible change", "caregiver review recommended".
- Patient Mode must never show alert severity, baseline deviation, caregiver notes, AI reasoning, clinical assessment, other patients, or family private info. **Never show a score to the patient.**
- Cultural content is a *candidate stimulus*, never an assumed preference. Priority: observed personal > caregiver-confirmed > patient-stated > cultural.
- Every personal fact carries a `source` and stays editable. Never fabricate memories or relationships.
- The app must remain fully usable with no network and no backend.

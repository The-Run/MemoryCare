# MemoryCare NER

A culturally intelligent, multilingual, **offline-first dementia-care platform** for elderly people in the
North Eastern Region (NER) of India.

It creates a personalized **Care & Memory Passport**, adapts activities to the patient's current stage and
responses, learns from caregiver observations, detects meaningful change from the patient's *own* baseline,
and gives caregivers concrete, actionable recommendations.

> **This is not** a diagnosis system, an Alzheimer's prediction system, a chatbot, or a generic brain-games app.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Then click **Continue as Demo Caregiver** — no account, no backend, no API keys, no cloud.

```bash
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build (service worker active here)
```

---

## The demo flow (SIH presentation script)

```
Landing page → Get Started → Demo login → Caregiver Dashboard
   → Select Anima Das → Care & Memory Passport
   → Enter Patient Mode → My Pictures / Mind Games
   → Start Care Session → record "Positive engagement"
   → Adaptive next activity → Behavior / Baseline insights
   → Caregiver Copilot recommendation
   → Simulate Offline → record an observation → Restore connection → Sync completed
```

**Demo patient:** Anima Das — 74, Assam, Assamese, former mathematics teacher, Bihu music, morning tea,
moderate-stage dementia, **no family contact** (personalization built purely from caregiver observation).

---

## The core loop

Every screen in the product reinforces one loop:

```
Interact → Observe → Compare with personal baseline → Learn
   → Adapt next activity → Caregiver feedback → Update profile → Interact again
```

---

## Routes

### Caregiver experience — *Understand → Plan → Observe → Analyze → Act*

| Route | Screen |
|---|---|
| `/` | Landing page |
| `/login` | Login / role selection / demo login |
| `/dashboard` | Caregiver home: summary cards, Today's Care Plan, Needs Attention, recent activity, quick actions |
| `/patients` | Patient list with search + stage/language/attention/care-home filters |
| `/patients/new` | 5-step guided passport wizard (incl. "Build profile from conversation") |
| `/patients/:id` | **Care & Memory Passport** — identity, life story, preferences, routines, communication, comfort profile, memory graph |
| `/patients/:id/profile-builder` | Voice Profile Builder — "Talk once → Build the profile" |
| `/patients/:id/insights` · `/behavior` | Observed engagement, response trend, personal baseline, change summary |
| `/session/:patientId` | **Care Session** — one activity at a time, response capture, adaptive next activity |
| `/adaptive-care/:patientId` | Three-stage adaptive care (Early / Moderate / Advanced) |
| `/sessions` | All care sessions + start a new one |
| `/insights` | Insights hub across patients |
| `/alerts` | Green / Yellow / Red alerts: what changed, why it matters, recommended action |
| `/copilot` | Caregiver AI Copilot — structured recommendation cards, not a chat box |
| `/routine` | Medication & routine reminders (care support, not prescribing) |
| `/care-home` | Care Home Mode + **Care Continuity Card** handover |
| `/cultural-engine` | NER Cultural Intelligence across all 8 states |
| `/family` | Optional family contributions + plain-language care summary |
| `/offline` | Offline mode + sync simulation |
| `/settings` | Access control, consent, privacy, audit log, demo mode |

### Patient experience — *See → Listen → Play → Respond → Engage*

| Route | Screen |
|---|---|
| `/patient/home` | Large greeting, day, one or two recommended actions |
| `/patient/pictures` | Labeled personal photos with spoken labels |
| `/patient/memories` | Visual, voice-enabled memory cards |
| `/patient/games` | Stage-appropriate mind games with encouraging feedback (never scores) |
| `/patient/music` | Familiar regional music, large play controls |
| `/patient/routine` | Simple upcoming actions (no dosage detail) |
| `/patient/voice` | Voice companion with a large microphone button |

Patient Mode never shows alert severity, baseline deviation, caregiver notes, AI reasoning, clinical
assessment, other patients, or private family information.

---

## Architecture

```
                    MEMORYCARE NER (browser-first PWA)
                                 │
                  ┌──────────────┴──────────────┐
             PATIENT MODE                  CAREGIVER MODE
                  └──────────────┬──────────────┘
                                 ↓
                        LOCAL DATA LAYER          ← src/services/storage.ts
                      localStorage / IndexedDB       (seeded from src/data/*)
                                 ↓
                        MOCK SERVICE LAYER        ← src/services/*
        Voice · ProfileExtraction · CulturalRecommendation · ActivityGeneration
              BehavioralAnalysis · Baseline · CaregiverCopilot
                                 ↓
                        CONNECTIVITY STATE
                     ONLINE ⟷ OFFLINE (+ sync queue)
```

**Layered AI, not an LLM-as-brain.** A deterministic **rule/policy engine** owns everything
safety-sensitive — stage, activity difficulty, alert thresholds, permissions, offline fallback. The
LLM-shaped layer (mocked here) only handles conversational understanding and caregiver-facing
explanations. That keeps the demo predictable and the product defensible.

### Service boundaries (mock now, swappable later)

| Service | Responsibility | Real implementation later |
|---|---|---|
| `voiceService` | STT, language ID, TTS | Bhashini / AI4Bharat / Whisper (TTS already uses the browser's SpeechSynthesis) |
| `profileExtractionService` | Caregiver transcript → structured passport fields | LLM / NLU pipeline |
| `culturalRecommendationService` | NER cultural knowledge → candidate stimuli | Cultural content service |
| `activityGenerationService` | Next-activity decision (rule engine) | Same rules + learned ranking |
| `behavioralAnalysisService` | Observations → observed-engagement summaries | Analytics service |
| `baselineService` | Personal baseline + deviation signals | Analytics service |
| `caregiverCopilotService` | Structured recommendations & answers | LLM + retrieval |

Target production shape (intentionally **not** a prototype dependency): API Gateway → Auth →
Patient / Activity / Cultural / AI / Analytics / Caregiver services → PostgreSQL + pgvector.
**No AWS or cloud dependency exists in this prototype.**

---

## Project structure

```
src/
├── components/     PatientCard, ActivityPlayer, ResponseControls, BaselineChart,
│                   MemoryGraph, AlertCard, CopilotRecommendation, RoutineTimeline, …
├── layouts/        AppShell (Sidebar + TopBar), PatientLayout
├── pages/          Caregiver screens
│   └── patient/    Patient Mode screens
├── data/           Realistic mock data (6 patients, 8 NER states, activities, baselines…)
├── services/       Mock AI/domain services + local storage layer
├── store/          DataContext (state, CRUD, sync queue), AuthContext
└── types/          Typed domain model
```

---

## Offline behavior

- All care data persists to `localStorage` under one namespaced key (the browser stand-in for
  IndexedDB/SQLite on device).
- Writes made while offline are queued as pending changes; restoring the connection runs a simulated
  `Check network → Encrypt → Diff Sync → Secure Server → Updated Bundle` pass and clears the queue.
- A service worker (`public/sw.js`, active in production builds) caches the app shell so every route
  still opens with no network.

Try it: **Offline Sync → Simulate Offline → Record Sample Observation → Restore Connection.**

---

## Safety & privacy commitments

- No diagnosis, prediction, or claim that a response proves a memory — only *observed*, *appears to
  engage*, *possible change*, *caregiver review recommended*.
- Cultural content is always a **candidate stimulus**, never an assumed personal preference. Priority is
  observed personal preference > caregiver-confirmed > patient-stated > cultural candidate.
- Every personal fact carries a **source** (patient / family / caregiver / record / observed) and stays
  editable. The system never fabricates memories or family relationships.
- Least-privilege UI, consent records, and an audit log are visible in Settings.

---

## Status

Prototype scope: browser-only, mock data and mock services, no backend required. Data model, service
boundaries and UI are structured so a FastAPI + PostgreSQL/pgvector backend and real speech/LLM
integrations can be connected without redesigning the product.
#   M e m o r y C a r e  
 
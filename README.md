# Clarity30

**A 30-day, 10-minute-a-day articulation & speech-clarity plan** for confident everyday
communication — meetings, interviews, presentations and client calls.

> **Not clinical speech therapy.** Clarity30 is for general communication confidence. It
> does not diagnose or treat any speech or medical condition. If you have a health concern
> about your speech, please see a qualified professional.

## How it works

**Onboarding quiz** → gender-framed voice guidance, a clarity self-assessment, a confidence
rating, and the challenges and contexts you actually care about. The plan is personalised
from those answers (deterministically — same answers, same plan).

**The daily loop (10 minutes):**

| Block | Time | What you do |
|---|---|---|
| Reset & warm-up | 2 min | Jaw/lip stretches and diaphragm breathing |
| Target drill | 3 min | One sound target **plus today's authority swaps** (word endings, pacing, tongue twisters…) |
| Record | 3 min | Read/answer aloud; the browser records it |
| Listen & repeat | 2 min | Play it back, note **one** correction, re-record |

**4-stage progression across 2 phases:**

- **Days 1–7 — Foundation · Precision.** Word endings, over-enunciation. *Baseline on Day 1,
  checkpoint on Day 7.*
- **Days 8–15 — Foundation · Movement & Flow.** Jaw movement, pausing, keeping the final
  three words audible. *Checkpoint Day 14, **mid-point baseline Day 15**.*
- **Days 16–22 — Application · Under Pressure.** Interview answers, stating disagreement,
  dropping jargon. *Checkpoint Day 21.*
- **Days 23–30 — Application · Real-World Transfer.** Cold prompts, names and numbers, Q&A,
  full rehearsal. ***Final baseline Day 30.***

**Baselines use the same passage** on Days 1, 15 and 30, so the comparison view is a fair
before/after — play them in order and hear the change.

## Say it with authority

The linguistic half of articulation: **swap apologetic, hedging phrasing for phrasing that
carries authority** — the same message, delivered by someone in control.

- “Sorry I’m late.” → **“Thanks for waiting.”**
- “I just wanted to check in…” → **“I’m checking in on the delivery date.”**
- “Yeah, but…” → **“I see it differently — here’s why.”**
- “Does that make sense?” → **“What questions do you have?”**

70+ swaps across 12 families — apology→appreciation, hedging→certainty, permission→statement,
filler→pause, blame→ownership, hedged disagreement→clear, yielding→holding,
defensiveness→curiosity, soft no→clear no, panic→buying time, passive→directing,
modesty→evidence. Each carries a one-line reason, so you learn *why* it lands. Every day's
Target drill serves three swaps matched to your stage, and the whole library is browsable
under **Phrases**.

## Privacy & data

- **Audio never leaves your device.** Recordings are stored as Blobs in **IndexedDB**;
  progress, quiz answers and self-ratings live in **localStorage**.
- No account, no upload, no server. Close the tab and your 30-day journey resumes exactly
  where you left it (verified by a reload test).
- "Reset all data" clears both stores.

## Honest about measurement

Pace (words/min), filler count and a clarity score are computed **only when the browser
transcribes your recording** (Chrome / Edge / Safari, via the Web Speech API). On browsers
without it, the app shows duration and asks for a self-rating rather than inventing a
number. Nothing is fabricated.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 55 tests (curriculum, store, quiz, analysis, DB, UI)
npm run build      # production PWA build
npm run preview    # serve the build on :4180
npm run icons      # regenerate the PWA PNG icons (stdlib Python, no Pillow)
```

## Architecture

```
src/
  lib/curriculum.js  30 days, 4 stages, daily targets, baselines/checkpoints (pure data)
  lib/onboarding.js  the quiz + deterministic personalisation (pure)
  lib/store.js       progress state + streak/compliance maths (injectable storage)
  lib/db.js          IndexedDB recording store (Blob-safe) + in-memory fallback
  lib/analysis.js    pace / fillers / clarity score (pure)
  lib/recorder.js    MediaRecorder wrapper
  lib/speech.js      Web Speech API transcription wrapper (optional)
  components/        Onboarding, Dashboard, DaySession, Recorder, CompareView, ProgressView
```

## Deploy (Vercel)

Static SPA — no env vars, no secrets.

```bash
vercel --prod
```

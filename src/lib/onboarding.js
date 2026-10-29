// The onboarding quiz + the (deterministic) personalisation it drives.
// Pure data and pure functions — no React, no DOM.

export const SCOPE_NOTE =
  'Clarity30 is for general communication confidence. It is not clinical speech ' +
  'therapy: it does not diagnose or treat any speech or medical condition. If you ' +
  'have a health concern about your speech, please see a qualified professional.'

export const QUIZ = [
  {
    id: 'scope',
    kind: 'acknowledge',
    title: 'Before we start',
    body: SCOPE_NOTE,
    cta: 'I understand'
  },
  {
    id: 'gender',
    kind: 'single',
    title: 'How should we frame your voice guidance?',
    help: 'Used only to tailor pitch and pace tips. Nothing leaves your device.',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'nonbinary', label: 'Non-binary' },
      { value: 'unspecified', label: 'Prefer not to say' }
    ]
  },
  {
    id: 'clarity',
    kind: 'scale',
    title: 'Right now, how clear do you feel when you speak?',
    min: 1,
    max: 5,
    labels: { 1: 'Often unclear', 5: 'Very clear' }
  },
  {
    id: 'confidence',
    kind: 'scale',
    title: 'How confident do you feel speaking in meetings or interviews?',
    min: 1,
    max: 5,
    labels: { 1: 'Not confident', 5: 'Very confident' }
  },
  {
    id: 'challenges',
    kind: 'multi',
    title: 'What gets in the way most?',
    help: 'Pick any that apply.',
    options: [
      'Mumbling / dropping word endings',
      'Speaking too fast',
      'Running out of breath',
      'Filler words (um, er, like)',
      'Losing my point when interrupted',
      'Jargon / over-complicated wording'
    ]
  },
  {
    id: 'contexts',
    kind: 'multi',
    title: 'Where do you most need to be clear?',
    options: ['Meetings', 'Interviews', 'Presentations', 'Client calls', 'Everyday conversation']
  },
  {
    id: 'baseline',
    kind: 'choice',
    title: 'Record your Day 1 baseline now?',
    help: 'Day 1 is compared against Day 15 and Day 30.',
    options: [
      { value: 'now', label: 'Record now' },
      { value: 'later', label: 'Later, on the dashboard' }
    ]
  }
]

export function defaultAnswers() {
  return {
    scopeAcknowledged: false,
    gender: null,
    clarity: null,
    confidence: null,
    challenges: [],
    contexts: [],
    baseline: null
  }
}

/** The fields we actually require before starting the plan. */
export function isComplete(answers) {
  return Boolean(
    answers &&
      answers.scopeAcknowledged &&
      answers.gender &&
      answers.clarity != null &&
      answers.confidence != null
  )
}

const VOICE_NOTES = {
  male:
    'A relaxed adult male speaking voice usually sits around 85–155 Hz. Don’t push it ' +
    'lower — aim for steady and unforced, and let the ends of sentences stay supported.',
  female:
    'A relaxed adult female speaking voice usually sits around 165–255 Hz. Aim for ' +
    'steady rather than higher, and keep energy in the final words.',
  nonbinary:
    'Your comfortable speaking pitch is whatever is relaxed and sustainable. Aim for ' +
    'steady, unforced, and clearly finished at the end of each sentence.',
  unspecified:
    'Aim for a relaxed, steady speaking pitch that you can sustain without strain, and ' +
    'keep full energy in the final words of each sentence.'
}

const CHALLENGE_TIPS = {
  'Mumbling / dropping word endings': 'Stage 1 is your priority: finish every final consonant.',
  'Speaking too fast': 'Use the metronome pace drill on Day 12 — target ~140 words a minute.',
  'Running out of breath': 'Lean on the diaphragm breath in your 2-minute reset every day.',
  'Filler words (um, er, like)': 'Replace fillers with a silent pause — silence reads as control.',
  'Losing my point when interrupted': 'Day 28 trains the three-word recovery and return to your point.',
  'Jargon / over-complicated wording': 'Day 20 is the plain-English drill — say it for a non-expert.'
}

/** Deterministic personalisation — same answers always give the same plan. */
export function personalize(answers) {
  const a = answers || defaultAnswers()
  const tips = []
  for (const c of a.challenges || []) {
    if (CHALLENGE_TIPS[c]) tips.push(CHALLENGE_TIPS[c])
  }
  if (!tips.length) tips.push('Follow the daily loop in order — warm-up, drill, record, repeat.')

  const focusAreas = [...(a.challenges || []), ...(a.contexts || [])]

  const clarity = a.clarity ?? 3
  const confidence = a.confidence ?? 3
  const startingScore = Math.round(((clarity + confidence) / 10) * 100)

  return {
    voiceNote: VOICE_NOTES[a.gender] || VOICE_NOTES.unspecified,
    tips,
    focusAreas,
    startingScore,
    contexts: a.contexts || []
  }
}

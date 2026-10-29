// The 30-day curriculum. Pure data + pure helpers (no React, no DOM) so it can be
// unit-tested and reasoned about directly.
//
// Structure: 2 phases (Foundation / Real-World Application) delivered as a
// 4-stage progression, with baselines on days 1 / 15 / 30 and checkpoints on
// days 7 / 14 / 15 / 21 / 30.

export const PLAN_LENGTH = 30

/** The 10-minute daily loop — 2 + 3 + 3 + 2. */
export const DAILY_BLOCKS = [
  {
    id: 'reset',
    title: 'Reset & warm-up',
    minutes: 2,
    cue: 'Release the jaw, loosen the lips, and settle your breath before you speak.'
  },
  {
    id: 'drill',
    title: 'Target drill',
    minutes: 3,
    cue: 'One sound target and today’s authority swaps. Precision first, speed second.'
  },
  {
    id: 'record',
    title: 'Record',
    minutes: 3,
    cue: 'Say it out loud and record it. Your own ear is the teacher.'
  },
  {
    id: 'repeat',
    title: 'Listen & repeat',
    minutes: 2,
    cue: 'Play it back, pick ONE correction, then record it again.'
  }
]

export const STAGES = [
  {
    id: 1,
    name: 'Foundation · Precision',
    phase: 'Foundation',
    days: [1, 7],
    blurb: 'Get every sound finished. Word endings and deliberate over-enunciation first.',
    goals: ['word endings', 'over-enunciation']
  },
  {
    id: 2,
    name: 'Foundation · Movement & Flow',
    phase: 'Foundation',
    days: [8, 15],
    blurb: 'Open the jaw, use the lips, and learn to pause so your last words land.',
    goals: ['jaw movement', 'pausing', 'final 3 words audible']
  },
  {
    id: 3,
    name: 'Application · Speaking Under Pressure',
    phase: 'Real-World Application',
    days: [16, 22],
    blurb: 'Take the clarity into interviews, disagreement and plain-English explanation.',
    goals: ['interview questions', 'stating disagreement', 'eliminating jargon']
  },
  {
    id: 4,
    name: 'Application · Real-World Transfer',
    phase: 'Real-World Application',
    days: [23, 30],
    blurb: 'Cold prompts, names and numbers, meetings and Q&A — clarity where it counts.',
    goals: ['unexpected prompts', 'transfer testing']
  }
]

export const CHECKPOINTS = [7, 14, 15, 21, 30]
export const BASELINE_DAYS = [1, 15, 30]

/** The standard passage recorded on every baseline so day 1 / 15 / 30 compare fairly. */
export const BASELINE_PASSAGE =
  'Good morning. I speak at a steady pace and I finish every word I start. ' +
  'I breathe from my diaphragm, keep my jaw relaxed and open, and let my final ' +
  'words land with the same energy as my first. Clarity is a habit, not a talent.'

export const WARMUPS = {
  jaw: 'Jaw release — drop the jaw wide on “ah”, then close gently. 5 slow reps.',
  lips: 'Lip trill — blow air through relaxed lips for 10 seconds, twice.',
  tongue: 'Tongue stretch — reach the tongue to nose, then chin, 5 times each.',
  breath: 'Diaphragm breath — hand on ribs, 4 counts in, 6 counts out. 4 rounds.',
  face: 'Face loosen — big exaggerated smile, then pursed lips. 5 reps.',
  hum: 'Hum-to-speak — hum “mmm” for 3 seconds, open into “mah”. 5 reps.'
}

export const TONGUE_TWISTERS = [
  'Brisk brave brigadiers brandished broad bright blades.',
  'Red lorry, yellow lorry, red lorry, yellow lorry.',
  'She sells seashells by the seashore.',
  'The sixth sick sheikh’s sixth sheep’s sick.',
  'Eleven benevolent elephants.'
]

// --- the 30 days -------------------------------------------------------------
// warmup: ids from WARMUPS · drill: { name, how } · say: what to record aloud.

const D = (day, stage, title, focus, warmup, drill, say, extra = {}) => ({
  day,
  stage,
  phase: stage <= 2 ? 'Foundation' : 'Real-World Application',
  title,
  focus,
  warmup,
  drill,
  say,
  ...extra
})

export const CURRICULUM = [
  // ---- Stage 1 · Foundation: Precision (days 1–7) ----
  D(1, 1, 'Baseline recording', 'Capture where you are today', ['breath', 'jaw', 'lips'],
    { name: 'Baseline read', how: 'Read the baseline passage slowly and clearly, then answer the intro prompt.' },
    BASELINE_PASSAGE,
    { baseline: true, prompt: 'In 30 seconds: who you are and what you do.' }),

  D(2, 1, 'Finish the word', 'Word endings (-s, -ed, -t, -d)', ['breath', 'lips', 'face'],
    { name: 'Ending ladder', how: 'Say each pair, hitting the final consonant: walk/walked, ask/asked, cat/cats, need/needed.' },
    'I asked, I walked, I decided. The cats need the notes.') ,

  D(3, 1, 'Over-enunciate, then normalise', 'Exaggeration builds awareness', ['face', 'jaw', 'lips'],
    { name: 'Big-then-real', how: 'Say the line with exaggerated mouth shapes, then repeat it at normal size.' },
    'The quick brown fox jumps over the lazy dog.'),

  D(4, 1, 'Plosives', 'Crisp p, b, t, d, k, g', ['breath', 'lips', 'face'],
    { name: 'Popping pairs', how: 'Hold a hand to your mouth — feel the puff of air on each plosive.' },
    'Pick a big black bag, take two tickets, grab a good cup.'),

  D(5, 1, 'Sibilants', 's, sh, z, ch without splashing', ['lips', 'tongue', 'face'],
    { name: 'Sizzle control', how: 'Keep the air narrow and steady; no whistle, no lisp.' },
    'She sells seashells by the seashore.'),

  D(6, 1, 'Endings in sentences', 'Final consonants inside flow', ['breath', 'lips', 'face'],
    { name: 'Sentence endings', how: 'Read each sentence and tap the table on every final consonant.' },
    'We shipped the builds, tested the scripts, and closed the tickets.'),

  D(7, 1, 'Checkpoint · Precision', 'Re-record the baseline passage', ['breath', 'jaw', 'lips', 'face'],
    { name: 'Checkpoint read', how: 'Record the baseline passage again — same words, seven days better.' },
    BASELINE_PASSAGE,
    { checkpoint: true }),

  // ---- Stage 2 · Foundation: Movement & Flow (days 8–15) ----
  D(8, 2, 'Open the jaw', 'Jaw movement on vowels', ['jaw', 'hum', 'breath'],
    { name: 'Wide vowels', how: 'Open wide on a/e/i/o/u — the jaw moves, the sound stays open.' },
    'A wide open jaw makes a warm and easy sound.'),

  D(9, 2, 'Lip work', 'Rounding and spreading', ['lips', 'face', 'hum'],
    { name: 'Round then spread', how: 'Alternate “ooo” (round) and “eee” (spread) — feel the corners move.' },
    'Blue moon, green screen, wide smile, small pool.'),

  D(10, 2, 'Tongue twisters', 'Accuracy under speed', ['tongue', 'jaw', 'breath'],
    { name: 'Twister ladder', how: 'Say it slowly and perfectly three times, then once at speed.' },
    TONGUE_TWISTERS[0]),

  D(11, 2, 'Pausing', 'Punctuation into breath', ['breath', 'hum', 'jaw'],
    { name: 'Breath at the comma', how: 'Read aloud and breathe at every comma and full stop.' },
    'We agreed the plan, we set the date, and then we told the team.'),

  D(12, 2, 'Pace control', 'Slow the run-on', ['breath', 'jaw', 'lips'],
    { name: 'Metronome pace', how: 'Speak at roughly 140 words a minute — deliberately slower than rushing.' },
    'When I slow down, people hear every idea the first time.'),

  D(13, 2, 'Final three words', 'Fix the drop-off', ['breath', 'jaw', 'hum'],
    { name: 'Land the ending', how: 'Keep full energy through the last three words of every sentence.' },
    'The most important part of the sentence is the end of it.'),

  D(14, 2, 'Checkpoint · Flow', 'Combine endings, pauses and pace', ['breath', 'jaw', 'lips', 'face'],
    { name: 'Checkpoint passage', how: 'Read the passage with clean endings, real pauses, and an audible finish.' },
    BASELINE_PASSAGE,
    { checkpoint: true }),

  D(15, 2, 'Mid-point baseline', 'Halfway measurement', ['breath', 'jaw', 'lips', 'face', 'hum'],
    { name: 'Mid-point recording', how: 'Same passage as day 1. Listen to both — what actually changed?' },
    BASELINE_PASSAGE,
    { baseline: true, checkpoint: true, prompt: 'Then: 30 seconds on what you have noticed improving.' }),

  // ---- Stage 3 · Application: Under Pressure (days 16–22) ----
  D(16, 3, 'Interview answer', 'Open strongly, finish clearly', ['breath', 'jaw', 'lips'],
    { name: 'Tell me about yourself', how: 'Record a 45-second answer. Land the final words of every sentence.' },
    'Tell me about yourself and what you are looking for next.'),

  D(17, 3, 'Structure out loud', 'STAR, spoken', ['breath', 'hum', 'face'],
    { name: 'Situation-Task-Action-Result', how: 'Answer with four clear beats and a deliberate pause between them.' },
    'Describe a time you solved a difficult problem.'),

  D(18, 3, 'State disagreement', 'Clear, not sharp', ['breath', 'jaw', 'lips'],
    { name: 'Disagree plainly', how: 'Disagree in one clean sentence, then give the reason. No hedging filler.' },
    'I see it differently. Here is the trade-off I would weigh instead.'),

  D(19, 3, 'Disagree upward', 'Tone with a decision-maker', ['breath', 'hum', 'face'],
    { name: 'Respectful pushback', how: 'Same message, steadier tone. Slow down on the key word.' },
    'I would push back on that timeline, and here is why it matters.'),

  D(20, 3, 'Drop the jargon', 'Plain English explanation', ['breath', 'jaw', 'face'],
    { name: 'Explain it simply', how: 'Explain something technical to a smart non-expert in 30 seconds.' },
    'Explain what your team does to someone outside the industry.'),

  D(21, 3, 'Checkpoint · Pressure', 'Recorded 60-second answer', ['breath', 'jaw', 'lips', 'hum'],
    { name: 'Checkpoint answer', how: 'One minute on a real work question. Clean endings, real pauses.' },
    'What is the biggest risk in your current project, and what are you doing about it?',
    { checkpoint: true }),

  D(22, 3, 'Unexpected prompts', 'Think while speaking', ['breath', 'hum', 'jaw'],
    { name: 'Cold prompt', how: 'Take a breath, then answer immediately — no restarting.' },
    'You have 30 seconds: pitch an idea you have never pitched before.'),

  // ---- Stage 4 · Application: Transfer (days 23–30) ----
  D(23, 4, 'Cold open', 'Start strong with no warm-up', ['breath', 'jaw', 'lips'],
    { name: 'No-run-up start', how: 'Begin speaking the instant you press record. Own the first sentence.' },
    'Give a 30-second update as if you have just been called on.'),

  D(24, 4, 'Names and numbers', 'Precision that people notice', ['jaw', 'lips', 'face'],
    { name: 'Say it exactly', how: 'Speak figures and names slowly — the last digit gets full energy.' },
    'Report three numbers: forty-four, nineteen eighty-five, seven hundred and six.'),

  D(25, 4, 'On the phone / on video', 'Clarity without visual cues', ['breath', 'jaw', 'hum'],
    { name: 'Audio-only clarity', how: 'Slightly more energy and mouth movement than face-to-face.' },
    'Walk a colleague through your week in 30 seconds, as if by phone.'),

  D(26, 4, 'Presentation opening', 'First 20 seconds', ['breath', 'hum', 'face'],
    { name: 'Land the opening', how: 'Say your opening line three times — each one calmer and clearer.' },
    'Open a presentation to your team with one clear sentence about why it matters.'),

  D(27, 4, 'Q&A under pressure', 'Answer the actual question', ['breath', 'jaw', 'lips'],
    { name: 'Direct answer', how: 'Answer in one sentence first, then add detail. No warm-up waffle.' },
    'Why should we fund this over the other options?'),

  D(28, 4, 'Interruption & recovery', 'Hold your thread', ['breath', 'hum', 'jaw'],
    { name: 'Recover cleanly', how: 'Practise: pause, acknowledge in three words, return to your point.' },
    'Pick up your thread: “Yes — and to finish my point…”'),

  D(29, 4, 'Transfer rehearsal', 'Full real-world run', ['breath', 'jaw', 'lips', 'face', 'hum'],
    { name: 'Real run', how: 'Record a 2-minute piece from your actual work — a pitch, a review, a briefing.' },
    'Your real thing: the pitch, briefing or update you actually have to give.'),

  D(30, 4, 'Final baseline', 'Day 30 measurement', ['breath', 'jaw', 'lips', 'face', 'hum'],
    { name: 'Final recording', how: 'Same passage as day 1 and day 15. Compare all three side by side.' },
    BASELINE_PASSAGE,
    { baseline: true, checkpoint: true, prompt: 'Then: 30 seconds on how you sound now versus day 1.' })
]

// --- helpers -----------------------------------------------------------------

export function dayInfo(day) {
  const n = Math.min(Math.max(1, Math.round(day)), PLAN_LENGTH)
  return CURRICULUM[n - 1]
}

export function stageFor(day) {
  const info = dayInfo(day)
  return STAGES.find((s) => s.id === info.stage) || STAGES[0]
}

export function isCheckpoint(day) {
  return CHECKPOINTS.includes(Math.round(day))
}

export function isBaseline(day) {
  return BASELINE_DAYS.includes(Math.round(day))
}

/** All baseline days up to and including `day` — used for side-by-side compare. */
export function baselinesUpTo(day) {
  return BASELINE_DAYS.filter((d) => d <= Math.round(day))
}

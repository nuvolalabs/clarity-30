// Pure speech metrics computed from a transcript + duration. No browser APIs, so
// it runs (and is tested) anywhere. Used to give the day's recording a score and
// one concrete correction to work on.

const FILLERS = ['um', 'uh', 'er', 'erm', 'ah', 'like', 'you know', 'sort of', 'kind of', 'basically', 'actually']

function words(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

export function countFillers(text) {
  const w = words(text)
  const counts = {}
  let total = 0
  // single-word fillers
  for (const tok of w) {
    if (FILLERS.includes(tok)) {
      counts[tok] = (counts[tok] || 0) + 1
      total += 1
    }
  }
  // multi-word fillers
  const joined = ` ${w.join(' ')} `
  for (const f of FILLERS) {
    if (f.includes(' ')) {
      const hits = joined.split(` ${f} `).length - 1
      if (hits > 0) {
        counts[f] = (counts[f] || 0) + hits
        total += hits
      }
    }
  }
  return { total, counts }
}

export function wpm(wordCount, durationSec) {
  if (!durationSec || durationSec <= 0) return 0
  return Math.round((wordCount / durationSec) * 60)
}

export function paceLabel(w) {
  if (!w) return 'no speech detected'
  if (w < 110) return 'slow'
  if (w <= 160) return 'steady'
  if (w <= 190) return 'brisk'
  return 'rushed'
}

/** 0–100 clarity score from pace, filler density and finishing words. */
export function clarityScore({ wordCount, durationSec, fillerCount, endsClearly = true }) {
  const w = wpm(wordCount, durationSec)
  if (!w) return 0
  let score = 100
  // pace: ideal band 110–160
  if (w > 160) score -= Math.min(25, (w - 160) * 0.6)
  if (w < 110) score -= Math.min(20, (110 - w) * 0.5)
  // fillers per minute
  const fpm = durationSec > 0 ? (fillerCount / durationSec) * 60 : 0
  score -= Math.min(30, fpm * 3)
  if (!endsClearly) score -= 10
  return Math.max(0, Math.round(score))
}

/** The single most useful correction for this attempt. */
export function topSuggestion({ wordCount, durationSec, fillerCount, endsClearly = true }) {
  const w = wpm(wordCount, durationSec)
  if (!w) return 'No speech detected — check your microphone and record again.'
  const fpm = durationSec > 0 ? (fillerCount / durationSec) * 60 : 0
  if (fpm >= 4) return `Cut the fillers — ${fillerCount} in ${Math.round(durationSec)}s. Replace each one with a silent pause.`
  if (w > 165) return `Slow down — you spoke at ${w} words a minute. Aim for 140 and let the ends land.`
  if (w < 105) return `Lift the pace a little — ${w} words a minute is below conversational.`
  if (!endsClearly) return 'Keep full energy through the last three words of each sentence.'
  return 'Good control. Now push the final consonants a touch crisper and keep this pace.'
}

export function analyse({ transcript, durationSec, wordCount, endsClearly = true }) {
  const wc = wordCount ?? words(transcript).length
  const fillers = countFillers(transcript)
  const base = {
    wordCount: wc,
    durationSec: Math.round(durationSec || 0),
    fillerCount: fillers.total,
    fillerCounts: fillers.counts,
    wpm: wpm(wc, durationSec),
    endsClearly
  }
  base.pace = paceLabel(base.wpm)
  base.fillerPerMinute = durationSec > 0 ? Math.round((fillers.total / durationSec) * 60 * 10) / 10 : 0
  base.score = clarityScore(base)
  base.suggestion = topSuggestion(base)
  return base
}

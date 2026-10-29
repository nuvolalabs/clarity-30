// Progress state: quiz answers, per-day completion logs and self-ratings.
// Persisted in localStorage (injectable so it is testable without a browser).
//
// Pure helpers (streak / currentDay / completedCount) take a state object and a
// clock, so they are trivially unit-testable.

import { PLAN_LENGTH } from './curriculum.js'

const STATE_KEY = 'clarity30.state.v1'

function safeLocalStorage() {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage
  } catch {
    return null
  }
}

export function emptyState() {
  return {
    version: 1,
    startedAt: null,
    answers: null,
    days: {} // day -> { completedAt, selfRating, correction, note }
  }
}

// --- pure helpers ------------------------------------------------------------

export function completedCount(state) {
  return Object.values(state?.days || {}).filter((d) => d && d.completedAt).length
}

export function lastCompletedDay(state) {
  const done = Object.entries(state?.days || {})
    .filter(([, d]) => d && d.completedAt)
    .map(([k]) => Number(k))
  return done.length ? Math.max(...done) : 0
}

/** The first day not yet completed (clamped to the plan length). */
export function currentDay(state) {
  for (let d = 1; d <= PLAN_LENGTH; d++) {
    if (!state?.days?.[d]?.completedAt) return d
  }
  return PLAN_LENGTH
}

/** Consecutive completed days ending at the most recent completion. */
export function streak(state) {
  let d = lastCompletedDay(state)
  if (!d) return 0
  let run = 0
  while (d >= 1 && state?.days?.[d]?.completedAt) {
    run += 1
    d -= 1
  }
  return run
}

export function isDayComplete(state, day) {
  return Boolean(state?.days?.[day]?.completedAt)
}

/** Days elapsed since starting (1-based), clamped to the plan length. */
export function daysElapsed(state, now = Date.now()) {
  if (!state?.startedAt) return 1
  const start = new Date(state.startedAt)
  start.setHours(0, 0, 0, 0)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((today - start) / (24 * 60 * 60 * 1000)) + 1
  return Math.min(PLAN_LENGTH, Math.max(1, diff))
}

/** Consistency: completed days ÷ days elapsed. */
export function consistency(state, now = Date.now()) {
  const elapsed = daysElapsed(state, now)
  return Math.round((completedCount(state) / elapsed) * 100)
}

// --- store factory -----------------------------------------------------------

export function createStore(storage = safeLocalStorage()) {
  function load() {
    if (!storage) return emptyState()
    try {
      const raw = storage.getItem(STATE_KEY)
      return raw ? { ...emptyState(), ...JSON.parse(raw) } : emptyState()
    } catch {
      return emptyState()
    }
  }

  function save(state) {
    if (!storage) return state
    try {
      storage.setItem(STATE_KEY, JSON.stringify(state))
    } catch {
      /* quota / private mode — best effort */
    }
    return state
  }

  return {
    load,
    save,
    start(answers) {
      const state = { ...emptyState(), startedAt: new Date().toISOString(), answers }
      return save(state)
    },
    completeDay(day, patch = {}) {
      const state = load()
      state.days = state.days || {}
      state.days[day] = { ...(state.days[day] || {}), ...patch, completedAt: new Date().toISOString() }
      return save(state)
    },
    setDayRating(day, selfRating) {
      const state = load()
      state.days = state.days || {}
      state.days[day] = { ...(state.days[day] || {}), selfRating }
      return save(state)
    },
    reset() {
      if (storage) storage.removeItem(STATE_KEY)
      return emptyState()
    }
  }
}

export const store = createStore()

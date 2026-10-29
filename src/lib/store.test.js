import { describe, it, expect, beforeEach } from 'vitest'
import {
  completedCount,
  consistency,
  createStore,
  currentDay,
  daysElapsed,
  emptyState,
  isDayComplete,
  lastCompletedDay,
  streak
} from './store.js'

function fakeStorage() {
  const map = new Map()
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _map: map
  }
}

const completed = (days) => {
  const s = emptyState()
  for (const d of days) s.days[d] = { completedAt: new Date().toISOString() }
  return s
}

describe('progress maths', () => {
  it('counts completed days', () => {
    expect(completedCount(emptyState())).toBe(0)
    expect(completedCount(completed([1, 2, 5]))).toBe(3)
  })

  it('finds the first incomplete day as "today"', () => {
    expect(currentDay(emptyState())).toBe(1)
    expect(currentDay(completed([1, 2]))).toBe(3)
    expect(currentDay(completed([1, 3]))).toBe(2)
  })

  it('clamps today to the plan length when everything is done', () => {
    const all = completed(Array.from({ length: 30 }, (_, i) => i + 1))
    expect(currentDay(all)).toBe(30)
  })

  it('reports the last completed day', () => {
    expect(lastCompletedDay(emptyState())).toBe(0)
    expect(lastCompletedDay(completed([1, 4, 7]))).toBe(7)
  })

  it('streak counts consecutive days ending at the latest completion', () => {
    expect(streak(emptyState())).toBe(0)
    expect(streak(completed([1, 2, 3]))).toBe(3)
    expect(streak(completed([1, 2, 4]))).toBe(1) // day 3 breaks the run
    expect(streak(completed([1, 2, 3, 4, 5]))).toBe(5)
  })

  it('consistency = completed ÷ days elapsed', () => {
    const start = new Date('2026-10-01T09:00:00Z')
    const s = completed([1, 2, 3])
    s.startedAt = start.toISOString()
    const day4 = new Date('2026-10-04T12:00:00Z').getTime()
    expect(daysElapsed(s, day4)).toBe(4)
    expect(consistency(s, day4)).toBe(75)
  })

  it('daysElapsed is 1 on the start day and clamped to 30', () => {
    // Local-time constructors so the assertion is timezone-independent.
    const s = { ...emptyState(), startedAt: new Date(2026, 9, 1, 0, 0, 0).toISOString() }
    expect(daysElapsed(s, new Date(2026, 9, 1, 23, 0, 0).getTime())).toBe(1)
    expect(daysElapsed(s, new Date(2027, 0, 1, 0, 0, 0).getTime())).toBe(30)
  })
})

describe('store persistence', () => {
  let storage
  let s
  beforeEach(() => {
    storage = fakeStorage()
    s = createStore(storage)
  })

  it('starts empty', () => {
    expect(s.load().startedAt).toBeNull()
    expect(isDayComplete(s.load(), 1)).toBe(false)
  })

  it('start() records the answers and a start date', () => {
    const state = s.start({ gender: 'male', clarity: 3, confidence: 2 })
    expect(state.startedAt).toBeTruthy()
    expect(state.answers.gender).toBe('male')
    expect(s.load().answers.clarity).toBe(3)
  })

  it('completeDay() logs a day and is idempotent in shape', () => {
    s.start({})
    s.completeDay(1, { selfRating: 4, correction: 'finish the T' })
    const st = s.load()
    expect(isDayComplete(st, 1)).toBe(true)
    expect(st.days[1].selfRating).toBe(4)
    expect(st.days[1].correction).toBe('finish the T')
    s.completeDay(1, { selfRating: 5 })
    expect(s.load().days[1].selfRating).toBe(5)
    expect(completedCount(s.load())).toBe(1)
  })

  it('reset() clears everything', () => {
    s.start({})
    s.completeDay(1, {})
    s.reset()
    expect(s.load().startedAt).toBeNull()
    expect(completedCount(s.load())).toBe(0)
  })

  it('survives corrupt stored JSON', () => {
    storage.setItem('clarity30.state.v1', '{not json')
    expect(s.load().startedAt).toBeNull()
  })
})

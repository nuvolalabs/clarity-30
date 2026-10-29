import { describe, it, expect } from 'vitest'
import {
  BASELINE_DAYS,
  BASELINE_PASSAGE,
  CHECKPOINTS,
  CURRICULUM,
  DAILY_BLOCKS,
  PLAN_LENGTH,
  STAGES,
  baselinesUpTo,
  dayInfo,
  isBaseline,
  isCheckpoint,
  stageFor
} from './curriculum.js'

describe('curriculum shape', () => {
  it('has exactly 30 days, numbered 1..30', () => {
    expect(CURRICULUM).toHaveLength(PLAN_LENGTH)
    CURRICULUM.forEach((d, i) => expect(d.day).toBe(i + 1))
  })

  it('the daily loop adds up to 10 minutes', () => {
    const total = DAILY_BLOCKS.reduce((a, b) => a + b.minutes, 0)
    expect(total).toBe(10)
    expect(DAILY_BLOCKS.map((b) => b.id)).toEqual(['reset', 'drill', 'record', 'repeat'])
  })

  it('every day has a warm-up, a drill and something to say', () => {
    for (const d of CURRICULUM) {
      expect(d.warmup.length).toBeGreaterThan(0)
      expect(d.drill.name).toBeTruthy()
      expect(d.drill.how).toBeTruthy()
      expect(d.say).toBeTruthy()
    }
  })

  it('the four stages tile days 1..30 with no gaps', () => {
    const covered = STAGES.flatMap((s) => {
      const [a, b] = s.days
      return Array.from({ length: b - a + 1 }, (_, i) => a + i)
    })
    expect(covered).toHaveLength(PLAN_LENGTH)
    expect(new Set(covered).size).toBe(PLAN_LENGTH)
    expect(Math.min(...covered)).toBe(1)
    expect(Math.max(...covered)).toBe(PLAN_LENGTH)
  })

  it('maps the two phases onto the two stage blocks', () => {
    expect(stageFor(1).phase).toBe('Foundation')
    expect(stageFor(15).phase).toBe('Foundation')
    expect(stageFor(16).phase).toBe('Real-World Application')
    expect(stageFor(30).phase).toBe('Real-World Application')
  })
})

describe('baselines and checkpoints', () => {
  it('marks baselines on days 1, 15 and 30', () => {
    expect(BASELINE_DAYS).toEqual([1, 15, 30])
    for (const d of BASELINE_DAYS) expect(isBaseline(d)).toBe(true)
    expect(isBaseline(14)).toBe(false)
  })

  it('marks checkpoints on 7, 14, 15, 21 and 30', () => {
    expect(CHECKPOINTS).toEqual([7, 14, 15, 21, 30])
    expect(isCheckpoint(7)).toBe(true)
    expect(isCheckpoint(8)).toBe(false)
  })

  it('uses the SAME passage on every baseline so the comparison is fair', () => {
    for (const d of BASELINE_DAYS) {
      expect(dayInfo(d).say).toBe(BASELINE_PASSAGE)
    }
  })

  it('lists only baselines that have already happened', () => {
    expect(baselinesUpTo(1)).toEqual([1])
    expect(baselinesUpTo(14)).toEqual([1])
    expect(baselinesUpTo(15)).toEqual([1, 15])
    expect(baselinesUpTo(30)).toEqual([1, 15, 30])
  })
})

describe('dayInfo clamping', () => {
  it('clamps out-of-range days instead of crashing', () => {
    expect(dayInfo(0).day).toBe(1)
    expect(dayInfo(99).day).toBe(30)
    expect(dayInfo(12.4).day).toBe(12)
  })
})

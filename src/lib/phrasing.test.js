import { describe, it, expect } from 'vitest'
import {
  STAGE_CATEGORIES,
  SWAPS,
  SWAP_CATEGORIES,
  categoriesForStage,
  categoryById,
  practiceLine,
  swapsByCategory,
  swapsForDay
} from './phrasing.js'

describe('swap library integrity', () => {
  it('has unique ids', () => {
    const ids = SWAPS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every swap is complete and belongs to a real category', () => {
    const catIds = new Set(SWAP_CATEGORIES.map((c) => c.id))
    for (const s of SWAPS) {
      expect(s.weak, s.id).toBeTruthy()
      expect(s.strong, s.id).toBeTruthy()
      expect(s.why, s.id).toBeTruthy()
      expect(catIds.has(s.category), `${s.id} -> ${s.category}`).toBe(true)
    }
  })

  it('the weak and strong versions actually differ', () => {
    for (const s of SWAPS) expect(s.weak).not.toBe(s.strong)
  })

  it('every category has at least one swap', () => {
    for (const c of SWAP_CATEGORIES) {
      expect(swapsByCategory(c.id).length, c.id).toBeGreaterThan(0)
    }
  })

  it('includes the canonical example: “Sorry I’m late” → “Thanks for waiting”', () => {
    const found = SWAPS.find((s) => /sorry i’m late/i.test(s.weak))
    expect(found).toBeTruthy()
    expect(found.strong).toMatch(/thanks for waiting/i)
  })

  it('covers the everyday high-value families', () => {
    const ids = SWAP_CATEGORIES.map((c) => c.id)
    for (const need of ['apology', 'hedge', 'disagree', 'meeting', 'interview', 'refuse']) {
      expect(ids).toContain(need)
    }
  })
})

describe('stage mapping', () => {
  it('gives every stage categories', () => {
    for (const id of [1, 2, 3, 4]) {
      expect(categoriesForStage(id).length).toBeGreaterThan(0)
      // categories referenced must exist
      for (const c of categoriesForStage(id)) expect(categoryById(c)).toBeTruthy()
    }
  })

  it('falls back to stage 1 for an unknown stage', () => {
    expect(categoriesForStage(99)).toEqual(STAGE_CATEGORIES[1])
  })
})

describe('swapsForDay', () => {
  it('returns exactly three swaps', () => {
    for (const day of [1, 2, 7, 15, 22, 30]) {
      expect(swapsForDay(day, 1).length).toBe(3)
    }
  })

  it('is deterministic', () => {
    expect(swapsForDay(4, 2)).toEqual(swapsForDay(4, 2))
  })

  it('never repeats a swap within the same day', () => {
    for (let day = 1; day <= 30; day++) {
      const ids = swapsForDay(day, ((day - 1) % 4) + 1).map((s) => s.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('varies across consecutive days', () => {
    const a = swapsForDay(3, 1).map((s) => s.id).join(',')
    const b = swapsForDay(4, 1).map((s) => s.id).join(',')
    expect(a).not.toBe(b)
  })

  it('draws from the stage’s own categories where possible', () => {
    const cats = new Set(categoriesForStage(1))
    const day1 = swapsForDay(1, 1)
    expect(day1.some((s) => cats.has(s.category))).toBe(true)
  })
})

describe('practiceLine', () => {
  it('quotes the strong version', () => {
    const line = practiceLine(SWAPS[0])
    expect(line).toContain(SWAPS[0].strong)
  })
})

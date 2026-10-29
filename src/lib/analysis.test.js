import { describe, it, expect } from 'vitest'
import { analyse, clarityScore, countFillers, paceLabel, topSuggestion, wpm } from './analysis.js'

describe('wpm / pace', () => {
  it('computes words per minute', () => {
    expect(wpm(140, 60)).toBe(140)
    expect(wpm(70, 30)).toBe(140)
    expect(wpm(100, 0)).toBe(0)
  })

  it('labels the pace band', () => {
    expect(paceLabel(0)).toBe('no speech detected')
    expect(paceLabel(100)).toBe('slow')
    expect(paceLabel(140)).toBe('steady')
    expect(paceLabel(175)).toBe('brisk')
    expect(paceLabel(200)).toBe('rushed')
  })
})

describe('fillers', () => {
  it('counts single-word fillers', () => {
    expect(countFillers('Um, so I, uh, like, think').total).toBe(3)
  })

  it('counts multi-word fillers', () => {
    expect(countFillers('Well, you know, it is kind of basically fine').total).toBe(3)
  })

  it('ignores clean speech', () => {
    expect(countFillers('I will send the report this afternoon').total).toBe(0)
  })
})

describe('clarity score', () => {
  it('is zero when nothing was said', () => {
    expect(clarityScore({ wordCount: 0, durationSec: 30, fillerCount: 0 })).toBe(0)
  })

  it('rewards steady, filler-free speech', () => {
    const good = clarityScore({ wordCount: 140, durationSec: 60, fillerCount: 0 })
    expect(good).toBeGreaterThanOrEqual(95)
  })

  it('penalises rushing and fillers', () => {
    const rushed = clarityScore({ wordCount: 260, durationSec: 60, fillerCount: 8 })
    const steady = clarityScore({ wordCount: 140, durationSec: 60, fillerCount: 0 })
    expect(rushed).toBeLessThan(steady)
  })

  it('never goes below zero', () => {
    expect(clarityScore({ wordCount: 400, durationSec: 60, fillerCount: 40 })).toBeGreaterThanOrEqual(0)
  })
})

describe('one suggestion', () => {
  it('prioritises fillers when they are dense', () => {
    expect(topSuggestion({ wordCount: 140, durationSec: 60, fillerCount: 10 })).toMatch(/filler/i)
  })
  it('tells you to slow down when rushing', () => {
    expect(topSuggestion({ wordCount: 200, durationSec: 60, fillerCount: 0 })).toMatch(/slow down/i)
  })
  it('handles silence', () => {
    expect(topSuggestion({ wordCount: 0, durationSec: 20, fillerCount: 0 })).toMatch(/no speech/i)
  })
})

describe('analyse', () => {
  it('produces a full metrics object from a transcript', () => {
    const m = analyse({ transcript: 'I will finish every word I start today', durationSec: 30 })
    expect(m.wordCount).toBe(8)
    expect(m.wpm).toBe(16)
    expect(m.score).toBeGreaterThanOrEqual(0)
    expect(m.suggestion).toBeTruthy()
    expect(m.pace).toBeTruthy()
  })
})

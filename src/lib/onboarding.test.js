import { describe, it, expect } from 'vitest'
import { QUIZ, defaultAnswers, isComplete, personalize, SCOPE_NOTE } from './onboarding.js'

const full = {
  scopeAcknowledged: true,
  gender: 'male',
  clarity: 4,
  confidence: 3,
  challenges: ['Speaking too fast'],
  contexts: ['Meetings'],
  baseline: 'later'
}

describe('quiz definition', () => {
  it('asks for scope acknowledgement and a gender selection', () => {
    const ids = QUIZ.map((q) => q.id)
    expect(ids).toContain('scope')
    expect(ids).toContain('gender')
    expect(QUIZ.find((q) => q.id === 'gender').options.map((o) => o.value)).toEqual([
      'male',
      'female',
      'nonbinary',
      'unspecified'
    ])
  })

  it('is explicit that this is not clinical speech therapy', () => {
    expect(SCOPE_NOTE.toLowerCase()).toContain('not clinical speech')
    expect(SCOPE_NOTE.toLowerCase()).toContain('does not diagnose')
  })
})

describe('isComplete', () => {
  it('requires the scope, gender and both ratings', () => {
    expect(isComplete(defaultAnswers())).toBe(false)
    expect(isComplete(full)).toBe(true)
    expect(isComplete({ ...full, scopeAcknowledged: false })).toBe(false)
    expect(isComplete({ ...full, gender: null })).toBe(false)
    expect(isComplete({ ...full, clarity: null })).toBe(false)
  })
})

describe('personalize', () => {
  it('is deterministic for the same answers', () => {
    expect(personalize(full)).toEqual(personalize(full))
  })

  it('gives a gender-specific, non-clinical voice note', () => {
    expect(personalize({ ...full, gender: 'female' }).voiceNote).toMatch(/female/i)
    expect(personalize({ ...full, gender: 'male' }).voiceNote).toMatch(/male/i)
    expect(personalize({ ...full, gender: 'unspecified' }).voiceNote).toBeTruthy()
  })

  it('turns selected challenges into concrete tips', () => {
    const p = personalize({ ...full, challenges: ['Speaking too fast', 'Running out of breath'] })
    expect(p.tips.join(' ')).toMatch(/metronome/i)
    expect(p.tips.join(' ')).toMatch(/diaphragm/i)
  })

  it('always returns at least one tip', () => {
    expect(personalize({ ...full, challenges: [] }).tips.length).toBeGreaterThan(0)
  })

  it('computes a starting score from the self-ratings', () => {
    expect(personalize({ ...full, clarity: 5, confidence: 5 }).startingScore).toBe(100)
    expect(personalize({ ...full, clarity: 1, confidence: 1 }).startingScore).toBe(20)
  })
})

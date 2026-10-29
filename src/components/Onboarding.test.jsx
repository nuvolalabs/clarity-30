// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import Onboarding from './Onboarding.jsx'

afterEach(cleanup)

describe('Onboarding quiz', () => {
  it('gates the first step on acknowledging the scope note', () => {
    render(<Onboarding onDone={() => {}} />)
    expect(screen.getByText('Before we start')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(true)
    fireEvent.click(screen.getByText(/I understand/))
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(false)
  })

  it('will not advance past a rating step without a rating', () => {
    render(<Onboarding onDone={() => {}} />)
    fireEvent.click(screen.getByText(/I understand/))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    // gender step
    fireEvent.click(screen.getByRole('button', { name: 'Female' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    // clarity step — Continue is disabled until a number is chosen
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(false)
  })

  it('walks the whole quiz and reports the collected answers', () => {
    const onDone = vi.fn()
    render(<Onboarding onDone={onDone} />)

    fireEvent.click(screen.getByText(/I understand/))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })) // -> gender
    fireEvent.click(screen.getByRole('button', { name: 'Female' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })) // -> clarity
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })) // -> confidence
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })) // -> challenges
    fireEvent.click(screen.getByText('Speaking too fast'))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })) // -> contexts
    fireEvent.click(screen.getByText('Meetings'))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })) // -> baseline
    fireEvent.click(screen.getByRole('button', { name: 'Later, on the dashboard' }))
    fireEvent.click(screen.getByRole('button', { name: 'Start Day 1' }))

    expect(onDone).toHaveBeenCalledTimes(1)
    const answers = onDone.mock.calls[0][0]
    expect(answers.gender).toBe('female')
    expect(answers.clarity).toBe(4)
    expect(answers.confidence).toBe(3)
    expect(answers.challenges).toEqual(['Speaking too fast'])
    expect(answers.contexts).toEqual(['Meetings'])
    expect(answers.baseline).toBe('later')
  })
})

// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App.jsx'

beforeEach(() => {
  localStorage.clear()
  cleanup()
})
afterEach(cleanup)

function finishOnboarding() {
  fireEvent.click(screen.getByText(/I understand/))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  fireEvent.click(screen.getByRole('button', { name: 'Male' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  fireEvent.click(screen.getByRole('button', { name: '3' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  fireEvent.click(screen.getByRole('button', { name: '3' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  fireEvent.click(screen.getByRole('button', { name: 'Later, on the dashboard' }))
  fireEvent.click(screen.getByRole('button', { name: 'Start Day 1' }))
}

describe('App end-to-end (client side)', () => {
  it('opens on the onboarding quiz for a brand-new user', () => {
    render(<App />)
    expect(screen.getByText('Clarity30')).toBeTruthy()
    expect(screen.getByText('Before we start')).toBeTruthy()
  })

  it('reaches the Day 1 dashboard after completing onboarding', () => {
    render(<App />)
    finishOnboarding()
    expect(screen.getByText(/Start Day 1/)).toBeTruthy()
    expect(screen.getByText('Personalised for you')).toBeTruthy()
    expect(screen.getByText('🔥 0 days')).toBeTruthy()
  })

  it('navigates to Progress and shows the 30-day grid', () => {
    render(<App />)
    finishOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'Progress' }))
    expect(screen.getByText('Your 30 days')).toBeTruthy()
    expect(screen.getByText('0/30')).toBeTruthy()
  })

  it('remembers an in-progress plan after a reload (persistence)', () => {
    const first = render(<App />)
    finishOnboarding()
    first.unmount()
    cleanup()
    render(<App />)
    // No quiz this time — straight to the dashboard.
    expect(screen.queryByText('Before we start')).toBeNull()
    expect(screen.getByText(/Start Day 1/)).toBeTruthy()
  })
})

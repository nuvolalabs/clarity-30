import { useState } from 'react'
import { QUIZ, defaultAnswers, isComplete, SCOPE_NOTE } from '../lib/onboarding.js'

function Option({ active, onClick, children }) {
  return (
    <button type="button" className={active ? 'opt active' : 'opt'} onClick={onClick}>
      {children}
    </button>
  )
}

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(defaultAnswers())
  const q = QUIZ[step]
  const last = step === QUIZ.length - 1

  const set = (id, value) => setAnswers((a) => ({ ...a, [id]: value }))

  function toggleMulti(id, value) {
    setAnswers((a) => {
      const list = a[id] || []
      return { ...a, [id]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] }
    })
  }

  const canNext = (() => {
    switch (q.kind) {
      case 'acknowledge':
        return answers.scopeAcknowledged
      case 'single':
      case 'choice':
        return Boolean(answers[q.id])
      case 'scale':
        return answers[q.id] != null
      default:
        return true
    }
  })()

  function next() {
    if (!last) return setStep((s) => s + 1)
    if (isComplete(answers)) onDone(answers)
  }

  return (
    <div className="onboarding">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((step + 1) / QUIZ.length) * 100}%` }} />
      </div>

      <div className="card quiz-card">
        <div className="muted small">
          Step {step + 1} of {QUIZ.length}
        </div>
        <h2>{q.title}</h2>
        {q.help && <p className="muted">{q.help}</p>}

        {q.kind === 'acknowledge' && (
          <>
            <p className="scope">{q.body}</p>
            <Option active={answers.scopeAcknowledged} onClick={() => set('scopeAcknowledged', true)}>
              ✓ {q.cta}
            </Option>
          </>
        )}

        {q.kind === 'single' && (
          <div className="opt-list">
            {q.options.map((o) => (
              <Option key={o.value} active={answers[q.id] === o.value} onClick={() => set(q.id, o.value)}>
                {o.label}
              </Option>
            ))}
          </div>
        )}

        {q.kind === 'scale' && (
          <div className="scale">
            <div className="scale-row">
              {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.min + i).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={answers[q.id] === n ? 'scale-dot active' : 'scale-dot'}
                  onClick={() => set(q.id, n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="scale-labels muted small">
              <span>{q.labels[q.min]}</span>
              <span>{q.labels[q.max]}</span>
            </div>
          </div>
        )}

        {q.kind === 'multi' && (
          <div className="opt-list">
            {q.options.map((o) => (
              <Option key={o} active={(answers[q.id] || []).includes(o)} onClick={() => toggleMulti(q.id, o)}>
                {o}
              </Option>
            ))}
          </div>
        )}

        {q.kind === 'choice' && (
          <div className="opt-list">
            {q.options.map((o) => (
              <Option key={o.value} active={answers[q.id] === o.value} onClick={() => set(q.id, o.value)}>
                {o.label}
              </Option>
            ))}
          </div>
        )}

        <div className="row">
          <button className="btn ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
          <button className="btn primary" disabled={!canNext} onClick={next}>
            {last ? 'Start Day 1' : 'Continue'}
          </button>
        </div>
      </div>

      <p className="muted small scope-foot">
        {SCOPE_NOTE}
      </p>
    </div>
  )
}

import { useMemo, useState } from 'react'
import Onboarding from './components/Onboarding.jsx'
import Dashboard from './components/Dashboard.jsx'
import DaySession from './components/DaySession.jsx'
import CompareView from './components/CompareView.jsx'
import ProgressView from './components/ProgressView.jsx'
import PhrasesView from './components/PhrasesView.jsx'
import { store } from './lib/store.js'
import { personalize } from './lib/onboarding.js'
import { clearRecordings } from './lib/db.js'

export default function App() {
  const [state, setState] = useState(() => store.load())
  const [view, setView] = useState(() => (store.load().startedAt ? 'dashboard' : 'onboarding'))
  const [activeDay, setActiveDay] = useState(1)

  const personal = useMemo(() => (state.answers ? personalize(state.answers) : null), [state.answers])

  const refresh = () => setState(store.load())

  function handleOnboard(answers) {
    store.start(answers)
    refresh()
    setView('dashboard')
  }

  function openDay(day) {
    setActiveDay(day)
    setView('day')
  }

  async function handleComplete(day, patch) {
    store.completeDay(day, patch)
    refresh()
    setView('dashboard')
  }

  async function resetAll() {
    store.reset()
    await clearRecordings()
    setState(store.load())
    setView('onboarding')
  }

  if (view === 'onboarding') {
    return (
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <span className="brand-dot" />
            <div>
              <div className="brand-name">Clarity30</div>
              <div className="brand-tag">30 days · 10 minutes a day</div>
            </div>
          </div>
        </header>
        <main className="content">
          <Onboarding onDone={handleOnboard} />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <div className="brand-name">Clarity30</div>
            <div className="brand-tag">clear speech · authoritative phrasing</div>
          </div>
        </div>
      </header>

      <main className="content">
        {view === 'day' && (
          <DaySession day={activeDay} onComplete={handleComplete} onExit={() => setView('dashboard')} />
        )}
        {view === 'dashboard' && (
          <Dashboard
            state={state}
            personal={personal}
            onStartDay={openDay}
            onCompare={() => setView('compare')}
          />
        )}
        {view === 'compare' && <CompareView state={state} onExit={() => setView('dashboard')} />}
        {view === 'phrases' && <PhrasesView />}
        {view === 'progress' && (
          <ProgressView state={state} onReset={resetAll} onOpenDay={openDay} />
        )}
      </main>

      {view !== 'day' && (
        <nav className="tabbar">
          {[
            { id: 'dashboard', label: 'Today' },
            { id: 'progress', label: 'Progress' },
            { id: 'phrases', label: 'Phrases' },
            { id: 'compare', label: 'Compare' }
          ].map((t) => (
            <button
              key={t.id}
              className={view === t.id ? 'tab active' : 'tab'}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}

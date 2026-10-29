import { DAILY_BLOCKS, PLAN_LENGTH, dayInfo, isBaseline, isCheckpoint, stageFor } from '../lib/curriculum.js'
import { completedCount, consistency, currentDay, isDayComplete, streak } from '../lib/store.js'

export default function Dashboard({ state, personal, onStartDay, onCompare }) {
  const day = currentDay(state)
  const info = dayInfo(day)
  const stage = stageFor(day)
  const done = completedCount(state)
  const run = streak(state)
  const consist = consistency(state)
  const finished = isDayComplete(state, PLAN_LENGTH)

  return (
    <div className="dashboard">
      <div className="hero card">
        <div className="hero-top">
          <div>
            <div className="muted small">Today</div>
            <div className="hero-day">Day {day} <span className="muted">of {PLAN_LENGTH}</span></div>
          </div>
          <div className="streak-pill" title="Consecutive days completed">
            🔥 {run} day{run === 1 ? '' : 's'}
          </div>
        </div>

        <div className="stage-chip">{stage.name}</div>
        <p className="muted">{stage.blurb}</p>

        <div className="stat-row">
          <div className="stat"><div className="stat-v">{done}</div><div className="stat-l">days done</div></div>
          <div className="stat"><div className="stat-v">{consist}%</div><div className="stat-l">consistency</div></div>
          <div className="stat"><div className="stat-v">{stage.days[0]}–{stage.days[1]}</div><div className="stat-l">stage days</div></div>
        </div>

        {(isBaseline(day) || isCheckpoint(day)) && (
          <div className="flag">
            {isBaseline(day) && <span className="badge baseline">Baseline recording day</span>}
            {isCheckpoint(day) && <span className="badge checkpoint">Checkpoint</span>}
          </div>
        )}

        <button className="btn primary wide" onClick={() => onStartDay(day)}>
          {isDayComplete(state, day) ? 'Redo today’s session' : `Start Day ${day} · 10 minutes`}
        </button>
      </div>

      <div className="card">
        <div className="card-title">Today’s focus — {info.title}</div>
        <p className="muted">{info.focus}</p>
        <ul className="block-list">
          {DAILY_BLOCKS.map((b) => (
            <li key={b.id}>
              <span className="block-min">{b.minutes} min</span>
              <span className="block-name">{b.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {personal && (
        <div className="card">
          <div className="card-title">Personalised for you</div>
          <p className="muted">{personal.voiceNote}</p>
          <ul className="tip-list">
            {personal.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="card-title">Compare your recordings</div>
        <p className="muted">
          Day 1, Day 15 and Day 30 use the same passage, so you can hear the change side by side.
        </p>
        <button className="btn ghost" onClick={onCompare} disabled={done === 0}>
          Open comparison
        </button>
      </div>

      {finished && (
        <div className="card celebrate">
          <div className="card-title">🎉 30 days complete</div>
          <p className="muted">
            You finished the plan. Re-record Day 30 as often as you like — the comparison view
            keeps every baseline.
          </p>
        </div>
      )}
    </div>
  )
}

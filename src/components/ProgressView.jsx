import { PLAN_LENGTH, STAGES, dayInfo, isBaseline, isCheckpoint } from '../lib/curriculum.js'
import { completedCount, consistency, currentDay, isDayComplete, streak } from '../lib/store.js'

export default function ProgressView({ state, onReset, onOpenDay }) {
  const today = currentDay(state)
  const done = completedCount(state)
  const run = streak(state)
  const consist = consistency(state)

  return (
    <div className="progress-view">
      <h2>Your 30 days</h2>

      <div className="stat-row big">
        <div className="stat card"><div className="stat-v">{done}/{PLAN_LENGTH}</div><div className="stat-l">days complete</div></div>
        <div className="stat card"><div className="stat-v">🔥 {run}</div><div className="stat-l">day streak</div></div>
        <div className="stat card"><div className="stat-v">{consist}%</div><div className="stat-l">consistency</div></div>
      </div>

      <div className="grid30">
        {Array.from({ length: PLAN_LENGTH }, (_, i) => i + 1).map((d) => {
          const complete = isDayComplete(state, d)
          const classes = ['day-cell']
          if (complete) classes.push('done')
          if (d === today) classes.push('today')
          if (isBaseline(d)) classes.push('baseline')
          if (isCheckpoint(d)) classes.push('checkpoint')
          const info = dayInfo(d)
          return (
            <button
              key={d}
              className={classes.join(' ')}
              title={`Day ${d} · ${info.title}${isBaseline(d) ? ' (baseline)' : ''}${isCheckpoint(d) ? ' (checkpoint)' : ''}`}
              onClick={() => onOpenDay(d)}
            >
              {d}
            </button>
          )
        })}
      </div>

      <div className="legend muted small">
        <span><i className="sw done" /> complete</span>
        <span><i className="sw today" /> today</span>
        <span><i className="sw baseline" /> baseline</span>
        <span><i className="sw checkpoint" /> checkpoint</span>
      </div>

      <div className="card">
        <div className="card-title">Stages</div>
        <ul className="stage-list">
          {STAGES.map((s) => {
            const [a, b] = s.days
            const complete = Array.from({ length: b - a + 1 }, (_, i) => a + i).every((d) =>
              isDayComplete(state, d)
            )
            const active = today >= a && today <= b
            return (
              <li key={s.id} className={complete ? 'stage done' : active ? 'stage active' : 'stage'}>
                <span className="stage-days">Days {a}–{b}</span>
                <span className="stage-name">{s.name}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <button
        className="btn ghost small"
        onClick={() => {
          if (window.confirm('Reset the plan, your logs and all recordings on this device? This cannot be undone.')) onReset()
        }}
      >
        Reset all data
      </button>
    </div>
  )
}

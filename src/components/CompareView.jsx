import { useEffect, useState } from 'react'
import { BASELINE_DAYS } from '../lib/curriculum.js'
import { getRecording, keyFor } from '../lib/db.js'
import { isDayComplete } from '../lib/store.js'

export default function CompareView({ state, onExit }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let urls = []
    let alive = true
    ;(async () => {
      const out = []
      for (const d of BASELINE_DAYS) {
        if (!isDayComplete(state, d)) continue
        const rec = await getRecording(keyFor(d, 'record'))
        if (!rec) continue
        let url = null
        try {
          url = URL.createObjectURL(rec.blob)
          urls.push(url)
        } catch {
          url = null
        }
        out.push({ day: d, url, meta: rec.meta || {}, savedAt: rec.savedAt })
      }
      if (alive) {
        setItems(out)
        setLoading(false)
      }
    })()
    return () => {
      alive = false
      urls.forEach((u) => {
        try {
          URL.revokeObjectURL(u)
        } catch {
          /* noop */
        }
      })
    }
  }, [state])

  const rating = (d) => state?.days?.[d]?.selfRating

  return (
    <div className="compare">
      <div className="session-head">
        <button className="btn ghost small" onClick={onExit}>← Back</button>
        <div className="session-title">Baseline comparison</div>
      </div>

      <p className="muted">
        The same passage is recorded on Day 1, Day 15 and Day 30. Play them in order and listen
        for the change in endings, pace and how the last words land.
      </p>

      {loading && <p className="muted">Loading your recordings…</p>}

      {!loading && items.length === 0 && (
        <div className="card">
          <p className="muted">
            No baseline recordings yet. Complete Day 1 to create your first one.
          </p>
        </div>
      )}

      <div className="compare-grid">
        {items.map((it) => (
          <div key={it.day} className="card compare-card">
            <div className="card-title">
              Day {it.day} {it.day === 1 ? '· Baseline' : it.day === 15 ? '· Mid-point' : '· Final'}
            </div>
            {it.url ? <audio controls src={it.url} /> : <p className="muted small">No audio stored.</p>}
            <div className="muted small">
              {it.meta.durationSec ? `${Number(it.meta.durationSec).toFixed(1)}s` : '—'}
              {rating(it.day) ? ` · self-rated ${rating(it.day)}/5` : ''}
            </div>
            {it.meta.metrics && (
              <div className="stat-row">
                <div className="stat"><div className="stat-v">{it.meta.metrics.score}</div><div className="stat-l">clarity</div></div>
                <div className="stat"><div className="stat-v">{it.meta.metrics.wpm}</div><div className="stat-l">wpm</div></div>
                <div className="stat"><div className="stat-v">{it.meta.metrics.fillerCount}</div><div className="stat-l">fillers</div></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

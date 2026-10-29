import { useEffect, useRef, useState } from 'react'
import Recorder from './Recorder.jsx'
import { DAILY_BLOCKS, WARMUPS, dayInfo, isBaseline, isCheckpoint } from '../lib/curriculum.js'
import { analyse } from '../lib/analysis.js'
import { keyFor, putRecording } from '../lib/db.js'
import { isRecordingSupported } from '../lib/recorder.js'

function clock(sec) {
  const s = Math.max(0, Math.round(sec))
  return `${String(Math.floor(s / 60))}:${String(s % 60).padStart(2, '0')}`
}

function BlockTimer({ minutes }) {
  const total = minutes * 60
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setLeft(total)
    setRunning(false)
  }, [total])

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running])

  const pct = total ? Math.round(100 * (1 - left / total)) : 0
  return (
    <div className="timer-row">
      <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }} /></div>
      <div className="clock">{clock(left)}</div>
      <button className="btn ghost small" onClick={() => setRunning((r) => !r)}>
        {running ? 'Pause' : 'Start'}
      </button>
    </div>
  )
}

export default function DaySession({ day, onComplete, onExit }) {
  const info = dayInfo(day)
  const [step, setStep] = useState(0)
  const [record, setRecord] = useState(null)
  const [retry, setRetry] = useState(null)
  const [correction, setCorrection] = useState('')
  const [selfRating, setSelfRating] = useState(null)
  const [saving, setSaving] = useState(false)
  const block = DAILY_BLOCKS[step]

  async function handleCapture(slot, capture) {
    setSaving(true)
    try {
      const metrics = capture.transcript
        ? analyse({ transcript: capture.transcript, durationSec: capture.durationSec })
        : null
      const enriched = { ...capture, metrics }
      if (slot === 'record') setRecord(enriched)
      else setRetry(enriched)
      await putRecording(keyFor(day, slot), capture.blob, {
        transcript: capture.transcript || '',
        durationSec: capture.durationSec,
        metrics
      })
    } finally {
      setSaving(false)
    }
  }

  async function finish() {
    setSaving(true)
    try {
      await onComplete(day, {
        correction: correction || null,
        selfRating,
        hasRecording: Boolean(record),
        hasRetry: Boolean(retry)
      })
    } finally {
      setSaving(false)
    }
  }

  const shown = retry || record

  return (
    <div className="day-session">
      <div className="session-head">
        <button className="btn ghost small" onClick={onExit}>← Exit</button>
        <div className="session-title">Day {day} · {info.title}</div>
        <div className="muted small">{info.phase}</div>
      </div>

      <div className="stepper">
        {DAILY_BLOCKS.map((b, i) => (
          <div key={b.id} className={i === step ? 'step active' : i < step ? 'step done' : 'step'}>
            {b.title}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="block-head">
          <h2>{block.title}</h2>
          <span className="muted small">{block.minutes} min</span>
        </div>
        <p className="muted">{block.cue}</p>

        {isBaseline(day) && <span className="badge baseline">Baseline day</span>}
        {isCheckpoint(day) && !isBaseline(day) && <span className="badge checkpoint">Checkpoint</span>}

        {step === 0 && (
          <ul className="warm-list">
            {info.warmup.map((id) => (
              <li key={id}>{WARMUPS[id]}</li>
            ))}
          </ul>
        )}

        {step === 1 && (
          <div className="drill-now">
            <div className="drill-name">{info.drill.name}</div>
            <p className="muted">{info.drill.how}</p>
            <div className="target-chip">Today’s target: {info.focus}</div>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="say-box">
              <div className="muted small">Say this out loud</div>
              <p className="say">{info.say}</p>
              {info.prompt && <p className="muted small">Then: {info.prompt}</p>}
            </div>
            <Recorder label="Record" onCapture={(c) => handleCapture('record', c)} disabled={saving} />
            {record?.metrics && (
              <div className="metrics">
                <div className="stat-row">
                  <div className="stat"><div className="stat-v">{record.metrics.score}</div><div className="stat-l">clarity</div></div>
                  <div className="stat"><div className="stat-v">{record.metrics.wpm}</div><div className="stat-l">words/min</div></div>
                  <div className="stat"><div className="stat-v">{record.metrics.fillerCount}</div><div className="stat-l">fillers</div></div>
                </div>
                <p className="suggestion"><strong>One change:</strong> {record.metrics.suggestion}</p>
              </div>
            )}
            {record && !record.metrics && (
              <p className="muted small">
                Recorded {record.durationSec.toFixed(1)}s. This browser didn’t transcribe it, so
                no pace/filler score — judge it by ear and note one correction next.
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <p className="muted">
              Play it back. Pick <strong>one</strong> thing to fix, then record it once more.
            </p>
            {shown?.url ? (
              <audio className="playback" controls src={shown.url} />
            ) : (
              <p className="muted small">
                {isRecordingSupported()
                  ? 'Nothing recorded yet — go back a step and record.'
                  : 'Recording isn’t supported in this browser — read it aloud and mark the day complete.'}
              </p>
            )}

            <label className="field">
              <span>One correction for next time</span>
              <input
                type="text"
                value={correction}
                placeholder="e.g. finish the final T on “project”"
                onChange={(e) => setCorrection(e.target.value)}
              />
            </label>

            <Recorder label="Re-record" onCapture={(c) => handleCapture('retry', c)} disabled={saving} />

            <label className="field">
              <span>How clear did that feel? (optional)</span>
              <div className="scale-row">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={selfRating === n ? 'scale-dot active' : 'scale-dot'}
                    onClick={() => setSelfRating(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </label>
          </>
        )}

        <BlockTimer minutes={block.minutes} />

        <div className="row">
          <button className="btn ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
          {step < DAILY_BLOCKS.length - 1 ? (
            <button className="btn primary" onClick={() => setStep((s) => s + 1)}>Next · {DAILY_BLOCKS[step + 1].title}</button>
          ) : (
            <button className="btn primary" onClick={finish} disabled={saving}>
              {saving ? 'Saving…' : 'Complete Day ' + day}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

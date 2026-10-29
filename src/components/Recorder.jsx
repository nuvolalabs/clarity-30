import { useEffect, useRef, useState } from 'react'
import { isRecordingSupported, startRecording } from '../lib/recorder.js'
import { createRecognizer, speechSupported } from '../lib/speech.js'

function clock(sec) {
  const s = Math.max(0, Math.round(sec))
  return `${String(Math.floor(s / 60))}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Records audio, optionally transcribes it, and reports the result upward.
 * The parent owns persistence; this component owns capture + playback.
 */
export default function Recorder({ label = 'Record', onCapture, disabled = false, transcriptHint }) {
  const supported = isRecordingSupported()
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [capture, setCapture] = useState(null) // { url, durationSec, transcript }
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')
  const handleRef = useRef(null)
  const recognizerRef = useRef(null)
  const tickRef = useRef(null)

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current)
    try {
      recognizerRef.current?.stop()
    } catch {
      /* noop */
    }
  }, [])

  async function begin() {
    setError('')
    setInterim('')
    try {
      const recognizer = createRecognizer()
      recognizerRef.current = recognizer
      if (recognizer) {
        recognizer.onResult(({ interim: i }) => setInterim(i))
        recognizer.start()
      }
      const handle = await startRecording()
      handleRef.current = handle
      setRecording(true)
      const t0 = Date.now()
      tickRef.current = setInterval(() => setElapsed((Date.now() - t0) / 1000), 200)
    } catch (e) {
      setError(e?.message || 'Microphone unavailable — check permissions.')
    }
  }

  async function stop() {
    const handle = handleRef.current
    if (!handle) return
    if (tickRef.current) clearInterval(tickRef.current)
    recognizerRef.current?.stop()
    setRecording(false)
    const { blob, url, durationSec } = await handle.done
    const transcript = recognizerRef.current?.text || ''
    const result = { blob, url, durationSec, transcript }
    setCapture(result)
    handleRef.current = null
    setInterim('')
    onCapture?.(result)
  }

  if (!supported) {
    return (
      <div className="rec-unsupported">
        <strong>This browser can’t capture audio.</strong>
        <p className="muted">
          Use Chrome, Edge or Safari to record. You can still read the drill aloud and
          mark the day complete.
        </p>
      </div>
    )
  }

  return (
    <div className="recorder">
      <div className="rec-row">
        {!recording ? (
          <button className="btn primary" onClick={begin} disabled={disabled}>
            ● {label}
          </button>
        ) : (
          <button className="btn danger" onClick={stop}>
            ■ Stop · {clock(elapsed)}
          </button>
        )}
        {speechSupported() ? (
          <span className="muted small">Live transcription on</span>
        ) : (
          <span className="muted small">Transcription unavailable in this browser</span>
        )}
      </div>

      {interim && <p className="muted small interim">…{interim}</p>}
      {error && <p className="error">{error}</p>}

      {capture?.url && (
        <div className="playback">
          <audio controls src={capture.url} />
          <div className="muted small">
            {capture.durationSec.toFixed(1)}s recorded
            {capture.transcript ? ' · transcribed' : ' · no transcript'}
          </div>
          {transcriptHint && <p className="muted small">{transcriptHint}</p>}
        </div>
      )}
    </div>
  )
}

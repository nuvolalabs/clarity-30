// Thin wrapper over the Web Speech API, used to transcribe the recording so we can
// compute pace and filler metrics. Optional: the app works without it (Firefox),
// in which case we show duration + a self-rating instead of a made-up score.

export function speechSupported() {
  try {
    return Boolean(
      typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition)
    )
  } catch {
    return false
  }
}

/**
 * Create a recogniser that accumulates final results.
 * Returns null when unsupported.
 */
export function createRecognizer({ lang = 'en-US' } = {}) {
  if (!speechSupported()) return null
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  const rec = new Ctor()
  rec.lang = lang
  rec.continuous = true
  rec.interimResults = true

  let finalText = ''
  const listeners = { result: [], end: [] }

  rec.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const res = event.results[i]
      if (res.isFinal) finalText += res[0].transcript + ' '
      else interim += res[0].transcript
    }
    listeners.result.forEach((fn) => fn({ finalText: finalText.trim(), interim: interim.trim() }))
  }
  rec.onerror = () => {}
  rec.onend = () => listeners.end.forEach((fn) => fn(finalText.trim()))

  return {
    start() {
      try {
        rec.start()
      } catch {
        /* already started */
      }
    },
    stop() {
      try {
        rec.stop()
      } catch {
        /* not started */
      }
    },
    onResult(fn) {
      listeners.result.push(fn)
    },
    onEnd(fn) {
      listeners.end.push(fn)
    },
    get text() {
      return finalText.trim()
    }
  }
}

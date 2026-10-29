// MediaRecorder wrapper. Records audio entirely in the browser — nothing is
// uploaded. Returns a Blob plus an object URL and the measured duration.

export function isRecordingSupported() {
  try {
    return Boolean(
      typeof navigator !== 'undefined' &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function' &&
        typeof MediaRecorder !== 'undefined'
    )
  } catch {
    return false
  }
}

function pickMimeType() {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return ''
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || ''
}

/**
 * Start recording. Resolves to a handle:
 *   { stop(), done: Promise<{ blob, url, durationSec }>, stream }
 */
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mimeType = pickMimeType()
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
  const chunks = []
  const startedAt = Date.now()

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }

  const done = new Promise((resolve) => {
    recorder.onstop = () => {
      const durationSec = Math.max(0.1, (Date.now() - startedAt) / 1000)
      stream.getTracks().forEach((t) => t.stop())
      const type = recorder.mimeType || 'audio/webm'
      const blob = new Blob(chunks, { type })
      let url = null
      try {
        url = URL.createObjectURL(blob)
      } catch {
        url = null
      }
      resolve({ blob, url, durationSec })
    }
  })

  recorder.start()
  return {
    stop: () => recorder.stop(),
    done,
    stream
  }
}

/** Best-effort duration probe for a stored blob (used when metadata is missing). */
export function probeDuration(url) {
  return new Promise((resolve) => {
    try {
      const el = document.createElement('audio')
      el.preload = 'metadata'
      el.onloadedmetadata = () => resolve(Number.isFinite(el.duration) ? el.duration : 0)
      el.onerror = () => resolve(0)
      el.src = url
    } catch {
      resolve(0)
    }
  })
}

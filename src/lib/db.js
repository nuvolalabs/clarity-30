// Local audio storage. Recordings are Blobs held in IndexedDB (the right home for
// binary data — localStorage would blow its quota). Falls back to an in-memory Map
// when IndexedDB is unavailable (e.g. tests, private mode), so callers never crash.

const DB_NAME = 'clarity30'
const DB_VERSION = 1
const STORE = 'recordings'

const memory = new Map()
let dbPromise = null

function hasIDB() {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null
  } catch {
    return false
  }
}

function openDB() {
  if (!hasIDB()) return Promise.resolve(null)
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve) => {
    let req
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION)
    } catch {
      resolve(null)
      return
    }
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(null)
  })
  return dbPromise
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE)
}

function wrap(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Canonical key for a recording slot, e.g. keyFor(3, 'record') -> "d3:record". */
export function keyFor(day, slot) {
  return `d${day}:${slot}`
}

export async function putRecording(key, blob, meta = {}) {
  const record = { key, blob, meta, savedAt: Date.now() }
  const db = await openDB()
  if (!db) {
    memory.set(key, record)
    return record
  }
  await wrap(tx(db, 'readwrite').put(record))
  return record
}

export async function getRecording(key) {
  const db = await openDB()
  if (!db) return memory.get(key) || null
  const rec = await wrap(tx(db, 'readonly').get(key))
  return rec || null
}

export async function deleteRecording(key) {
  const db = await openDB()
  if (!db) {
    memory.delete(key)
    return
  }
  await wrap(tx(db, 'readwrite').delete(key))
}

export async function listRecordings() {
  const db = await openDB()
  if (!db) return [...memory.values()]
  const all = await wrap(tx(db, 'readonly').getAll())
  return all || []
}

export async function clearRecordings() {
  memory.clear()
  const db = await openDB()
  if (!db) return
  await wrap(tx(db, 'readwrite').clear())
}

/** Object URL for playback, revoking any previous one is the caller's job. */
export function urlFor(blob) {
  try {
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

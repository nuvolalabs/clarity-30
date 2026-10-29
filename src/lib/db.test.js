import { describe, it, expect, beforeEach } from 'vitest'
import { clearRecordings, deleteRecording, getRecording, keyFor, listRecordings, putRecording, urlFor } from './db.js'

// Node has no IndexedDB, so these exercise the in-memory fallback path — which is
// exactly the behaviour we want to be safe when IndexedDB is unavailable.
describe('recording store (memory fallback)', () => {
  beforeEach(async () => {
    await clearRecordings()
  })

  it('builds canonical keys', () => {
    expect(keyFor(1, 'record')).toBe('d1:record')
    expect(keyFor(30, 'retry')).toBe('d30:retry')
  })

  it('stores and retrieves a recording with metadata', async () => {
    const blob = new Blob(['fake-audio'], { type: 'audio/webm' })
    await putRecording(keyFor(1, 'record'), blob, { transcript: 'hello', durationSec: 3 })
    const rec = await getRecording(keyFor(1, 'record'))
    expect(rec).toBeTruthy()
    expect(rec.meta.transcript).toBe('hello')
    expect(rec.meta.durationSec).toBe(3)
  })

  it('returns null for a missing key', async () => {
    expect(await getRecording(keyFor(9, 'record'))).toBeNull()
  })

  it('lists and deletes recordings', async () => {
    await putRecording(keyFor(1, 'record'), new Blob(['a']), {})
    await putRecording(keyFor(15, 'record'), new Blob(['b']), {})
    expect((await listRecordings()).length).toBe(2)
    await deleteRecording(keyFor(1, 'record'))
    expect((await listRecordings()).length).toBe(1)
  })

  it('urlFor never throws when object URLs are unavailable', () => {
    expect(() => urlFor(new Blob(['x']))).not.toThrow()
  })
})

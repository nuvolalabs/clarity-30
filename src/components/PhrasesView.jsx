import { useState } from 'react'
import { SWAP_CATEGORIES, SWAPS, swapsByCategory } from '../lib/phrasing.js'
import SwapList from './SwapList.jsx'

export default function PhrasesView() {
  const [cat, setCat] = useState('all')
  const swaps = cat === 'all' ? SWAPS : swapsByCategory(cat)
  const active = cat === 'all' ? null : SWAP_CATEGORIES.find((c) => c.id === cat)

  return (
    <div className="phrases">
      <h2>Say it with authority</h2>
      <p className="muted">
        Same message, more authority. Read the weak version, then say the strong one out loud
        twice — out loud matters.
      </p>

      <div className="chips">
        <button className={cat === 'all' ? 'chip active' : 'chip'} onClick={() => setCat('all')}>
          All ({SWAPS.length})
        </button>
        {SWAP_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={cat === c.id ? 'chip active' : 'chip'}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {active && <p className="muted small">{active.blurb}</p>}
      <p className="muted small">{swaps.length} swap{swaps.length === 1 ? '' : 's'}</p>

      <SwapList swaps={swaps} />
    </div>
  )
}

export function SwapCard({ swap, showWhy = true }) {
  return (
    <div className="swap">
      <div className="swap-line">
        <span className="swap-tag weak">Instead of</span>
        <span className="swap-weak">“{swap.weak}”</span>
      </div>
      <div className="swap-line">
        <span className="swap-tag strong">Say</span>
        <span className="swap-strong">“{swap.strong}”</span>
      </div>
      {showWhy && <p className="muted small swap-why">{swap.why}</p>}
    </div>
  )
}

export default function SwapList({ swaps, title, showWhy = true }) {
  if (!swaps || !swaps.length) return null
  return (
    <div className="swap-list">
      {title && <div className="card-title">{title}</div>}
      {swaps.map((s) => (
        <SwapCard key={s.id} swap={s} showWhy={showWhy} />
      ))}
    </div>
  )
}

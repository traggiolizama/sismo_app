export type DayRange = 7 | 30 | 90

interface FilterPanelProps {
  days: DayRange
  minMagnitude: number
  onDaysChange: (days: DayRange) => void
  onMinMagnitudeChange: (magnitude: number) => void
}

const dayOptions = [7, 30, 90] as const

export function FilterPanel({
  days,
  minMagnitude,
  onDaysChange,
  onMinMagnitudeChange,
}: FilterPanelProps) {
  return (
    <section className="filter-panel" aria-label="Filtros de sismos">
      <div className="filter-group">
        <span className="filter-label" id="period-label">Período</span>
        <div className="period-options" role="group" aria-labelledby="period-label">
          {dayOptions.map((option) => (
            <button
              key={option}
              type="button"
              className="period-option"
              aria-pressed={days === option}
              onClick={() => onDaysChange(option)}
            >
              {option} días
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group magnitude-filter">
        <label className="filter-label" htmlFor="min-magnitude">
          Magnitud mínima <strong>{minMagnitude.toFixed(1)}</strong>
        </label>
        <input
          id="min-magnitude"
          type="range"
          min="3"
          max="7"
          step="0.1"
          value={minMagnitude}
          onChange={(event) => onMinMagnitudeChange(Number(event.target.value))}
        />
        <div className="range-limits" aria-hidden="true">
          <span>M 3.0</span>
          <span>M 7.0</span>
        </div>
      </div>
    </section>
  )
}

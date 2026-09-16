import { useEffect, useState } from 'react'

export type DayRange = 7 | 30 | 90

interface FilterPanelProps {
  days: DayRange
  minMagnitude: number
  lastUpdated: number | null
  updating: boolean
  onDaysChange: (days: DayRange) => void
  onMinMagnitudeChange: (magnitude: number) => void
  onRefresh: () => void
}

const dayOptions = [7, 30, 90] as const

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`

  const hours = Math.floor(minutes / 60)
  return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
}

export function FilterPanel({
  days,
  minMagnitude,
  lastUpdated,
  updating,
  onDaysChange,
  onMinMagnitudeChange,
  onRefresh,
}: FilterPanelProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1_000)
    return () => window.clearInterval(interval)
  }, [])

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

      <div className="filter-update">
        <span className="filter-label">Datos de USGS</span>
        <span className="last-updated">
          {lastUpdated === null ? (
            'Esperando primera actualización'
          ) : (
            <>
              Última actualización:{' '}
              <time dateTime={new Date(lastUpdated).toISOString()} title={new Date(lastUpdated).toLocaleString('es-CL')}>
                {formatElapsed(Math.max(0, Math.floor((now - lastUpdated) / 1_000)))}
              </time>
            </>
          )}
        </span>
        <button className="refresh-button" type="button" disabled={updating} onClick={onRefresh}>
          {updating ? 'Actualizando…' : 'Actualizar ahora'}
        </button>
      </div>
    </section>
  )
}

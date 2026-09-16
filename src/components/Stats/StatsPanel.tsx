import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DayRange } from '../Filters/FilterPanel'
import type { Earthquake } from '../../types/earthquake'

interface StatsPanelProps {
  earthquakes: Earthquake[]
  days: DayRange
}

const dayLabelFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
})

const recentDateFormatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const magnitudeLabels = ['3.0–3.9', '4.0–4.9', '5.0–5.9', '6.0–6.9', '7.0+']

function getLocalDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function StatsPanel({ earthquakes, days }: StatsPanelProps) {
  const { dailyCounts, magnitudeCounts, maxMagnitude, latest } = useMemo(() => {
    const countsByDay = new Map<string, number>()
    const magnitudeTotals = magnitudeLabels.map((label) => ({ label, count: 0 }))
    let maximum: number | null = null
    let mostRecent: Earthquake | null = null

    for (const earthquake of earthquakes) {
      const key = getLocalDayKey(new Date(earthquake.time))
      countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1)

      const bucket = Math.min(Math.max(Math.floor(earthquake.mag) - 3, 0), 4)
      magnitudeTotals[bucket].count += 1

      if (maximum === null || earthquake.mag > maximum) {
        maximum = earthquake.mag
      }

      if (mostRecent === null || earthquake.time > mostRecent.time) {
        mostRecent = earthquake
      }
    }

    // El filtro usa una ventana móvil; el primer día del gráfico puede ser parcial.
    const today = new Date()
    const firstDay = new Date(today.getTime() - days * 24 * 60 * 60 * 1000)
    firstDay.setHours(0, 0, 0, 0)

    const dailyTotals: Array<{ date: string; label: string; count: number }> = []

    for (const date = new Date(firstDay); date <= today; date.setDate(date.getDate() + 1)) {
      const key = getLocalDayKey(date)
      dailyTotals.push({
        date: key,
        label: dayLabelFormatter.format(date),
        count: countsByDay.get(key) ?? 0,
      })
    }

    return {
      dailyCounts: dailyTotals,
      magnitudeCounts: magnitudeTotals,
      maxMagnitude: maximum,
      latest: mostRecent,
    }
  }, [earthquakes, days])

  return (
    <div className="stats-panel">
      <div className="stats-summary">
        <div className="stats-metric">
          <span>Total de sismos</span>
          <strong>{earthquakes.length}</strong>
          <small>En el período filtrado</small>
        </div>
        <div className="stats-metric">
          <span>Magnitud máxima</span>
          <strong>{maxMagnitude === null ? '—' : maxMagnitude.toFixed(1)}</strong>
          <small>{maxMagnitude === null ? 'Sin registros' : 'Escala de magnitud'}</small>
        </div>
        <div className="stats-metric stats-metric-recent">
          <span>Sismo más reciente</span>
          {latest ? (
            <>
              <strong>{latest.place}</strong>
              <time dateTime={new Date(latest.time).toISOString()}>
                {recentDateFormatter.format(latest.time)}
              </time>
            </>
          ) : (
            <strong>Sin sismos para estos filtros</strong>
          )}
        </div>
      </div>

      <section className="stats-chart-section" aria-labelledby="daily-chart-title">
        <div className="stats-chart-heading">
          <h3 id="daily-chart-title">Actividad por día</h3>
          <p>Cantidad de sismos según la fecha local</p>
        </div>
        <div className="stats-chart-scroller">
          <div
            className="stats-daily-chart"
            style={{ width: `${Math.max(280, dailyCounts.length * 24)}px` }}
          >
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={dailyCounts} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e5ecee" />
                <XAxis
                  dataKey="label"
                  interval={days === 7 ? 0 : days === 30 ? 4 : 9}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#667780', fontSize: 10 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#667780', fontSize: 10 }}
                />
                <Tooltip cursor={{ fill: '#edf4f5' }} />
                <Bar dataKey="count" name="Sismos" fill="#266b79" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {days !== 7 && <p className="chart-scroll-hint">Desliza el gráfico para ver más días →</p>}
      </section>

      <section className="stats-chart-section" aria-labelledby="magnitude-chart-title">
        <div className="stats-chart-heading">
          <h3 id="magnitude-chart-title">Distribución de magnitudes</h3>
          <p>Eventos agrupados en intervalos de una unidad</p>
        </div>
        <div className="stats-magnitude-chart">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={magnitudeCounts} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e5ecee" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#667780', fontSize: 9 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#667780', fontSize: 10 }}
              />
              <Tooltip cursor={{ fill: '#edf4f5' }} />
              <Bar dataKey="count" name="Sismos" fill="#c06f3a" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

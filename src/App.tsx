import { useMemo, useState } from 'react'
import type { EarthquakeQueryParams } from './api/earthquakes'
import { FilterPanel, type DayRange } from './components/Filters/FilterPanel'
import { TabPanel, type TabDefinition } from './components/Layout/TabPanel'
import { EarthquakeMap } from './components/Map/EarthquakeMap'
import { EarthquakeTable } from './components/Table/EarthquakeTable'
import { useEarthquakes } from './hooks/useEarthquakes'
import './App.css'

function formatApiDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function createInitialQuery(): EarthquakeQueryParams {
  const startDate = new Date()
  const endDate = new Date()

  // Consultamos la ventana más amplia una vez; los filtros se aplican en memoria.
  startDate.setDate(startDate.getDate() - 90)
  endDate.setDate(endDate.getDate() + 1)

  return {
    startTime: formatApiDate(startDate),
    endTime: formatApiDate(endDate),
    minMagnitude: 3,
    minLatitude: -56,
    maxLatitude: -17,
    minLongitude: -76,
    maxLongitude: -66,
  }
}

const initialQuery = createInitialQuery()

function App() {
  const [days, setDays] = useState<DayRange>(30)
  const [minMagnitude, setMinMagnitude] = useState(3)
  const { data, loading, error } = useEarthquakes(initialQuery)
  const filteredEarthquakes = useMemo(() => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

    return data.filter(
      (earthquake) =>
        earthquake.time >= cutoff && earthquake.mag >= minMagnitude,
    )
  }, [data, days, minMagnitude])

  const tabs: TabDefinition[] = [
    {
      id: 'list',
      label: 'Lista',
      content: loading ? (
        <div className="list-skeleton" aria-label="Cargando lista">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      ) : (
        <EarthquakeTable earthquakes={filteredEarthquakes} />
      ),
    },
    {
      id: 'stats',
      label: 'Estadísticas',
      content: (
        <div className="stats-placeholder">
          <div className="placeholder-visual" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <h3>Una mirada a los datos</h3>
          <p>
            Los gráficos de actividad diaria y distribución de magnitudes se
            incorporarán en la Fase 4.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M3 18h5l3-8 5 14 4-10 3 4h6" />
            </svg>
          </span>
          <div>
            <strong>Sismo Chile</strong>
            <span>Monitoreo territorial</span>
          </div>
        </div>

        <a
          className="source-link"
          href="https://earthquake.usgs.gov/"
          target="_blank"
          rel="noreferrer"
        >
          Fuente USGS
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main className="dashboard">
        <section className="dashboard-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Actividad sísmica reciente</p>
            <h1 id="page-title">Chile en movimiento</h1>
            <p className="intro-copy">
              Explora los eventos de magnitud {minMagnitude.toFixed(1)} o superior
              registrados durante los últimos {days} días.
            </p>
          </div>

          <div className={`data-status ${error ? 'data-status-error' : ''}`}>
            <span className="status-dot" aria-hidden="true" />
            {loading
              ? 'Consultando USGS'
              : error
                ? 'Datos no disponibles'
                : `${filteredEarthquakes.length} eventos encontrados`}
          </div>
        </section>

        <FilterPanel
          days={days}
          minMagnitude={minMagnitude}
          onDaysChange={setDays}
          onMinMagnitudeChange={setMinMagnitude}
        />

        {error ? (
          <section className="error-state" role="alert">
            <span className="error-icon" aria-hidden="true">!</span>
            <div>
              <h2>No pudimos cargar la actividad sísmica</h2>
              <p>{error}. Comprueba tu conexión e intenta recargar la página.</p>
            </div>
          </section>
        ) : (
          <div className="dashboard-grid">
            <section className="map-card" aria-labelledby="map-title">
              <div className="card-heading">
                <div>
                  <p className="card-kicker">Vista geográfica</p>
                  <h2 id="map-title">Mapa de actividad</h2>
                </div>
                <span className="period-chip">Últimos {days} días</span>
              </div>

              <div className="map-stage">
                <EarthquakeMap earthquakes={filteredEarthquakes} />
                {loading && (
                  <div className="map-loading" role="status">
                    <span className="loading-spinner" aria-hidden="true" />
                    Cargando eventos…
                  </div>
                )}
              </div>
            </section>

            <aside className="side-panel" aria-label="Detalle de actividad sísmica">
              <div className="side-panel-heading">
                <div>
                  <p className="card-kicker">Explorar datos</p>
                  <h2>Actividad reciente</h2>
                </div>
                {!loading && (
                  <span className="count-badge">{filteredEarthquakes.length}</span>
                )}
              </div>
              <TabPanel tabs={tabs} />
            </aside>
          </div>
        )}
      </main>

      <footer>
        Datos públicos de USGS Earthquake Hazards Program · Chile continental
      </footer>
    </div>
  )
}

export default App

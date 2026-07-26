import type { EarthquakeQueryParams } from './api/earthquakes'
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
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 30)

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
  const { data, loading, error } = useEarthquakes(initialQuery)

  return (
    <main>
      <header>
        <h1>Sismos recientes en Chile</h1>
        <p>
          Eventos de magnitud 3.0 o superior registrados durante los últimos 30
          días.
        </p>
      </header>

      {loading && <p role="status">Cargando sismos...</p>}

      {error && (
        <p role="alert">
          No se pudieron cargar los datos: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p className="results-summary">
            {data.length} sismos encontrados
          </p>
          <EarthquakeTable earthquakes={data} />
        </>
      )}
    </main>
  )
}

export default App

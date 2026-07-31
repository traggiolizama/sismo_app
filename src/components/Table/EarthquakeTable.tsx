import type { Earthquake } from '../../types/earthquake'

interface EarthquakeTableProps {
  earthquakes: Earthquake[]
}

const localDateFormatter = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function getMagnitudeClass(magnitude: number): string {
  if (magnitude >= 5) {
    return 'magnitude-high'
  }

  if (magnitude >= 4) {
    return 'magnitude-medium'
  }

  return 'magnitude-low'
}

export function EarthquakeTable({
  earthquakes,
}: EarthquakeTableProps) {
  if (earthquakes.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron sismos para el período seleccionado.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col">Mag.</th>
            <th scope="col">Lugar</th>
            <th scope="col">Fecha local</th>
          </tr>
        </thead>
        <tbody>
          {earthquakes.map((earthquake) => {
            const date = new Date(earthquake.time)

            return (
              <tr key={earthquake.id}>
                <td>
                  <span className={`magnitude-badge ${getMagnitudeClass(earthquake.mag)}`}>
                    {earthquake.mag.toFixed(1)}
                  </span>
                </td>
                <td>
                  <a
                    className="place-link"
                    href={earthquake.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {earthquake.place}
                  </a>
                </td>
                <td>
                  <time dateTime={date.toISOString()}>
                    {localDateFormatter.format(date)}
                  </time>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

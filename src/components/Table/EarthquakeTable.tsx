import type { Earthquake } from '../../types/earthquake'

interface EarthquakeTableProps {
  earthquakes: Earthquake[]
}

const localDateFormatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function EarthquakeTable({
  earthquakes,
}: EarthquakeTableProps) {
  if (earthquakes.length === 0) {
    return <p>No se encontraron sismos para el período seleccionado.</p>
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col">Magnitud</th>
            <th scope="col">Lugar</th>
            <th scope="col">Fecha local</th>
          </tr>
        </thead>
        <tbody>
          {earthquakes.map((earthquake) => {
            const date = new Date(earthquake.time)

            return (
              <tr key={earthquake.id}>
                <td>{earthquake.mag.toFixed(1)}</td>
                <td>{earthquake.place}</td>
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

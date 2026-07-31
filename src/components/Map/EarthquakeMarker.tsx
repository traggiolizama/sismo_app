import { CircleMarker, Popup, Tooltip } from 'react-leaflet'
import type { Earthquake } from '../../types/earthquake'

interface EarthquakeMarkerProps {
  earthquake: Earthquake
}

const popupDateFormatter = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function getMarkerAppearance(magnitude: number) {
  if (magnitude >= 5) {
    return { color: '#a23b59', radius: Math.min(16, 10 + magnitude) }
  }

  if (magnitude >= 4) {
    return { color: '#c06f3a', radius: Math.min(14, 7 + magnitude) }
  }

  return { color: '#2f6f89', radius: Math.min(11, 5 + magnitude) }
}

export function EarthquakeMarker({ earthquake }: EarthquakeMarkerProps) {
  const { latitude, longitude, depth } = earthquake.coordinates
  const appearance = getMarkerAppearance(earthquake.mag)
  const date = new Date(earthquake.time)

  return (
    <CircleMarker
      center={[latitude, longitude]}
      radius={appearance.radius}
      pathOptions={{
        color: '#ffffff',
        weight: 2,
        fillColor: appearance.color,
        fillOpacity: 0.88,
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
        <strong>M {earthquake.mag.toFixed(1)}</strong> · {earthquake.place}
      </Tooltip>

      <Popup>
        <article className="earthquake-popup">
          <div className="popup-heading">
            <span
              className="popup-magnitude"
              style={{ backgroundColor: appearance.color }}
            >
              M {earthquake.mag.toFixed(1)}
            </span>
            <span>{earthquake.tsunami === 1 ? 'Alerta de tsunami' : 'Evento sísmico'}</span>
          </div>
          <h3>{earthquake.place}</h3>
          <dl>
            <div>
              <dt>Profundidad</dt>
              <dd>{depth.toFixed(1)} km</dd>
            </div>
            <div>
              <dt>Fecha local</dt>
              <dd>
                <time dateTime={date.toISOString()}>
                  {popupDateFormatter.format(date)}
                </time>
              </dd>
            </div>
          </dl>
          <a href={earthquake.url} target="_blank" rel="noreferrer">
            Ver ficha oficial en USGS
          </a>
        </article>
      </Popup>
    </CircleMarker>
  )
}

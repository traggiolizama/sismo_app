import { MapContainer, TileLayer } from 'react-leaflet'
import type { Earthquake } from '../../types/earthquake'
import { EarthquakeMarker } from './EarthquakeMarker'

interface EarthquakeMapProps {
  earthquakes: Earthquake[]
}

const CHILE_CENTER: [number, number] = [-33, -71]

export function EarthquakeMap({ earthquakes }: EarthquakeMapProps) {
  return (
    <div className="earthquake-map">
      <MapContainer
        center={CHILE_CENTER}
        zoom={4}
        minZoom={3}
        scrollWheelZoom
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {earthquakes.map((earthquake) => (
          <EarthquakeMarker key={earthquake.id} earthquake={earthquake} />
        ))}
      </MapContainer>

      <div className="map-legend" aria-label="Leyenda de magnitudes">
        <span className="legend-title">Magnitud</span>
        <span><i className="legend-dot legend-low" />3.0–3.9</span>
        <span><i className="legend-dot legend-medium" />4.0–4.9</span>
        <span><i className="legend-dot legend-high" />5.0+</span>
      </div>
    </div>
  )
}

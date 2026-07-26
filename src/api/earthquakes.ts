import type { Earthquake } from '../types/earthquake'

const USGS_ENDPOINT = 'https://earthquake.usgs.gov/fdsnws/event/1/query'

export interface EarthquakeQueryParams {
  startTime: string
  endTime: string
  minMagnitude: number
  minLatitude: number
  maxLatitude: number
  minLongitude: number
  maxLongitude: number
  signal?: AbortSignal
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function mapFeature(feature: unknown): Earthquake | null {
  if (!isRecord(feature) || typeof feature.id !== 'string') {
    return null
  }

  const properties = feature.properties
  const geometry = feature.geometry

  if (!isRecord(properties) || !isRecord(geometry)) {
    return null
  }

  const coordinates = geometry.coordinates

  if (
    typeof properties.mag !== 'number' ||
    typeof properties.time !== 'number' ||
    typeof properties.url !== 'string' ||
    typeof properties.tsunami !== 'number' ||
    !Array.isArray(coordinates) ||
    coordinates.length < 3 ||
    !coordinates.slice(0, 3).every((coordinate) => typeof coordinate === 'number')
  ) {
    return null
  }

  const [longitude, latitude, depth] = coordinates

  return {
    id: feature.id,
    mag: properties.mag,
    place:
      typeof properties.place === 'string'
        ? properties.place
        : 'Ubicación desconocida',
    time: properties.time,
    url: properties.url,
    tsunami: properties.tsunami,
    coordinates: {
      longitude,
      latitude,
      depth,
    },
  }
}

export async function fetchEarthquakes({
  startTime,
  endTime,
  minMagnitude,
  minLatitude,
  maxLatitude,
  minLongitude,
  maxLongitude,
  signal,
}: EarthquakeQueryParams): Promise<Earthquake[]> {
  const searchParams = new URLSearchParams({
    format: 'geojson',
    starttime: startTime,
    endtime: endTime,
    minmagnitude: String(minMagnitude),
    minlatitude: String(minLatitude),
    maxlatitude: String(maxLatitude),
    minlongitude: String(minLongitude),
    maxlongitude: String(maxLongitude),
    orderby: 'time',
  })

  const response = await fetch(`${USGS_ENDPOINT}?${searchParams}`, { signal })

  if (!response.ok) {
    throw new Error(`USGS respondió con el estado ${response.status}`)
  }

  const payload: unknown = await response.json()

  if (!isRecord(payload) || !Array.isArray(payload.features)) {
    throw new Error('USGS devolvió una respuesta con un formato inesperado')
  }

  return payload.features
    .map(mapFeature)
    .filter((earthquake): earthquake is Earthquake => earthquake !== null)
}

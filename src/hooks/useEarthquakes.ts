import { useEffect, useState } from 'react'
import {
  fetchEarthquakes,
  type EarthquakeQueryParams,
} from '../api/earthquakes'
import type { Earthquake } from '../types/earthquake'

interface UseEarthquakesResult {
  data: Earthquake[]
  loading: boolean
  error: string | null
}

export function useEarthquakes(
  params: EarthquakeQueryParams,
): UseEarthquakesResult {
  const {
    startTime,
    endTime,
    minMagnitude,
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude,
  } = params
  const [data, setData] = useState<Earthquake[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadEarthquakes() {
      setLoading(true)
      setError(null)

      try {
        const earthquakes = await fetchEarthquakes({
          startTime,
          endTime,
          minMagnitude,
          minLatitude,
          maxLatitude,
          minLongitude,
          maxLongitude,
          signal: controller.signal,
        })

        setData(earthquakes)
      } catch (requestError: unknown) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudieron cargar los sismos',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadEarthquakes()

    return () => {
      controller.abort()
    }
  }, [
    endTime,
    maxLatitude,
    maxLongitude,
    minLatitude,
    minLongitude,
    minMagnitude,
    startTime,
  ])

  return { data, loading, error }
}

import { useEffect, useRef, useState } from 'react'
import {
  fetchEarthquakes,
  type EarthquakeQueryParams,
} from '../api/earthquakes'
import type { Earthquake } from '../types/earthquake'

interface UseEarthquakesResult {
  data: Earthquake[]
  loading: boolean
  refreshing: boolean
  error: string | null
  lastUpdated: number | null
  refresh: () => void
}

export function useEarthquakes(
  getParams: () => EarthquakeQueryParams,
): UseEarthquakesResult {
  const [data, setData] = useState<Earthquake[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [retryToken, setRetryToken] = useState(0)
  const lastUpdatedRef = useRef<number | null>(null)

  useEffect(() => {
    let active = true
    let inFlight = false
    let lastAttemptAt = 0
    const controller = new AbortController()

    async function loadEarthquakes() {
      if (inFlight) return

      inFlight = true
      lastAttemptAt = Date.now()
      if (lastUpdatedRef.current === null) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      setError(null)

      try {
        const earthquakes = await fetchEarthquakes({
          // Recalculamos las fechas en cada consulta, incluso al cruzar medianoche.
          ...getParams(),
          signal: controller.signal,
        })

        if (!active) return
        setData(earthquakes)
        const updatedAt = Date.now()
        lastUpdatedRef.current = updatedAt
        setLastUpdated(updatedAt)
      } catch (requestError: unknown) {
        if (!active) return
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return
        }

        if (requestError instanceof TypeError) {
          setError('No se pudo conectar con USGS')
        } else if (requestError instanceof Error) {
          setError(requestError.message)
        } else {
          setError('No se pudieron cargar los sismos')
        }
      } finally {
        inFlight = false
        if (active) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    }

    void loadEarthquakes()
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'hidden') void loadEarthquakes()
    }, 90_000)

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && Date.now() - lastAttemptAt >= 90_000) {
        void loadEarthquakes()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      active = false
      controller.abort()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [getParams, retryToken])

  return {
    data,
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh: () => setRetryToken((token) => token + 1),
  }
}

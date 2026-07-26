export interface Earthquake {
  id: string
  mag: number
  place: string
  time: number
  url: string
  tsunami: number
  coordinates: {
    longitude: number
    latitude: number
    depth: number
  }
}

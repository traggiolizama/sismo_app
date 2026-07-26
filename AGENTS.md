# AGENTS.md

Este archivo es leído automáticamente por Codex (y otros agentes compatibles) al iniciar cualquier tarea en este repositorio. Contiene las reglas fijas del proyecto. Para el backlog de features y su orden de implementación, ver `ROADMAP.md`.

## Sobre el proyecto

Dashboard web de sismicidad en Chile: mapa interactivo con los sismos recientes del país, filtros por fecha/magnitud y un panel de estadísticas básicas. Es un proyecto de portafolio personal (primer proyecto autónomo del autor, aprendiendo desarrollo web).

## Stack tecnológico (no cambiar sin que el autor lo apruebe)

- **Frontend:** React + TypeScript + Vite
- **Mapa:** `react-leaflet` (Leaflet.js) — no usar Google Maps ni Mapbox, no requieren API key
- **Gráficos:** Recharts
- **Sin backend en el MVP:** el frontend consume directamente el API público de USGS
- **Gestor de paquetes:** npm
- **Deploy objetivo:** Vercel

## Fuente de datos

API pública de USGS Earthquake Hazards Program. Formato GeoJSON, sin API key.

```
Endpoint: https://earthquake.usgs.gov/fdsnws/event/1/query
```

Parámetros relevantes:
- `format=geojson`
- `starttime`, `endtime` (formato `YYYY-MM-DD`)
- `minmagnitude`
- `minlatitude`, `maxlatitude`, `minlongitude`, `maxlongitude` (bounding box)
- `orderby=time`

Bounding box para Chile continental:
```
minlatitude=-56&maxlatitude=-17&minlongitude=-76&maxlongitude=-66
```

Ejemplo de request completo:
```
https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2026-06-25&endtime=2026-07-25&minlatitude=-56&maxlatitude=-17&minlongitude=-76&maxlongitude=-66&minmagnitude=3&orderby=time
```

### Modelo de datos (simplificado desde el GeoJSON de USGS)

```typescript
export interface Earthquake {
  id: string;
  mag: number;          // magnitud
  place: string;        // descripción del lugar, viene en inglés desde el API
  time: number;         // timestamp en milisegundos (Date.now() format)
  url: string;          // link a la ficha oficial del evento
  tsunami: number;      // 0 o 1
  coordinates: {
    longitude: number;
    latitude: number;
    depth: number;      // profundidad en km
  };
}
```
Cada feature del GeoJSON trae `geometry.coordinates` como `[longitude, latitude, depth]` — ojo con el orden, no es `[lat, lon]`.

## Estructura de carpetas

```
src/
  api/
    earthquakes.ts        # fetch al API de USGS, mapeo a Earthquake[]
  components/
    Map/
      EarthquakeMap.tsx
      EarthquakeMarker.tsx
    Filters/
      FilterPanel.tsx
    Stats/
      StatsPanel.tsx
    Table/
      EarthquakeTable.tsx
  hooks/
    useEarthquakes.ts      # maneja fetch, loading, error, filtros
  types/
    earthquake.ts
  App.tsx
  main.tsx
```

## Convenciones de código

- Componentes funcionales con hooks, sin clases
- TypeScript estricto (evitar `any`)
- Un componente por archivo, nombre de archivo en PascalCase igual al componente
- Nombres de variables y funciones en inglés (estándar de la industria); comentarios en español está bien, el autor está aprendiendo y prefiere entender el código en su idioma
- Manejar siempre estado de `loading` y `error` en cualquier componente que haga fetch — nunca asumir que el fetch fue exitoso

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Cómo buildear

```bash
npm run build
```

## Reglas de seguridad para el agente

- Nunca borrar, sobrescribir ni mover `AGENTS.md` o `ROADMAP.md` sin que el autor lo pida explícitamente.
- Si un comando interactivo (ej. `npm create vite@latest`) pregunta si eliminar archivos existentes porque la carpeta no está vacía, elegir siempre la opción que preserve los archivos existentes (ej. "Ignore files and continue"), nunca la que los borra.
- Hacer `git commit` normalmente al terminar cada tarea, pero **no hacer `git push` automáticamente** — dejar los commits listos localmente y esperar que el autor revise y suba los cambios, al menos mientras se gana confianza con el flujo. Esta regla se puede eliminar más adelante si el autor lo indica.

## Qué NO hacer todavía (fuera de alcance del MVP)

- No agregar backend ni base de datos propia
- No integrar datos del CSN chileno (es solo scraping, no hay API limpia — queda para v2 si se decide)
- No agregar autenticación de usuarios
- No implementar modo oscuro, animaciones avanzadas ni PWA
- No agregar librerías de UI pesadas (Material UI, Ant Design, etc.) — mantenerlo simple con CSS propio o Tailwind si el autor lo pide explícitamente

Si una tarea del `ROADMAP.md` no está clara o requiere tomar una decisión de diseño no especificada aquí, preferir la opción más simple y dejar un comentario `// TODO:` explicando la decisión, en vez de sobre-construir.

## Checklist antes de dar por terminada una fase

- [ ] `npm run build` compila sin errores
- [ ] No hay errores en la consola del navegador al usar la app
- [ ] El componente maneja estado de carga y de error
- [ ] Commit con mensaje descriptivo (`feat: `, `fix: `, `chore: ` como prefijo)

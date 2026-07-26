# Roadmap de desarrollo — Dashboard de Sismicidad en Chile

Backlog en orden. No saltarse fases: cada una debe cumplir su criterio de aceptación antes de avanzar a la siguiente. Ver `AGENTS.md` para stack, convenciones y qué está fuera de alcance.

---

## Fase 0 — Setup inicial

- [ ] Crear proyecto: `npm create vite@latest . -- --template react-ts`
  - ⚠️ La carpeta ya contiene `AGENTS.md` y `ROADMAP.md`, así que la terminal preguntará qué hacer porque no está vacía. **Elegir "Ignore files and continue"**. Nunca elegir "Remove existing files" — esa opción borraría este mismo roadmap y el archivo de contexto.
- [ ] Instalar dependencias: `npm install react-leaflet leaflet recharts`
- [ ] Instalar tipos si hace falta: `npm install -D @types/leaflet`
- [ ] Crear la estructura de carpetas definida en `AGENTS.md`
- [ ] Commit inicial: `chore: initial project setup`

**Criterio de aceptación:** `npm run dev` levanta la app y muestra la pantalla default de Vite sin errores en consola.

---

## Fase 1 — Obtener y mostrar datos crudos

**Historia de usuario:** Como usuario, quiero ver una lista de los sismos recientes en Chile para confirmar que los datos se están obteniendo correctamente.

Tareas:
- [ ] Crear `types/earthquake.ts` con la interfaz `Earthquake` (ver `AGENTS.md`)
- [ ] Crear `api/earthquakes.ts` con una función `fetchEarthquakes(params)` que llame al endpoint de USGS y mapee la respuesta GeoJSON a `Earthquake[]`
- [ ] Crear `hooks/useEarthquakes.ts` que use esa función y exponga `{ data, loading, error }`
- [ ] Crear `components/Table/EarthquakeTable.tsx` que reciba `Earthquake[]` y muestre una tabla simple (magnitud, lugar, fecha) sin estilos aún
- [ ] Usar `useEarthquakes` en `App.tsx` pidiendo los últimos 30 días con el bounding box de Chile

**Criterio de aceptación:** al cargar la página se ve una tabla con los sismos de Chile de los últimos 30 días, con magnitud, lugar y fecha legible (convertir el timestamp a fecha local).

---

## Fase 2 — Mapa interactivo

**Historia de usuario:** Como usuario, quiero ver los sismos en un mapa para entender su distribución geográfica.

Tareas:
- [ ] Crear `components/Map/EarthquakeMap.tsx` con un `MapContainer` de react-leaflet centrado en Chile (lat ~ -33, lon ~ -71, zoom inicial que muestre todo el país)
- [ ] Crear `components/Map/EarthquakeMarker.tsx`: un marcador por sismo
- [ ] El tamaño o color del marcador debe reflejar la magnitud, por ejemplo:
  - Magnitud < 4: verde
  - Magnitud 4–6: amarillo/naranjo
  - Magnitud > 6: rojo
- [ ] Al hacer clic en un marcador, mostrar un popup con magnitud, profundidad, lugar y fecha
- [ ] Reemplazar (o complementar) la tabla de la Fase 1 con el mapa en `App.tsx`

**Criterio de aceptación:** el mapa muestra todos los sismos cargados en las coordenadas correctas, con colores diferenciados por magnitud, y los popups muestran el detalle correcto al hacer clic.

---

## Fase 3 — Filtros

**Historia de usuario:** Como usuario, quiero filtrar los sismos por fecha y magnitud para enfocarme en lo que me interesa.

Tareas:
- [ ] Crear `components/Filters/FilterPanel.tsx` con:
  - Selector de rango: últimos 7 / 30 / 90 días
  - Input o slider de magnitud mínima
- [ ] Conectar los filtros al estado en `App.tsx` (puede ser re-fetch al API con nuevos parámetros, o filtrado en el cliente sobre los datos ya cargados — cualquiera de las dos es válida para el MVP)
- [ ] El mapa y la tabla deben reaccionar a los filtros sin recargar la página

**Criterio de aceptación:** cambiar cualquier filtro actualiza el mapa y la tabla inmediatamente, sin recargar la página ni romper el estado de loading/error.

---

## Fase 4 — Panel de estadísticas

**Historia de usuario:** Como usuario, quiero ver un resumen visual de la actividad sísmica reciente.

Tareas:
- [ ] Crear `components/Stats/StatsPanel.tsx`
- [ ] Gráfico de barras con Recharts: cantidad de sismos por día
- [ ] Gráfico de distribución de magnitudes (histograma simple)
- [ ] Card de resumen: total de sismos en el período filtrado, magnitud máxima, sismo más reciente (lugar + hora)

**Criterio de aceptación:** los gráficos y el resumen reflejan correctamente los datos que están filtrados actualmente en pantalla (deben cambiar junto con los filtros de la Fase 3).

---

## Fase 5 — Pulido y despliegue

Tareas:
- [ ] Diseño responsive: que se vea bien tanto en desktop como en mobile
- [ ] Estados de carga (spinner o skeleton) mientras se espera el fetch
- [ ] Manejo de errores de red visible para el usuario (ej: "No se pudieron cargar los datos, intenta de nuevo")
- [ ] Escribir `README.md` final del proyecto con: descripción, captura de pantalla, cómo correrlo localmente, decisiones técnicas tomadas, posibles mejoras futuras
- [ ] Deploy en Vercel
- [ ] Verificar en producción que los datos reales cargan correctamente (no solo en local)

**Criterio de aceptación:** el sitio está desplegado, accesible por URL pública, funciona en mobile y desktop, y el README explica el proyecto de forma clara para alguien que lo vea por primera vez (como un reclutador).

---

## Fuera de alcance por ahora (v2 — no implementar salvo pedido explícito)

- Comparación con promedio histórico de actividad sísmica
- Integración con datos del CSN chileno
- Backend propio + base de datos (para guardar histórico propio)
- Modo oscuro / animaciones avanzadas
- Alertas en tiempo real para sismos grandes

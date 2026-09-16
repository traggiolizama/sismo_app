# Sismo Chile

Dashboard interactivo para explorar la actividad sísmica reciente en Chile continental y su entorno. Consulta los eventos publicados por el [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/fdsnws/event/1/), los ubica en un mapa y muestra una lista y estadísticas que responden a los filtros de período y magnitud.

![Dashboard de Sismo Chile con mapa y lista de sismos](docs/dashboard.png)

[Ver captura en móvil](docs/mobile.png)

## Funcionalidades

- Mapa interactivo con marcadores por magnitud y detalle del evento al abrir cada marcador.
- Lista con magnitud, lugar y fecha legible en la zona horaria local del navegador; cada lugar enlaza a la ficha oficial de USGS.
- Filtros de 7, 30 o 90 días y magnitud mínima; mapa, lista y gráficos se actualizan juntos.
- Estadísticas del período filtrado: total, magnitud máxima, sismo más reciente, actividad diaria e histograma de magnitudes.
- Consulta automática cada 90 segundos, botón de actualización manual e indicador de la última consulta exitosa. Si la pestaña está oculta, se omiten consultas y se retoma al volver.
- Estado de carga y mensajes de error con opción de reintentar. Si falla una actualización posterior, se conservan los últimos datos recibidos y se advierte que pueden estar desactualizados.

## Ejecutar localmente

Necesitas [Node.js](https://nodejs.org/) compatible con Vite (20.19+ o 22.12+) y npm. En PowerShell, desde la carpeta del proyecto:

```powershell
node -v
npm -v
npm ci
npm run dev
```

Abre la dirección que muestre Vite, normalmente `http://localhost:5173/`. Detén el servidor con `Ctrl+C`. Si `node` no se reconoce, instala Node.js y **abre una terminal nueva** antes de repetir los comandos.

Para comprobar el código y probar la versión compilada:

```powershell
npm run lint
npm run build
npm run preview
```

El build crea `dist/`, que es el sitio estático que se publica; `src/` contiene el código fuente y `node_modules/` las dependencias instaladas. `dist/` y `node_modules/` no se suben a Git. No se necesitan claves de API ni variables de entorno para este MVP.

## Decisiones técnicas

- **React + TypeScript + Vite:** React organiza la interfaz en componentes y comparte el estado de filtros; TypeScript tipa los datos de USGS; Vite sirve la app durante el desarrollo y genera el build de producción.
- **USGS GeoJSON, sin backend:** `src/api/earthquakes.ts` consulta directamente el endpoint público, valida y transforma las coordenadas `[longitud, latitud, profundidad]` a un modelo `Earthquake`. `src/hooks/useEarthquakes.ts` administra carga, error, actualización y limpieza del temporizador.
- **Una consulta, varios filtros:** se obtienen hasta 90 días de datos desde magnitud 3.0 y el filtrado por 7/30/90 días y magnitud se realiza en el navegador para que las tres vistas respondan de inmediato. El intervalo de actualización es de 90 segundos; USGS puede almacenar respuestas en caché, así que esto no es una alerta en tiempo real.
- **Área aproximada, no frontera política:** la consulta usa un rectángulo entre latitudes -56 y -17 y longitudes -76 y -66. Por ello algunos eventos cercanos aparecen descritos por USGS como Argentina, Bolivia o Perú aunque están dentro del área consultada. No se incluyen todas las zonas insulares u oceánicas chilenas.
- **Mapa y gráficos:** react-leaflet con teselas de OpenStreetMap para el mapa; Recharts para los gráficos. Las fechas se presentan en la hora local del dispositivo del visitante.

Esta página sirve para explorar datos públicos, **no** como sistema de alerta temprana ni fuente para decisiones de emergencia. Para información oficial de Chile, consulta los organismos competentes.

## Publicar en Vercel

Cuando quieras publicar, primero sube tus commits a GitHub (en este proyecto, la rama es `main` y el remoto se llama `origin`):

```powershell
git status
git push -u origin main
```

Después inicia sesión en [Vercel](https://vercel.com/), elige **Add New → Project**, conecta GitHub si te lo pide e importa el repositorio `sismo_app`. Comprueba que la raíz sea el directorio principal, que el framework detectado sea **Vite**, que el comando de build sea `npm run build` y que la carpeta de salida sea `dist`. No agregues variables de entorno. Pulsa **Deploy**. Vercel mostrará una URL `*.vercel.app`; ábrela, revisa que mapa, lista, gráficos, filtros y actualización carguen datos reales, y pruébala también en el teléfono. Los siguientes pushes a `main` crearán nuevas versiones de producción automáticamente.

## Posibles mejoras

- Comparar la actividad con promedios históricos y ampliar la cobertura geográfica a zonas insulares.
- Evaluar una fuente oficial chilena si ofrece una API pública estable, con atribución y calidad de datos verificadas.
- Añadir pruebas automatizadas para el mapeo GeoJSON, la lógica de filtros y los errores de red.
- Mejorar accesibilidad del mapa para navegación por teclado y lectores de pantalla.

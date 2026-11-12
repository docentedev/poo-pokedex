# Pokédex de Cartas — Análisis técnico (HyperFrames)

Vídeo explicativo técnico de 45 segundos sobre el proyecto JavaFX de la raíz
(`cl.duoc.pokedex`), construido como composición **HyperFrames** pura
(HTML + CSS + GSAP sobre una línea de tiempo basada en frames).

| Especificación | Valor |
|---|---|
| Resolución | 1920 × 1080 (Full HD, 16:9) |
| FPS | 30 (`data-fps="30"`) |
| Duración | 45 s → **1350 frames** |
| Estilo | Dark mode minimal (`#0D1117`, bordes `#30363D`, acentos `#58A6FF` / `#3FB950`) |
| Tipografía | `Inter`/`system-ui` (títulos) · `JetBrains Mono`/`SF Mono` (código y etiquetas) |
| Audio | Sin pista — el vídeo se explica con títulos, etiquetas de flujo y lower-thirds |

## Escenas

| # | Frames | Tiempo | Contenido |
|---|---|---|---|
| 1 | 0 – 240 | 0.00 – 8.00 s | Nombre real del proyecto, propósito y *badges* del stack detectado en `pom.xml` |
| 2 | 241 – 630 | 8.03 – 21.00 s | Diagrama animado `Vista (.fxml) → Controlador → Repository → DAO → JSON` con pulsos de datos |
| 3 | 631 – 1080 | 21.03 – 36.00 s | `PokedexController.registrarCarta()` en un editor con enfoque por líneas y tarjetas explicativas |
| 4 | 1081 – 1350 | 36.03 – 45.00 s | Puntos fuertes + cierre con logo/título del proyecto |

## Estructura

```
video-hyperframes/
├── index.html     # composición: atributos de timing (data-start/data-duration) por clip
├── styles.css     # look & layout de las 4 escenas (1920×1080)
├── timeline.js    # una única línea de tiempo GSAP paused, registrada en window.__timelines.main
├── lib/gsap.min.js# GSAP 3.13 local (sin CDN → render determinista)
├── hyperframes.json
└── README.md
```

**Contrato HyperFrames respetado:** raíz con `data-composition-id`, `data-duration`,
`data-width/height` y `data-fps`; cada clip con `id`, `data-start`, `data-duration` y
`class="clip"`; GSAP con `{ paused: true }` registrado en `window.__timelines.main`
con la misma clave que `data-composition-id`; sin repeats infinitos ni estado de reloj
de pared → mismo frame en cada seek.

## Comandos

```bash
# 1. Previsualizar el storyboard en el navegador (live reload, puerto 3002)
npx hyperframes preview ./video-hyperframes

# 2. Validar el contrato estático
npx hyperframes lint ./video-hyperframes

# 3. Comprobar runtime, layout, contraste y frames clave en navegador
npx hyperframes check ./video-hyperframes --at 2,12,24,33,42

# 4. Ver instantáneas de frames concretos (PNG)
npx hyperframes snapshot ./video-hyperframes --at 1,10,20,25,34,42

# 5. Renderizar el vídeo final (MP4 · H.264 · 30 fps · 1920×1080)
npx hyperframes render ./video-hyperframes --fps 30 --quality high \
  --output video-hyperframes/renders/pokedex-analisis.mp4
```

Requisitos: Node.js ≥ 22 y FFmpeg ≥ 5 en el `PATH` (ya presentes en esta máquina:
Node v24.22.1, ffmpeg 9.0.1). La primera ejecución descarga el navegador sin cabeza
que usa el renderizador (`npx hyperframes browser ensure`).

### Atajos de revisión por frame

```bash
npx hyperframes snapshot ./video-hyperframes --at 4,9,17,28,42   # 1: intro · 2: diagrama · 3: código · 4: cierre
```

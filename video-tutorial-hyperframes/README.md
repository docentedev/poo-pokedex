# Tutorial JavaFX — Controles y tabla paso a paso (HyperFrames)

Vídeo didáctico de **120 s** para estudiantes de primero: construye el formulario
de la Pokédex de Cartas explicando, sin prisa y con el código a la vista, cuatro
piezas: **ComboBox**, **tabla con campo calculado**, **CheckBox** y **qué clase
usar para crear y listar elementos**.

| Especificación | Valor |
|---|---|
| Resolución | 1920 × 1080 (Full HD, 16:9) |
| FPS | 30 (`data-fps="30"`) |
| Duración | 120 s → **3600 frames** |
| Estilo | Dark mode minimal (`#0D1117`, bordes `#30363D`, acentos `#58A6FF` / `#3FB950`) |
| Tipografía | `Inter`/`system-ui` (títulos) · `JetBrains Mono`/`SF Mono` (código) |
| Audio | Sin pista — subtítulos *lower-third* sincronizados |

## Escenas

| # | Frames | Tiempo | Contenido |
|---|---|---|---|
| 1 | 0 – 300 | 0 – 10 s | Hoja de ruta de los 4 pasos |
| 2 | 300 – 1020 | 10 – 34 s | **PASO 01 · ComboBox**: `fx:id` + `@FXML`, `setItems`, `selectFirst`, `getValue` |
| 3 | 1020 – 1920 | 34 – 64 s | **PASO 02 · Tabla**: `TableColumn<Carta, String>`, `setCellValueFactory`, `calcularValorEstimado()`, `setItems` |
| 4 | 1920 – 2520 | 64 – 84 s | **PASO 03 · CheckBox**: `isSelected()`, `setDisable()`, `setSelected(false)` |
| 5 | 2520 – 3360 | 84 – 112 s | **PASO 04 · Clase correcta**: jerarquía `Carta → CartaPokemon/CartaEnergia`, creación y `ObservableList<Carta>` |
| 6 | 3360 – 3600 | 112 – 120 s | Cierre y resumen |

## Estructura

```
video-tutorial-hyperframes/
├── index.html      # composición: 6 escenas + HUD + medidor de pasos
├── styles.css      # look & layout 1920×1080
├── timeline.js     # timeline GSAP paused registrado en window.__timelines.main
├── lib/gsap.min.js # GSAP 3.13 local (sin CDN → render determinista)
├── hyperframes.json
└── README.md
```

## Comandos

```bash
# Previsualizar en el navegador (live reload, puerto 3002)
npx hyperframes preview ./video-tutorial-hyperframes

# Validar el contrato estático
npx hyperframes lint ./video-tutorial-hyperframes

# Auditar runtime, layout, contraste y frames clave
npx hyperframes check ./video-tutorial-hyperframes --at 4,12,24,40,55,70,90,105,117

# Renderizar el vídeo final (H.264 · 30 fps · 1920×1080)
npx hyperframes render ./video-tutorial-hyperframes --fps 30 --quality high \
  --output video-tutorial-hyperframes/renders/tutorial-controles.mp4
```

Requisitos: Node.js ≥ 22 y FFmpeg en el `PATH`. La primera vez,
`npx hyperframes browser ensure` descarga el navegador sin cabeza.

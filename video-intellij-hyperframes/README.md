# JavaFX en IntelliJ — Guía completa paso a paso

Vídeo técnico de **6 minutos 20 segundos** (380 s · 11 400 frames · 30 fps · 1920×1080) que explica, desde cero y para estudiantes de primer año (segundo semestre de Informática), cómo crear un proyecto JavaFX en IntelliJ IDEA, configurar `module-info.java`, conectar la vista con el controlador, **entender quién crea cada control y en qué momento se inicializa**, ubicar cada responsabilidad en su capa y reconocer los errores más comunes.

Sin narración: todo se explica con títulos, código anotado y subtítulos *lower-third*.

## Contenido

| # | Tiempo | Capítulo | Qué resuelve |
|---|---|---|---|
| — | 0:00–0:12 | Introducción | Promesa y recorrido |
| 01 | 0:12–0:56 | Crear el proyecto | New Project, Maven, JDK 21, estructura, `pom.xml`, ejecutar |
| 02 | 0:56–1:52 | `module-info.java` | El error de `opens`, `requires`, `opens … to`, `exports` |
| 03 | 1:52–2:38 | Vista ↔ Controlador | `fx:controller`, `fx:id`, `@FXML`, `onAction` |
| 04 | 2:38–3:58 | **Atributo, constructor e `initialize()`** | Quién crea el ComboBox y la TableView, y dónde se configuran |
| 05 | 3:58–4:54 | Patrón de capas | Qué hace y qué no hace cada capa |
| 06 | 4:54–5:28 | Organización | Paquetes por responsabilidad y dirección de dependencias |
| 07 | 5:28–6:08 | Errores comunes | 6 errores: síntoma · causa · solución |
| 08 | 6:08–6:20 | Cierre | Checklist final |

### Capítulo 04 en detalle

1. **Orden de ejecución:** constructor → FXML crea los controles → inyección de `fx:id` → `initialize()` → ventana visible → `onAction`. El campo `categoriaComboBox` pasa de `null` a `ComboBox@1a2b` a «3 opciones · listo».
2. **ComboBox:** el atributo solo **declara**; `initialize()` llama a `setItems(...)` y `getSelectionModel().selectFirst()`. Se muestra por qué en el constructor explota con `NullPointerException`.
3. **TableView:** `cartasTable`, `nombreColumn` y `valorColumn` son campos `@FXML`; en `initialize()` se definen los `setCellValueFactory` (incluido el valor calculado) y `setItems(cartas)`.
4. **Regla de oro:** atributo declara · constructor solo dependencias · `initialize()` configura · `onAction` reacciona.

El guion completo, con los textos de cada subtítulo, está en [`GUION.md`](./GUION.md).

## Escenas

| Escena | `data-start` | `data-duration` | Track |
|---|---|---|---|
| `#scene-1` Introducción | 0 | 12 | 1 |
| `#scene-2` Proyecto | 12 | 44 | 2 |
| `#scene-3` module-info | 56 | 56 | 3 |
| `#scene-4` Vista ↔ Controlador | 112 | 46 | 4 |
| `#scene-4b` Inicialización | 158 | 80 | 4 |
| `#scene-5` Capas | 238 | 56 | 5 |
| `#scene-6` Organización | 294 | 34 | 6 |
| `#scene-7` Errores | 328 | 40 | 7 |
| `#scene-8` Cierre | 368 | 12 | 8 |

Capas globales: `#bg` (track 0), `#hud` (track 9), `#progress` (track 10), `#blackout` (track 11).

## Estructura

```
video-intellij-hyperframes/
├─ index.html            composición y contenido (9 bloques: 8 escenas + 4b)
├─ styles.css            layout 1920×1080 en modo oscuro
├─ timeline.js           timeline GSAP determinista (paused)
├─ hyperframes.json      configuración del proyecto
├─ lib/gsap.min.js       GSAP 3.13 vendorizado
├─ GUION.md              guion escena por escena
└─ renders/              salida MP4
```

## Cómo funciona la animación

- `timeline.js` crea una única timeline GSAP con `{ paused: true }` y la registra en `window.__timelines.main`.
- HyperFrames controla el tiempo: cada clip se muestra según `data-start` / `data-duration`; los tweens son *seek-safe* (estado final calculado desde cero, no dependen de `requestAnimationFrame`).
- Helpers: `inAt`, `outAt`, `cue` (lower-third), `reveal` / `revealTree` (aparición de líneas), `focus` (ilumina líneas de código y atenúa el resto al 26 %).

## Comandos

Previsualizar:

```bash
npx hyperframes preview ./video-intellij-hyperframes
```

Verificar (lint + runtime + layout + motion + contraste):

```bash
npx hyperframes check ./video-intellij-hyperframes --at 24,47,89,134,190,216,242,300,340,376
```

Renderizar:

```bash
npx hyperframes render ./video-intellij-hyperframes --fps 30 --quality high --output video-intellij-hyperframes/renders/guia-intellij.mp4
```

## Notas de producción

- Sin música ni voz: el vídeo se sigue con subtítulos, foco de código y cambios de escena.
- Los ejemplos usan el código real del proyecto: `cl.duoc.pokedex`, JavaFX 21.0.6, Gson 2.11.0.
- Los avisos `nested_structure_needs_subcomposition` y `composition_file_too_large` del lint son estructurales (todo el vídeo vive en un solo HTML) y no afectan el render.
- El aviso de *type floor* (texto menor a 28 px) es esperado: etiquetas y metadatos son textura, no lectura principal.

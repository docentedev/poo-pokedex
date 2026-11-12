# Informe de análisis — Pokédex de Cartas (AutoFix_EP2_Base)

**Proyecto:** Evaluación Parcial 2 · DSY1102 Programación Orientada a Objetos
**Fecha del análisis:** 12 de noviembre de 2026
**Alcance:** revisión completa del código fuente, la vista FXML, la configuración Maven, los datos JSON y la documentación (`ENUNCIADO.md`, `COMPLETAR.md`, `LEEME.txt`, `docs/`).

---

## 1. Resumen ejecutivo

Es una aplicación de escritorio **JavaFX** de ventana única, con arquitectura **MVC + DAO/Repository**, que registra y elimina cartas Pokémon y Energía y las persiste en dos archivos JSON mediante **Gson**.

| Aspecto | Estado |
|---|---|
| Compilación (`mvn compile`) | **Correcta** (verificada, Java 21 / Maven 3.10.0) |
| Arquitectura exigida por el enunciado | **Cumple** (model / view / controller / dao / repository) |
| Requisitos funcionales del enunciado | **Cumple en su totalidad** (ver §5) |
| Modelo entregado (`Carta`, `CartaPokemon`, `CartaEnergia`, `Evolucionable`) | **Sin modificaciones aparentes** |
| Calidad de código / robustez | **Buena**, con 2 hallazgos relevantes de persistencia (§6) |
| Pruebas automatizadas | **No existen** |
| Pendientes de entrega | Capturas de pantalla del enunciado y nombre del ZIP |

**Conclusión:** el proyecto cumple el enunciado y está listo para entrega una vez resueltos los puntos P1 (consistencia de la persistencia) y limpiados los artefactos de la carpeta. No se detectaron errores que impidan compilar ni ejecutar las pruebas funcionales descritas en la sección 6 del enunciado.

---

## 2. Datos generales

- **Tipo:** aplicación de escritorio (JavaFX, FXML), una sola ventana.
- **JDK:** 21 (`maven.compiler.release=21`).
- **Dependencias:** `javafx-controls` 21.0.6, `javafx-fxml` 21.0.6, `gson` 2.11.0.
- **Empaquetado:** JAR vía `javafx-maven-plugin` 0.0.8, main class `cl.duoc.pokedex.Launcher`.
- **Ejecución:** `mvn javafx:run` o clase `Launcher` desde IntelliJ.
- **Volumen de código:** 711 líneas Java (10 clases) + 96 líneas FXML; ~2.700 líneas de documentación en `docs/`.
- **Persistencia:** `pokemons.json` y `energias.json` en la raíz del proyecto.

---

## 3. Arquitectura y flujo de datos

```
┌────────────────────────────── pokedex-view.fxml ──────────────────────────────┐
│  ComboBox · TextFields · CheckBoxs · Botones · TableView · Label de mensajes │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ fx:id / onAction / @FXML
                          ┌────────────▼─────────────┐
                          │    PokedexController      │  valida formulario,
                          │  (clases controller)      │  formatea moneda, mensajes
                          └───────┬──────────┬────────┘
              ObservableList<Carta>          │ operaciones de dominio
                          ┌────────▼───┐  ┌──▼──────────────┐
                          │ TableView  │  │ CartaRepository  │ colección en memoria
                          └────────────┘  │ (repository)     │ + transaccionalidad básica
                                          └──┬───────────────┘
                                             │ CartaDao (interfaz)
                                      ┌──────▼────────┐
                                      │ CartaDaoJson  │ Gson + Files
                                      └──────┬────────┘
                                   pokemons.json · energias.json
```

**Paquetes y responsabilidades**

| Paquete | Archivo | Líneas | Responsabilidad |
|---|---|---|---|
| `model` | `Carta` (abstracta) | 76 | Datos comunes, validaciones de setters, `calcularValorEstimado()` y `getCategoria()` abstractos |
| `model` | `CartaPokemon` | 68 | Base $3.000 + 40% si brillante; implementa `Evolucionable` |
| `model` | `CartaEnergia` | 46 | Base $1.000 + 20% si energía > 3,0 |
| `model` | `Evolucionable` | 20 | Contrato de evolución |
| `view` | `pokedex-view.fxml` | 96 | Declaración pura de la UI, sin lógica |
| `controller` | `PokedexController` | 251 | Vinculación, validación de formulario, mensajes, formato CLP |
| `dao` | `CartaDao` | 41 | Contrato de lectura/escritura |
| `dao` | `CartaDaoJson` | 75 | Implementación Gson sobre dos archivos |
| `repository` | `CartaRepository` | 91 | Colección en memoria, partición Pokémon/Energía, delegación al DAO |
| raíz | `App` / `Launcher` | 30 / 13 | Arranque JavaFX (no modificables) |

**Flujo de una operación (ej. Registrar):**
`registrarCarta()` → valida en el controlador → construye `CartaPokemon`/`CartaEnergia` (el modelo vuelve a validar) → `repository.registrar(carta)` → el repository calcula la lista completa, la persiste vía DAO y **solo si el guardado no falla** reemplaza la colección en memoria → el controlador refleja el cambio en la `ObservableList` → mensaje en el `Label`.

---

## 4. Análisis por capas

### 4.1 Modelo (`model`)
- Correcto uso de **herencia** (clase abstracta `Carta`), **polimorfismo** (`calcularValorEstimado()`, `getCategoria()`) e **interfaz** (`Evolucionable`).
- Validación en los *setters* con `IllegalArgumentException` y mensaje explicativo (nombre, año 1996–2026, cantidad > 0, tipo elemental, energía > 0).
- Constantes nombradas (`VALOR_BASE`, `BONO_BRILLANTE`, `RECARGO_ENERGIA`, `LIMITE_ENERGIA`) en lugar de números mágicos.
- Constructor protegido sin parámetros documentado como "requerido para reconstruir objetos (Gson)".
- Verificación de las reglas de negocio:
  - Pokémon brillante → 3000 × 1,40 = **$4.200** ✓ (caso Pikachu)
  - Pokémon normal → **$3.000** ✓ (caso Charmander)
  - Energía 4,0 > 3,0 → 1000 × 1,20 = **$1.200** ✓ (caso Agua Básica)
  - Energía 2,0 ≤ 3,0 → **$1.000** ✓ (caso Planta Básica)

### 4.2 Vista (`view`)
- FXML limpio: `fx:controller`, `fx:id` e `onAction` correctamente enlazados; cero lógica embebida.
- Reúne todos los elementos exigidos: formulario (ComboBox de categoría + campos comunes + campos específicos), botones **Registrar**/**Eliminar**, tabla de 5 columnas (Categoría, Nombre, Año, Cantidad, Valor estimado) y área de mensajes.
- Diseño con `GridPane` + `HBox` + `VBox` y la tabla creciendo con la ventana (`VBox.vgrow="ALWAYS"`).

### 4.3 Controlador (`controller`)
- `initialize()` configura la tabla, pobl el ComboBox, registra el *listener* de categoría y carga los datos: el arranque queda completamente automatizado.
- Habilitación dinámica de campos según categoría, limpiando los de la otra subcategoría (el enunciado lo permite: "no se consideran al registrar").
- Las 6 validaciones del enunciado están implementadas con mensajes que nombran el campo y el motivo (`leerEntero`, `leerDecimal`, chequeos de vacío/rango).
- Los valores ingresados **se conservan** cuando la validación falla (solo se limpia en el registro exitoso). ✓
- Moneda formateada con `NumberFormat.getCurrencyInstance(Locale.of("es","CL"))` → muestra `$4.200` como espera el enunciado.
- **Sin ninguna salida por consola** (`System.out`/`printStackTrace`): verificado por búsqueda en todo `src`. ✓
- La columna "Valor estimado" obtiene el dato de `calcularValorEstimado()` del modelo, como exige el enunciado. ✓

### 4.4 Persistencia (`dao` + `repository`)
- Interfaz `CartaDao` con las 4 operaciones de lectura/escritura y Javadoc. ✓
- `CartaDaoJson` usa `GsonBuilder` con `setPrettyPrinting`, `TypeToken` para los tipos `List<CartaPokemon>`/`List<CartaEnergia>`, y **archivo inexistente → lista vacía** (sin error). ✓
- JSON mal formado o sin permisos → `RuntimeException` con ruta absoluta, que el controlador traduce a mensaje en pantalla. ✓
- `CartaRepository` mantiene la colección en memoria, hace *copy-on-write* antes de persistir y **solo actualiza la memoria si el guardado tuvo éxito** → la tabla nunca muestra algo que no esté en disco.
- El controlador **no toca archivos**: toda I/O pasa por repository → DAO. ✓
- Carga inicial y guardado automático tras cada registrar/eliminar. ✓

---

## 5. Cumplimiento del enunciado (checklist verificado)

| # | Requisito (fuente: `docs/ENUNCIADO.md`) | Estado |
|---|---|---|
| 1 | Compila correctamente | ✅ Verificado con `mvn compile` |
| 2 | Dependencia Gson agregada al `pom.xml` (JavaFX ya incluida) | ✅ |
| 3 | `Launcher` y `App` sin modificar | ✅ |
| 4 | Modelo entregado sin modificar | ✅ Coincide con lo descrito en el enunciado |
| 5 | Distribución en paquetes MVC + DAO/Repository | ✅ |
| 6 | Una sola ventana con formulario, tabla, botones y mensajes | ✅ |
| 7 | Tabla con Categoría, Nombre, Año, Cantidad, Valor estimado | ✅ |
| 8 | Valor tomado de `calcularValorEstimado()` | ✅ |
| 9 | Selector Pokémon / Energía | ✅ |
| 10 | Habilitación dinámica de campos por categoría | ✅ |
| 11 | Las 6 validaciones de formulario con campo + motivo | ✅ |
| 12 | Valores ingresados se conservan ante error | ✅ |
| 13 | Mensajes: éxito, error, eliminación, sin selección, error de archivo | ✅ |
| 14 | Sin mensajes por consola | ✅ Verificado por búsqueda |
| 15 | Interfaz DAO con lectura y escritura | ✅ |
| 16 | Implementación Gson para `pokemons.json` y `energias.json` | ✅ |
| 17 | Repository con colección en memoria y delegación al DAO | ✅ |
| 18 | Controlador sin acceso directo a archivos | ✅ |
| 19 | Carga automática al iniciar | ✅ |
| 20 | Archivos inexistentes → tabla vacía, sin errores | ✅ |
| 21 | Guardado automático tras registrar/eliminar | ✅ |
| 22 | Tabla y archivos coinciden | ✅ (con la salvedud P1.2) |
| 23 | Capturas de las figuras 1–3 del enunciado | ⏳ Pendiente (marcadas como `[pendiente]` en `ENUNCIADO.md`) |

---

## 6. Hallazgos y riesgos

### P1 — Persistencia: dos puntos débiles (recomendados antes de entregar)

**P1.1 Escritura no atómica.** `CartaDaoJson.escribir()` abre el archivo con `Files.newBufferedWriter()`, que lo **trunca de inmediato**. Si el proceso muere o hay un error de disco a mitad de la escritura, el JSON queda vacío o corrupto y los datos de la colección se pierden.
*Sugerencia:* escribir primero a un archivo temporal (`pokemons.tmp`) y luego `Files.move(tmp, real, REPLACE_EXISTING, ATOMIC_MOVE)`.

**P1.2 Guardado parcial entre archivos.** `CartaRepository.guardar()` escribe `pokemons.json` y después `energias.json`. Si el segundo falla, la excepción impide actualizar la colección en memoria, pero el primero **ya quedó modificado**: la tabla dejaría de coincidir con lo disco (incumple literalmente la sección 5 del enunciado).
*Sugerencia:* escribir ambos archivos en modo temporal y moverlos solo si las dos escrituras tuvieron éxito; si algo falla, informar y recargar desde disco.

### P2 — Validación de energía admite `NaN` / `Infinity`
`leerDecimal()` hace `Double.parseDouble(...)` y valida `cantidadEnergia <= 0`. Pero `Double.parseDouble("NaN")` **no lanza excepción** y `NaN <= 0` es falso: se puede registrar una carta con energía `NaN` (valor $1.000) o `Infinity` (valor $1.200) desde el formulario.
*Sugerencia:* `if (!Double.isFinite(x) || x <= 0) → error`.

### P2 — Rutas relativas de los archivos JSON
`Paths.get("pokemons.json")` depende del *working directory* del proceso. Con `mvn javafx:run` desde la raíz funciona bien, pero si se ejecuta desde IntelliJ con otra carpeta de trabajo, los archivos se crearán en un lugar distinto y "lo que muestra la tabla y lo guardado" se romperá sin aviso.
*Sugerencia:* fijar la working directory en IntelliJ (`$PROJECT_DIR$`) o resolver la ruta desde una propiedad configurable.

### P3 — Doble fuente de verdad
El controlador mantiene su `ObservableList<Carta> cartas` y el repository su `List<Carta> cartas`, sincronizadas manualmente (`cartas.add(...)` después de `repository.registrar(...)`). Cualquier método nuevo que olvide un paso desincroniza la UI. Alternativa más robusta: que el repository exponga la lista observable o que la tabla siempre refleje `repository.listar()`.

### P3 — Sin pruebas automatizadas
No existe `src/test`. Las reglas de negocio (`calcularValorEstimado`), las validaciones del formulario y el DAO JSON no tienen ninguna cobertura: hoy la única verificación es manual.
*Sugerencia:* agregar JUnit 5 con casos de las 4 cartas del enunciado, validaciones límite (1995, 2027, cantidad 0) y lectura de archivo inexistente/corrupto.

### P4 — Validación duplicada (controlador ↔ modelo)
Nombre, año y cantidad se validan dos veces (controlador y *setters* del modelo). Es un requisito explícito del enunciado, pero implica mantener dos lugares sincronizados ante cambios de regla.

### P4 — `catch (RuntimeException)` genérico
Los tres puntos de captura capturarían también errores de programación (p. ej. `NullPointerException`) y los mostrarían como "Error: …". Aceptable para la evaluación; en producción convendría capturar excepciones más específicas o un tipo de dominio propio.

### P5 — Cambio de categoría borra lo ya escrito
`actualizarCamposPorCategoria()` limpia los campos de la subcategoría anterior. Cumple con "no se consideran al registrar", pero si el usuario cambia de categoría por error pierde lo tipeado (el enunciado solo pide deshabilitarlos).

### P5 — Higiene del proyecto para la entrega (ZIP)
- `pokemons.json` y `energias.json` contienen **datos de prueba residuales** (`"Po"` y `"kj"`), no las 4 cartas del enunciado.
- Están presentes artefactos que no deben ir en la entrega: `target/`, `.DS_Store`, `.idea/`, `.claude/`.
- No hay `.gitignore` (el directorio no es un repositorio Git).
- Campos inyectados sin uso en el controlador: `registrarButton`, `eliminarButton`.

---

## 7. Fortalezas

1. **Separación de capas exemplar** para la envergadura del caso: el controlador no conoce Gson ni rutas; el DAO no conoce la UI; el modelo no conoce a nadie.
2. **Modelo intacto y con buenas prácticas**: constantes con nombre, validación en setters, Javadoc en español en prácticamente todo el código.
3. **Consistencia memoria/disco lograda con *copy-on-write*** en el repository (patrón correcto, no es la solución obvia).
4. **Sin un solo `System.out`**, cumpliendo el requisito de mensajes solo en la interfaz.
5. **Java moderno**: pattern matching para `instanceof` (`carta instanceof CartaPokemon pokemon`), text blocks ausentes pero estilo uniforme, convenciones de nomenclatura correctas (PascalCase / camelCase).
6. **Documentación completa**: `ENUNCIADO.md`, `COMPLETAR.md` con checklist, `LEEME.txt` y una carpeta `docs/` con guía paso a paso (~1.600 líneas) y notas temáticas sobre TableView, ComboBox y CheckBox.
7. **Compilación limpia** en el entorno actual (JDK 21.0.2, Maven 3.10.0).

---

## 8. Plan de acción recomendado (priorizado)

1. **[P1] Hacer atómica la escritura** en `CartaDaoJson.escribir()` (archivo temporal + move).
2. **[P1] Evitar el guardado parcial** entre `pokemons.json` y `energias.json` en `CartaRepository.guardar()`.
3. **[P2] Validar `Double.isFinite()`** en la cantidad de energía.
4. **[P5] Limpiar datos residuales** de los JSON y regenerarlos con las 4 cartas de prueba del enunciado.
5. **[P5] Excluir `target/`, `.DS_Store`, `.idea/`, `.claude/`** del ZIP de entrega.
6. **[Entrega] Capturar las figuras 1–3** (tabla completa, aviso por falta de selección, error de validación) y nombrar el ZIP con el nombre del estudiante sin tildes ni espacios.
7. **[Opcional]** Fijar working directory en IntelliJ; agregar `.gitignore`; sumar tests JUnit; unificar la fuente de verdad de la lista.

---

## 9. Nota

`docs/ENUNCIADO.md` establece que la evaluación es individual, sin internet ni uso de herramientas de inteligencia artificial, y que "cualquier indicio de … uso de IA … implica la anulación inmediata de la evaluación". Este informe es una revisión técnica bajo pedido y debe interpretarse en ese marco académico: la decisión sobre qué aplicar (y cómo declararlo) corresponde al/la estudiante.

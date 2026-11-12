# Campos calculados en una `TableView` de JavaFX

**Guía para estudiantes de primer año**

Hasta ahora las columnas de la tabla mostraban datos que ya existían en el objeto: el nombre, el año, la cantidad. Bastaba con llamar a un *getter*. Pero, ¿qué pasa si queremos mostrar un dato que **no está guardado** en ninguna parte, sino que se **calcula** a partir de otros datos? Por ejemplo, el valor estimado de una carta, su antigüedad en la colección o el bono/recargo que se le aplica.

Esta guía explica cómo hacerlo usando el proyecto **Pokédex de Cartas** como ejemplo. Todos los ejemplos de columnas se configuran en `configurarTabla()`, dentro de:

```text
src/main/java/cl/duoc/pokedex/controller/PokedexController.java
```

y su columna correspondiente se declara en:

```text
src/main/resources/cl/duoc/pokedex/view/pokedex-view.fxml
```

---

## 1. La idea clave

Una `TableView` **no muestra objetos completos**: muestra **un valor por columna**. Cada columna le pregunta a cada fila:

> "Para esta carta, ¿qué valor debo mostrar?"

Esa pregunta se responde con una función llamada `cellValueFactory`. Y como es una función, puede hacer **cualquier cálculo**, no solo devolver un atributo.

```text
TableView<Carta>
 └── TableColumn<Carta, String> valorColumn
      └── cellValueFactory: (fila) -> valor de la celda
```

La diferencia entre una columna "normal" y una "calculada" es solo **qué hay dentro de esa función**:

| Columna | Qué devuelve `cellValueFactory` |
|---|---|
| Normal (getter) | `carta.getNombre()` |
| Calculada | `carta.calcularValorEstimado()` |
| Calculada con formato | `formatearMoneda(carta.calcularValorEstimado())` |
| Calculada condicional | `carta.getCategoria().equals("Pokémon") ? ... : ...` |

---

## 2. Anatomía de una `TableColumn`

Una columna se declara con **dos tipos genéricos**:

```java
TableColumn<Carta, String> nombreColumn;
//           ↑        ↑
//      tipo de la fila  tipo del valor de la celda
```

- **Primer tipo (`Carta`)**: qué objeto hay en cada fila de la tabla.
- **Segundo tipo (`String`)**: qué valor entrega esa columna.

El `cellValueFactory` debe devolver un `ObservableValue` de ese segundo tipo:

```java
nombreColumn.setCellValueFactory(dato ->
        new SimpleStringProperty(dato.getValue().getNombre()));
```

Desglose:

| Parte | Significado |
|---|---|
| `dato` | Un `CellDataFeatures<Carta, String>`: información de la fila que se está dibujando |
| `dato.getValue()` | La `Carta` de esa fila |
| `.getNombre()` | El valor que queremos mostrar |
| `new SimpleStringProperty(...)` | Envuelve el valor para que JavaFX pueda observarlo |

> **Regla de oro:** el tipo del `SimpleXxxProperty` debe coincidir con el segundo genérico de la columna.

---

## 3. Caso base: una columna con getter

Así se ve una columna que solo lee un atributo existente:

```java
TableColumn<Carta, String> nombreColumn;

nombreColumn.setCellValueFactory(dato ->
        new SimpleStringProperty(dato.getValue().getNombre()));
```

También se puede escribir con `PropertyValueFactory`, que busca automáticamente un getter:

```java
nombreColumn.setCellValueFactory(new PropertyValueFactory<>("nombre"));
// Busca el método getNombre() en Carta
```

Esto funciona **solo para getters**. En cuanto el valor es calculado, `PropertyValueFactory` ya no sirve.

---

## 4. Primer campo calculado: el valor estimado

En el modelo del proyecto, el valor estimado **no es un atributo**. Se obtiene llamando a un método:

```java
public abstract double calcularValorEstimado();
```

Por eso no podemos escribir `PropertyValueFactory<>("calcularValorEstimado")`: esa clase buscaría un método llamado `getCalcularValorEstimado()`, que no existe. La columna quedaría vacía.

La solución es usar una **lambda** que llame al método:

```java
TableColumn<Carta, String> valorColumn;

valorColumn.setCellValueFactory(dato ->
        new SimpleStringProperty(
                formatearMoneda(dato.getValue().calcularValorEstimado())
        ));
```

Y el método de formato:

```java
private String formatearMoneda(double valor) {
    NumberFormat formato = NumberFormat.getCurrencyInstance(Locale.of("es", "CL"));
    return formato.format(valor);
}
```

Resultado en pantalla: `$3.000`, `$4.200`, `$1.000`, `$1.200`.

### ¿Por qué `String` y no `Double`?

Porque queremos mostrar el valor **ya formateado como moneda**. Si la columna fuera `TableColumn<Carta, Double>`, JavaFX mostraría `4200.0` en vez de `$4.200`.

Elegir el tipo de la columna es una decisión de presentación:

- `Double` → si quieres el número "puro" (útil para ordenar o para pintar celdas según el valor).
- `String` → si quieres texto ya formateado.

---

## 5. Tipos de columna y cómo envolver cada valor

| Quieres mostrar | Tipo de la columna | Cómo se envuelve |
|---|---|---|
| Texto | `String` | `new SimpleStringProperty(texto)` |
| Entero | `Integer` | `new SimpleIntegerProperty(numero).asObject()` |
| Decimal | `Double` | `new SimpleDoubleProperty(numero).asObject()` |
| Booleano | `Boolean` | `new SimpleBooleanProperty(valor).asObject()` |
| Fecha u objeto | `LocalDate`, `Persona`, etc. | `new SimpleObjectProperty<>(objeto)` |

Ejemplos reales del proyecto:

```java
// Año de edición (int → Integer)
anioColumn.setCellValueFactory(dato ->
        new SimpleIntegerProperty(dato.getValue().getAnioEdicion()).asObject());

// Cantidad (int → Integer)
cantidadColumn.setCellValueFactory(dato ->
        new SimpleIntegerProperty(dato.getValue().getCantidad()).asObject());
```

> **Ojo:** `new SimpleIntegerProperty(5)` **no** se puede asignar directamente a `TableColumn<Carta, Integer>`. Hay que llamar a `.asObject()` para convertir el `IntegerProperty` en un `ObservableValue<Integer>`.

---

## 6. Más ejemplos de campos calculados

A continuación, columnas que **no existen en el modelo** y que se pueden agregar al proyecto sin modificar `Carta`, `CartaPokemon` ni `CartaEnergia`.

### 6.1 Antigüedad de la carta en la colección

Se calcula restando el año actual menos el año de edición.

```java
private static final int ANIO_ACTUAL = 2026;

TableColumn<Carta, Integer> antiguedadColumn;

antiguedadColumn.setCellValueFactory(dato ->
        new SimpleIntegerProperty(
                ANIO_ACTUAL - dato.getValue().getAnioEdicion()
        ).asObject());
```

### 6.2 Un dato distinto según el tipo (tipo elemental o energía)

Una `CartaPokemon` tiene `tipoElemental`; una `CartaEnergia` tiene `cantidadEnergia`. Podemos unificarlos en una sola columna "Detalle":

```java
TableColumn<Carta, String> detalleColumn;

detalleColumn.setCellValueFactory(dato -> {
    Carta carta = dato.getValue();

    if (carta instanceof CartaPokemon pokemon) {
        return new SimpleStringProperty(pokemon.getTipoElemental());
    }
    if (carta instanceof CartaEnergia energia) {
        return new SimpleStringProperty(energia.getCantidadEnergia() + " pts");
    }
    return new SimpleStringProperty("-");
});
```

> `instanceof CartaPokemon pokemon` es *pattern matching* (Java 16+). Si la condición se cumple, `pokemon` ya queda declarado y convertido, sin necesidad de un cast manual.

### 6.3 Un booleano convertido en "Sí" / "No"

```java
TableColumn<Carta, String> evolucionColumn;

evolucionColumn.setCellValueFactory(dato -> {
    Carta carta = dato.getValue();

    if (carta instanceof CartaPokemon pokemon) {
        return new SimpleStringProperty(
                pokemon.tieneEvolucionActiva() ? "Sí" : "No");
    }
    return new SimpleStringProperty("No aplica");
});
```

### 6.4 Bono o recargo aplicado (cálculo condicional)

Podemos crear un método auxiliar en el controlador y llamarlo desde la lambda:

```java
private String bonoDe(Carta carta) {
    if (carta instanceof CartaPokemon pokemon) {
        return pokemon.isBrillante() ? "40%" : "Sin bono/recargo";
    }
    if (carta instanceof CartaEnergia energia) {
        return energia.getCantidadEnergia() > 3.0 ? "20%" : "Sin bono/recargo";
    }
    return "-";
}
```

```java
TableColumn<Carta, String> bonoColumn;

bonoColumn.setCellValueFactory(dato ->
        new SimpleStringProperty(bonoDe(dato.getValue())));
```

La lambda no está obligada a ser una sola línea: puede llamar a **cualquier método** que reciba la carta y devuelva el valor.

### 6.5 Valor con IVA (otro cálculo sobre el valor estimado)

```java
private static final double IVA = 0.19;

TableColumn<Carta, String> valorConIvaColumn;

valorConIvaColumn.setCellValueFactory(dato ->
        new SimpleStringProperty(
                formatearMoneda(dato.getValue().calcularValorEstimado() * (1 + IVA))
        ));
```

Aquí se ve la ventaja de los campos calculados: **no hay que guardar nada nuevo** en el modelo ni en el JSON. La columna se calcula cada vez que JavaFX dibuja la fila.

---

## 7. Cómo agregar una columna nueva: paso a paso

Supongamos que queremos agregar la columna **"Antigüedad"**.

### Paso 1: declararla en el FXML

Dentro de `<columns>` de la `TableView`:

```xml
<TableColumn fx:id="antiguedadColumn" text="Antigüedad" prefWidth="120.0"/>
```

El `fx:id` es el puente entre el FXML y el controlador. Si no coincide, el campo del controlador quedará en `null` y la aplicación fallará con `NullPointerException`.

### Paso 2: declararla en el controlador

```java
@FXML
private TableColumn<Carta, Integer> antiguedadColumn;
```

### Paso 3: configurar el `cellValueFactory`

Dentro de `configurarTabla()`:

```java
antiguedadColumn.setCellValueFactory(dato ->
        new SimpleIntegerProperty(
                ANIO_ACTUAL - dato.getValue().getAnioEdicion()
        ).asObject());
```

### Paso 4: probar

Registra una carta Pokémon de 1998 y otra de 2020. La tabla debe mostrar `28` y `6`.

---

## 8. Dar formato y color a las celdas (`cellFactory`)

El `cellValueFactory` decide **qué valor** muestra la celda. El `cellFactory` decide **cómo se ve** (color, negrita, alineación).

Ejemplo: pintar en rojo las cartas cuyo valor estimado supera $4.000.

```java
TableColumn<Carta, Double> valorColumn;

valorColumn.setCellValueFactory(dato ->
        new SimpleDoubleProperty(dato.getValue().calcularValorEstimado()).asObject());

valorColumn.setCellFactory(columna -> new TableCell<Carta, Double>() {
    @Override
    protected void updateItem(Double valor, boolean vacia) {
        super.updateItem(valor, vacia);

        if (vacia || valor == null) {
            setText(null);
            setStyle("");
        } else {
            setText(formatearMoneda(valor));
            setStyle(valor > 4000
                    ? "-fx-text-fill: #b00020; -fx-font-weight: bold;"
                    : "");
        }
    }
});
```

Puntos importantes:

- El `TableCell` debe usar **los mismos dos genéricos** que la columna: `<Carta, Double>`.
- `updateItem` se llama cada vez que JavaFX recicla una celda para una fila distinta.
- Siempre hay que contemplar el caso `vacia == true`; si no, aparecen valores "fantasma" al hacer scroll.

---

## 9. ¿Cuándo se actualiza un campo calculado?

| Situación | ¿Se actualiza solo? |
|---|---|
| Agregas o quitas un objeto de la `ObservableList` | Sí |
| Modificas un atributo del objeto y la columna lo lee en vivo | No |
| Modificas datos y quieres recalcular la columna | Llama a `cartasTable.refresh()` |

Ejemplo: si activas la evolución de un Pokémon ya cargado y quieres que la tabla refleje cualquier cambio visual asociado, la tabla no se entera por sí sola:

```java
pokemon.activarEvolucion();
cartasTable.refresh();
```

`refresh()` vuelve a ejecutar todos los `cellValueFactory` y `cellFactory` de la tabla.

---

## 10. Errores comunes (y cómo reconocerlos)

| Síntoma | Causa probable | Solución |
|---|---|---|
| La columna aparece vacía | Usaste `PropertyValueFactory` con un método calculado | Usa una lambda con `setCellValueFactory` |
| `NullPointerException` al iniciar | El `fx:id` del FXML no coincide con el campo `@FXML` | Revisa que los nombres sean idénticos |
| "Incompatible types" al compilar | El tipo de la columna no coincide con la propiedad | Usa `String`/`Double`/`Integer` correctamente y `.asObject()` cuando corresponda |
| Los números salen como `4200.0` | La columna es `Double` y no aplicaste formato | Formatea a `String` o usa un `cellFactory` |
| Los valores cambian de fila al hacer scroll | El `cellFactory` no limpia el estado cuando `vacia == true` | Vuelve a poner `setText(null)` y `setStyle("")` |
| La tabla se congela | Haces lectura de archivos o consultas dentro de `cellValueFactory` | Calcula en memoria; nunca hagas I/O dentro de una celda |

---

## 11. Ejercicio propuesto

Agrega al proyecto las siguientes columnas **sin modificar el modelo**:

| Columna | Tipo | Cálculo |
|---|---|---|
| **Antigüedad** | `Integer` | `2026 - anioEdicion` |
| **Detalle** | `String` | Tipo elemental si es Pokémon; `"X pts"` si es Energía |
| **Bono/Recargo** | `String` | `"40%"` si el Pokémon es brillante; `"20%"` si la Energía supera 3,0 pts; `"Sin bono/recargo"` en otro caso |

Resultado esperado con los datos de prueba:

| Categoría | Nombre | Año | Cantidad | Valor | Antigüedad | Detalle | Bono/Recargo |
|---|---|---|---|---|---|---|---|
| Pokémon | Pikachu | 1998 | 3 | $4.200 | 28 | Eléctrico | 40% |
| Pokémon | Charmander | 2016 | 1 | $3.000 | 10 | Fuego | Sin bono/recargo |
| Energía | Agua Básica | 2020 | 5 | $1.200 | 6 | 4.0 pts | 20% |
| Energía | Planta Básica | 2021 | 2 | $1.000 | 5 | 2.0 pts | Sin bono/recargo |

**Desafío extra:** pinta en rojo la columna "Bono/Recargo" cuando no diga "Sin bono/recargo", usando un `cellFactory`.

---

## 12. Resumen

1. Una columna muestra **un valor por fila**, no el objeto completo.
2. El valor se define con `cellValueFactory`, que puede llamar a **getters o a métodos calculados**.
3. `PropertyValueFactory` sirve solo para getters; para cálculos usa **lambdas**.
4. El tipo de la columna (`String`, `Integer`, `Double`...) debe coincidir con lo que devuelve la lambda.
5. Los campos calculados **no necesitan guardarse** en el modelo ni en el JSON: se calculan al dibujar.
6. Usa `cellFactory` solo cuando quieras cambiar la **apariencia** de la celda.
7. Si cambian los datos sin cambiar la lista, llama a `tableView.refresh()`.

Con esto puedes mostrar en una tabla cualquier valor derivado: valores estimados, antigüedades, bonos, recargos, estados, totales, promedios o textos armados a partir de varios atributos.

---

> **Siguiente guía:** [ComboBox y CheckBox en JavaFX](combobox-y-checkbox.md), para entender los controles con los que el usuario elige la categoría de la carta y marca sus atributos.

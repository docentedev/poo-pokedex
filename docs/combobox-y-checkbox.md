 # `ComboBox` y `CheckBox` en JavaFX

**Guía para estudiantes de primer año**

> **Guía anterior:** [Campos calculados en una `TableView`](campos-calculados-en-tableview.md).

En la guía anterior vimos cómo mostrar datos en una `TableView`, incluyendo valores calculados. Ahora toca el otro lado del formulario: **los controles con los que el usuario elige opciones**.

En el proyecto **Pokédex de Cartas** se usan dos:

- Un **`ComboBox`** para elegir la **categoría de la carta** (Pokémon o Energía).
- Dos **`CheckBox`** para marcar si el Pokémon es **brillante** y si tiene la **evolución activa** en la colección.

Ambos son controles de selección, pero sirven para cosas distintas:

| Control | Sirve para | Ejemplo en Pokédex |
|---|---|---|
| `ComboBox` | Elegir **una** opción de una lista | Categoría: Pokémon / Energía |
| `CheckBox` | Activar o desactivar **una** condición independiente | Brillante: sí / no |
| `RadioButton` | Elegir **una** opción entre pocas, visibles | (no se usa en este proyecto) |

---

## 1. Dónde está esto en el proyecto

```text
src/main/resources/cl/duoc/pokedex/view/pokedex-view.fxml
    → declara los controles con fx:id

src/main/java/cl/duoc/pokedex/controller/PokedexController.java
    → initialize()                            carga las opciones del ComboBox
    → actualizarCamposPorCategoria()          habilita/deshabilita según la categoría
    → registrarCarta()                        lee los valores elegidos
    → limpiarFormulario()                     deja los controles como al inicio
```

La idea general es siempre la misma:

```text
FXML: "existe este control y se llama categoriaComboBox"
   ↓
Controlador: @FXML private ComboBox<String> categoriaComboBox;
   ↓
initialize(): se llena, se selecciona algo por defecto y se escucha
   ↓
registrarCarta(): se lee el valor y se usa
```

---

# Parte I: `ComboBox`

## 2. ¿Qué es un `ComboBox`?

Es una **lista desplegable**: el usuario hace clic y elige **una** opción. Solo puede haber una seleccionada a la vez.

En la Pokédex se usa para la categoría de la carta:

```text
┌──────────────────────────┐
│ Pokémon                 ▼ │
├──────────────────────────┤
│ Pokémon                   │
│ Energía                   │
└──────────────────────────┘
```

## 3. Declararlo en el FXML

```xml
<ComboBox fx:id="categoriaComboBox" maxWidth="Infinity"/>
```

- `fx:id` es el nombre que conecta el control con el controlador.
- `maxWidth="Infinity"` hace que ocupe todo el ancho disponible de su celda del `GridPane`.
- Si el `fx:id` del FXML no coincide con el campo `@FXML`, el campo queda en `null` y la aplicación falla al iniciar.

> En este proyecto las opciones **no** están en el FXML: se cargan desde el controlador. Esa es la forma más flexible y la que conviene aprender primero.

## 4. Declararlo en el controlador

```java
@FXML
private ComboBox<String> categoriaComboBox;
```

El genérico `<String>` indica **el tipo de cada opción**:

| Genérico | Cada opción es... |
|---|---|
| `ComboBox<String>` | Un texto (`"Pokémon"`, `"Energía"`) |
| `ComboBox<Integer>` | Un número (`1`, `2`, `3`) |
| `ComboBox<Carta>` | Un objeto `Carta` completo |

Si el genérico no coincide con lo que se carga, el código no compila. Esa es la primera señal de alarma.

## 5. Cargar las opciones

En `initialize()`:

```java
categoriaComboBox.setItems(FXCollections.observableArrayList(CATEGORIA_POKEMON, CATEGORIA_ENERGIA));
```

- `FXCollections.observableArrayList(...)` crea una lista que JavaFX puede observar.
- `setItems(...)` reemplaza todas las opciones del desplegable.

También se puede hacer con una lista normal:

```java
categoriaComboBox.getItems().setAll("Pokémon", "Energía");
```

Ambas formas son válidas. Lo importante es que **las opciones se carguen antes de que el usuario interactúe**.

## 6. Seleccionar una opción por defecto

```java
categoriaComboBox.getSelectionModel().selectFirst();
```

o, equivalentemente:

```java
categoriaComboBox.setValue(CATEGORIA_POKEMON);
```

Sin esta línea, el `ComboBox` aparece **vacío** y `getValue()` devuelve `null` hasta que el usuario elige algo.

## 7. Leer el valor elegido

```java
String categoria = categoriaComboBox.getValue();
```

- Devuelve la opción seleccionada.
- Devuelve `null` si no hay ninguna.

Por eso siempre hay que validar:

```java
if (categoria == null) {
    throw new IllegalArgumentException("Debe seleccionar una categoría de carta.");
}
```

### `getValue()` vs `getSelectionModel()`

Son dos caminos para lo mismo:

```java
String a = categoriaComboBox.getValue();
String b = categoriaComboBox.getSelectionModel().getSelectedItem();
// a y b contienen lo mismo
```

El **selection model** es el objeto que administra qué está seleccionado. `getValue()` es el atajo más usado para leer. El modelo de selección se usa cuando necesitas `selectFirst()`, `clearSelection()` o `getSelectedIndex()`.

## 8. Reaccionar cuando el usuario cambia la opción

Hay dos mecanismos y **no son iguales**:

### Opción A: `setOnAction`

```java
categoriaComboBox.setOnAction(evento -> actualizarCamposPorCategoria());
```

Se ejecuta cuando el usuario **elige** una opción. Es lo más parecido a "cuando se hace clic".

### Opción B: escuchar la propiedad `value`

```java
categoriaComboBox.valueProperty().addListener(
        (observable, valorAnterior, valorNuevo) -> actualizarCamposPorCategoria()
);
```

Se ejecuta **cada vez que cambia el valor**, venga del usuario o del código. Es la que usa el proyecto.

| Situación | `setOnAction` | listener de `valueProperty()` |
|---|---|---|
| El usuario elige en la lista | ✅ | ✅ |
| El código hace `setValue("Energía")` | ❌ | ✅ |
| El código hace `selectFirst()` | ❌ | ✅ |

> **Regla práctica:** si la reacción debe ocurrir siempre que el valor cambie (incluido el arranque o los cambios automáticos), usa el listener. Si solo debe ocurrir ante una acción del usuario, usa `setOnAction`.

Los tres parámetros del listener son:

| Parámetro | Contenido |
|---|---|
| `observable` | La propiedad que cambió |
| `valorAnterior` | Lo que había antes (`null` la primera vez) |
| `valorNuevo` | Lo que hay ahora |

Muchas veces no se usan los dos primeros; por eso se escriben con `_` o con nombres como `obs, anterior, nuevo`.

## 9. Ejemplo completo del proyecto: habilitar campos según la categoría

Este es el corazón del formulario. Si se elige **Pokémon**, se habilitan tipo elemental, brillante y evolución activa. Si se elige **Energía**, se habilita la cantidad de energía.

```java
@FXML
public void initialize() {
    configurarTabla();

    categoriaComboBox.setItems(FXCollections.observableArrayList(CATEGORIA_POKEMON, CATEGORIA_ENERGIA));
    categoriaComboBox.valueProperty().addListener(
            (observable, anterior, nuevo) -> actualizarCamposPorCategoria());
    categoriaComboBox.getSelectionModel().selectFirst();

    cargarDatos();
}

private void actualizarCamposPorCategoria() {
    boolean esPokemon = CATEGORIA_POKEMON.equals(categoriaComboBox.getValue());

    tipoElementalField.setDisable(!esPokemon);
    brillanteCheckBox.setDisable(!esPokemon);
    evolucionActivaCheckBox.setDisable(!esPokemon);
    cantidadEnergiaField.setDisable(esPokemon);

    if (esPokemon) {
        cantidadEnergiaField.clear();
    } else {
        tipoElementalField.clear();
        brillanteCheckBox.setSelected(false);
        evolucionActivaCheckBox.setSelected(false);
    }
}
```

Puntos clave:

1. **`setDisable(true)`** deshabilita el control: se ve gris y el usuario no puede escribir ni marcar.
2. **Deshabilitar no borra el valor**: un `TextField` deshabilitado conserva su texto y un `CheckBox` deshabilitado conserva su estado. Por eso el proyecto **limpia** los campos de la otra categoría.
3. `CATEGORIA_POKEMON.equals(categoriaComboBox.getValue())` es seguro aunque `getValue()` sea `null`: devuelve `false`. Al revés (`categoriaComboBox.getValue().equals(CATEGORIA_POKEMON)`) lanzaría `NullPointerException`.

### ¿Y por qué va después de `selectFirst()`?

`selectFirst()` cambia el valor y dispara el listener, así que los campos quedan configurados desde el primer segundo, sin que el usuario toque nada. Si el listener no se disparara con cambios programáticos, habría que llamar a `actualizarCamposPorCategoria()` a mano.

## 10. `ComboBox` con objetos (avanzado)

También se puede llenar con objetos del modelo:

```java
ComboBox<Carta> cartaComboBox;
cartaComboBox.setItems(FXCollections.observableArrayList(pokemonsYEnergias));
```

El desplegable mostrará el resultado de `toString()` de cada objeto. Si ese texto no es el que quieres, se personaliza con un `StringConverter` o con un `cellFactory`. Para el alcance de este curso, **usar `ComboBox<String>` y traducir el texto a un objeto** (como hace la Pokédex) es más simple y más claro.

## 11. `ComboBox` vs `ChoiceBox`

Son casi lo mismo:

| `ChoiceBox` | `ComboBox` |
|---|---|
| Más simple | Más funciones (editable, celdas personalizadas) |
| Lista fija | Puede permitir escribir para filtrar |
| Ideal para pocas opciones | Ideal cuando se personaliza la presentación |

Para Pokémon/Energía, cualquiera de los dos sirve. El proyecto usa `ComboBox`.

## 12. Errores comunes con `ComboBox`

| Síntoma | Causa | Solución |
|---|---|---|
| El desplegable está vacío | No se llamó a `setItems(...)` | Carga las opciones en `initialize()` |
| `getValue()` devuelve `null` | No hay selección por defecto | `selectFirst()` o `setValue(...)` |
| `NullPointerException` al comparar | Se usó `getValue().equals(...)` | Usa `CONSTANTE.equals(getValue())` |
| "Incompatible types" | El genérico no coincide con las opciones | Revisa `ComboBox<String>` vs `ComboBox<Integer>` |
| El listener no se ejecuta | Se conectó después de `selectFirst()` | Conecta el listener **antes** de seleccionar |
| Cambiar la categoría no limpia los campos | Deshabilitaste, pero no borraste | Limpia los datos de la categoría que ya no aplica |

---

# Parte II: `CheckBox`

## 13. ¿Qué es un `CheckBox`?

Es una casilla que puede estar **marcada** o **desmarcada**. Representa un valor **booleano** (`true` / `false`) y es **independiente** de otras casillas: se pueden marcar varias a la vez.

```text
☑ Brillante
☐ Evolución activa
```

En la Pokédex, cada casilla corresponde a un atributo `boolean` del `CartaPokemon`:

| `CheckBox` | Atributo del modelo |
|---|---|
| Brillante | `brillante` |
| Evolución activa | `evolucionActiva` |

## 14. Declararlo en el FXML

```xml
<CheckBox fx:id="brillanteCheckBox" text="Sí"/>
```

- `fx:id` lo conecta con el controlador.
- `text` es lo que se muestra al lado de la casilla.
- Por defecto aparece **desmarcado** (`false`).

## 15. Declararlo en el controlador

```java
@FXML
private CheckBox brillanteCheckBox;

@FXML
private CheckBox evolucionActivaCheckBox;
```

## 16. Leer su estado

```java
boolean brillante = brillanteCheckBox.isSelected();
```

- `isSelected()` devuelve `true` si está marcado y `false` si no.
- **No** se usa `getText()`: el texto es la etiqueta ("Sí"), no el estado.

Forma parte del modelo:

```java
CartaPokemon pokemon = new CartaPokemon(
        nombre,
        anio,
        cantidad,
        tipoElemental,
        brillanteCheckBox.isSelected()   // ← boolean
);
```

## 17. Cambiar su estado desde el código

```java
brillanteCheckBox.setSelected(true);    // marcar
brillanteCheckBox.setSelected(false);   // desmarcar
brillanteCheckBox.setSelected(!brillanteCheckBox.isSelected()); // invertir
```

Esto es lo que hace el proyecto al limpiar el formulario:

```java
private void limpiarFormulario() {
    // ...
    brillanteCheckBox.setSelected(false);
    evolucionActivaCheckBox.setSelected(false);
    // ...
}
```

Si no se resetean, al registrar la siguiente carta quedarían marcadas por herencia de la anterior.

## 18. Reaccionar cuando el usuario marca o desmarca

Con un listener sobre `selectedProperty()`:

```java
brillanteCheckBox.selectedProperty().addListener(
        (observable, estaba, estaAhora) -> {
            if (estaAhora) {
                // se acaba de marcar
            } else {
                // se acaba de desmarcar
            }
        }
);
```

Con `setOnAction`:

```java
evolucionActivaCheckBox.setOnAction(evento -> {
    if (evolucionActivaCheckBox.isSelected()) {
        // ...
    }
});
```

La diferencia es la misma que en el `ComboBox`: el listener reacciona a **cualquier** cambio; `setOnAction`, solo a la interacción del usuario.

## 19. Habilitar y deshabilitar casillas según la categoría

Igual que los `TextField`:

```java
boolean esPokemon = CATEGORIA_POKEMON.equals(categoriaComboBox.getValue());

brillanteCheckBox.setDisable(!esPokemon);
evolucionActivaCheckBox.setDisable(!esPokemon);
```

Si la categoría es Energía, las casillas quedan grises. Además, el proyecto las desmarca al cambiar de categoría para que no queden valores "fantasma" que después se lean por error.

## 20. Brillante y evolución activa (importante)

El modelo `CartaPokemon` distingue dos conceptos que suenan parecido:

| Concepto | Significado | Cómo llega al objeto |
|---|---|---|
| **Brillante** | La carta es una versión holográfica/shiny | Se pasa en el constructor |
| **Evolución activa** | El jugador activó la evolución de esa carta en la colección | Se llama a `activarEvolucion()` |

```java
CartaPokemon pokemon = new CartaPokemon(nombre, anio, cantidad, tipoElemental,
        brillanteCheckBox.isSelected());

if (evolucionActivaCheckBox.isSelected()) {
    pokemon.activarEvolucion();
}
```

Observa que:

- `brillante` afecta el **valor estimado** (bono del 40%).
- `evolucionActiva` se registra en el objeto, pero **no cambia el valor**.
- El modelo **solo tiene `activarEvolucion()`**, no `desactivarEvolucion()`. Por eso:
  - Si la casilla está marcada al registrar → la evolución queda activa.
  - Si la casilla está desmarcada al registrar → queda en `false` (su valor inicial).
  - Desmarcarla **después** de registrar no cambia el objeto ya creado: el `CheckBox` solo se lee en el momento del registro.

> **Moraleja:** los controles son la **entrada** del formulario; el objeto se construye una vez con esos valores. Si quieres que un cambio posterior afecte al objeto, debes escribir código que lo haga (por ejemplo, un botón "Actualizar" y `cartasTable.refresh()`).

## 21. `CheckBox` vs `RadioButton`

| `CheckBox` | `RadioButton` |
|---|---|
| Varias pueden estar marcadas | Solo una del grupo |
| Cada una es independiente | Se agrupan con `ToggleGroup` |
| Para condiciones sí/no | Para opciones excluyentes |
| Ej.: brillante / evolución activa | Ej.: categoría de la carta |

Si tuvieras que elegir **una** categoría entre varias, un grupo de `RadioButton` también sería válido. El proyecto usa un `ComboBox` porque la lista es corta y así ahorra espacio.

## 22. Errores comunes con `CheckBox`

| Síntoma | Causa | Solución |
|---|---|---|
| Siempre se registra `false` | Se comparó o se leyó `getText()` | Usa `isSelected()` |
| El estado "se hereda" entre registros | No se reseteó en `limpiarFormulario()` | `setSelected(false)` |
| Se marca una casilla de Energía | No se deshabilitó o no se limpió | `setDisable(!esPokemon)` y `setSelected(false)` |
| `NullPointerException` al iniciar | `fx:id` distinto al campo `@FXML` | Revisa los nombres |
| Marcar/desmarcar no cambia nada | No hay listener ni se lee al registrar | Lee `isSelected()` al construir el objeto |
| Se espera que desmarcar desactive la evolución | El modelo no tiene método para desactivar | Solo `activarEvolucion()` existe |

---

## 23. Cómo se combinan todos los controles

Este es el recorrido completo del formulario:

```text
initialize()
   ├── ComboBox: setItems(Pokémon, Energía)
   ├── ComboBox: listener → actualizarCamposPorCategoria()
   └── ComboBox: selectFirst()  → dispara el listener
                                        │
                                        ▼
                         actualizarCamposPorCategoria()
                         ├── Pokémon: tipo elemental + checkboxes habilitados
                         └── Energía: cantidad de energía habilitada

Usuario completa y presiona "Registrar"
                                        │
                                        ▼
                                registrarCarta()
   ├── lee ComboBox.getValue()          → categoría
   ├── lee TextField.getText()          → nombre, año, cantidad, tipo elemental/energía
   ├── lee CheckBox.isSelected()        → brillante, evolución activa
   ├── valida
   ├── crea CartaPokemon o CartaEnergia
   ├── repository.registrar(...)
   ├── tabla.add(...)
   └── limpiarFormulario()              → resetea también los CheckBox
```

**Resumen de responsabilidades:**

| Control | Método para leer | Método para escribir |
|---|---|---|
| `ComboBox` | `getValue()` | `setValue(...)`, `selectFirst()` |
| `CheckBox` | `isSelected()` | `setSelected(...)` |
| `TextField` | `getText()` | `setText(...)`, `clear()` |
| `TableView` | `getSelectionModel().getSelectedItem()` | `setItems(...)` |

---

## 24. Ejercicio propuesto

Agrega al formulario, **sin modificar el modelo**:

1. Un `ComboBox<String>` llamado `edicionComboBox` con las opciones:
   `Base`, `Jungla`, `Fósil`, `Escarlata-Púrpura`.
   - Debe seleccionar `Base` por defecto.
2. Un `CheckBox` llamado `favoritaCheckBox` con el texto `"Marcar como favorita ⭐"`.
3. Al registrar, muestra en el área de mensajes algo como:

```text
Pikachu (Pokémon) registrada correctamente. Edición: Base. Favorita: sí.
```

4. **Desafío:** agrega una columna **"Favorita"** a la tabla que muestre `"Sí"` o `"No"` según la casilla elegida al momento de registrar.

> **Pista:** el `CheckBox` no forma parte del modelo `Carta`, así que su valor debes guardarlo en una estructura paralela (por ejemplo, un `Map<Carta, Boolean>`) para que la columna pueda consultarlo. Reflexiona: ¿por qué no puedes obtenerlo directamente del modelo ni del JSON sin modificarlos?

**Desafío extra:** deshabilita el `CheckBox` de favorita cuando la edición sea `Escarlata-Púrpura`, usando un listener sobre `edicionComboBox.valueProperty()`.

---

## 25. Resumen

1. `ComboBox` = elegir **una** opción de una lista; se lee con `getValue()`.
2. `CheckBox` = una condición **independiente** sí/no; se lee con `isSelected()`.
3. Ambos deben declararse en el FXML con `fx:id` y en el controlador con `@FXML`.
4. Las opciones del `ComboBox` se cargan en `initialize()` y conviene dejar una selección por defecto.
5. Para reaccionar a cambios: `setOnAction` (solo usuario) o listener de la propiedad (cualquier cambio).
6. `setDisable(true)` no borra el valor: si un control deja de aplicar, **límpialo**.
7. Los valores de los controles se leen **al registrar** y se usan para construir el objeto.
8. Después de registrar, resetea los controles para que la siguiente carta no herede datos.

# GUION — De cero a tu app JavaFX en IntelliJ

**Duración:** 6:20 (380 s · 11 400 frames · 30 fps · 1920×1080)
**Público:** primer año, segundo semestre de Informática. Sabe Java básico; nunca creó un proyecto JavaFX ni sabe qué es `module-info.java`.
**Formato:** sin narración. Todo se explica con títulos, etiquetas, código anotado y subtítulos *lower-third*.
**Objetivo:** que el estudiante pueda crear el proyecto en IntelliJ, configurar el archivo de módulo, conectar la vista con el controlador, entender **quién crea cada control y en qué momento se inicializa**, ubicar cada responsabilidad en su capa y reconocer los errores más comunes.

---

## Mapa de capítulos

| # | Tiempo | Capítulo | Qué resuelve |
|---|---|---|---|
| — | 0:00–0:12 | Introducción | Promesa y recorrido |
| 01 | 0:12–0:56 | Crear el proyecto en IntelliJ | New Project, Maven, JDK 21, estructura, `pom.xml`, ejecutar |
| 02 | 0:56–1:52 | `module-info.java` y el error de `opens` | Por qué FXML necesita `opens`, `requires`, `exports` |
| 03 | 1:52–2:38 | Vista ↔ Controlador | `fx:controller`, `fx:id`, `@FXML`, `onAction` |
| 04 | 2:38–3:58 | **Atributo, constructor e `initialize()`** | Quién crea el ComboBox y la TableView, y dónde se configuran |
| 05 | 3:58–4:54 | Patrón de capas y responsabilidades | Qué hace y qué no hace cada capa |
| 06 | 4:54–5:28 | Cómo organizar el proyecto | Paquetes, recursos y dirección de dependencias |
| 07 | 5:28–6:08 | Errores comunes | 6 errores: síntoma, causa y solución |
| 08 | 6:08–6:20 | Cierre | Checklist final |

---

## Escena 1 · Introducción (0:00–0:12)

**En pantalla**
- Título: «De cero a tu app en IntelliJ».
- Subtítulo: «Proyecto, `module-info`, vista y controlador, inicialización de controles, capas y errores. Sin saltarse pasos.»
- 4 tarjetas de recorrido: `01 Proyecto` · `02 module-info` · `03 Vista + Controlador` · `04 Inicializar y capas`.
- Nota: «6 minutos · ritmo lento · cada error tiene su porqué».

**Lower-third (4.4 s – 8.9 s)**
> Al final tendrás un proyecto que compila, abre la ventana y guarda datos.

---

## Escena 2 · Crear el proyecto en IntelliJ (0:12–0:56)

### 2A · El asistente (0:12–0:31)

**En pantalla** — mock de la ventana *New Project* de IntelliJ:
- Name: `PokedexCartas`
- Location: `~/IdeaProjects/PokedexCartas`
- Language: `Java`
- Build system: `Maven`
- JDK: `21 (Oracle OpenJDK 21)`
- Add sample code: desactivado
- Botón `Create`

**Pasos a la derecha**
1. `File → New → Project…`
2. Nombre y ubicación.
3. Build system: **Maven** (no Gradle).
4. JDK 21 y `Create`.

**Lower-thirds**
- 12.6 s – 20.0 s → «File → New → Project. Elige Java y Maven: Maven descarga JavaFX y Gson por ti.»
- 20.0 s – 30.5 s → «JDK 21 y “Add sample code” desactivado: partimos de un proyecto limpio.»

### 2B · Estructura, `pom.xml` y ejecución (0:31–0:56)

**En pantalla** — árbol real del proyecto:
```
PokedexCartas/
├─ src/main/java/cl/duoc/pokedex/
│  ├─ App.java
│  ├─ Launcher.java
│  ├─ controller/PokedexController.java
│  ├─ model/Carta.java · CartaPokemon.java
│  ├─ repository/CartaRepository.java
│  └─ dao/CartaDaoJson.java
├─ src/main/resources/cl/duoc/pokedex/view/
│  └─ pokedex-view.fxml
└─ pom.xml
```

**En pantalla** — fragmento de `pom.xml`:
```xml
<dependency>
  <groupId>org.openjfx</groupId>
  <artifactId>javafx-controls</artifactId>
</dependency>
<dependency>
  <groupId>org.openjfx</groupId>
  <artifactId>javafx-fxml</artifactId>
</dependency>
```
Nota: «+ Gson 2.11.0 · javafx-maven-plugin».

**En pantalla** — ejecutar:
```
mvn javafx:run
BUILD SUCCESS · ventana abierta
```

**Lower-thirds**
- 32.6 s – 41.5 s → «Maven administra las dependencias: JavaFX y Gson se descargan solos al sincronizar.»
- 41.5 s – 50.0 s → «El código va en `src/main/java`; el FXML en `src/main/resources`, con la misma ruta del paquete.»
- 50.0 s – 55.4 s → «Ejecuta con `mvn javafx:run` o con el botón Run de IntelliJ.»

---

## Escena 3 · `module-info.java` y el error de `opens` (0:56–1:52)

### 3A · El error (0:56–1:16)

**En pantalla** — consola en rojo:
```
Exception in Application start method
Caused by: java.lang.IllegalAccessException:
  module cl.duoc.pokedex does not
  "opens cl.duoc.pokedex.controller"
  to module javafx.fxml
  at javafx.fxml.FXMLLoader…
```

**Tarjeta «¿Por qué?»**
- FXML no hace `new PokedexController()`: lo crea por **reflexión**.
- La reflexión necesita permiso explícito del módulo.
- Ese permiso se escribe en `module-info.java`.

**Lower-thirds**
- 56.6 s – 66.0 s → «Este es el error más común al empezar: el módulo no abre el paquete del controlador a `javafx.fxml`.»
- 66.0 s – 75.5 s → «FXML crea el controlador por reflexión; sin `opens`, la JVM bloquea el acceso.»

### 3B · El archivo `module-info.java` (1:16–1:36)

```java
module cl.duoc.pokedex {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.google.gson;

    opens cl.duoc.pokedex.controller
        to javafx.fxml;

    opens cl.duoc.pokedex.model
        to com.google.gson;

    exports cl.duoc.pokedex;
}
```

**Leyenda**
- `requires` (azul): «mi módulo necesita este módulo».
- `opens … to` (verde): «permite reflexión solo a ese módulo».
- `exports` (ámbar): «hace público un paquete».

**Lower-thirds**
- 76.4 s – 86.0 s → «`requires` declara lo que necesitas; `opens … to` autoriza la reflexión; `exports` publica un paquete.»
- 86.0 s – 95.5 s → «Abre solo lo necesario: el controlador a `javafx.fxml` y el modelo a Gson.»

### 3C · `opens` vs `exports` (1:36–1:52)

| Directiva | Qué permite | Cuándo usarla |
|---|---|---|
| `requires` | Usar otro módulo | JavaFX, FXML, Gson |
| `opens … to` | Acceso por reflexión | FXML → controlador · Gson → modelo |
| `exports` | Acceso público normal | Solo si otro módulo importa tus clases |

**Lower-thirds**
- 96.4 s – 104.0 s → «`exports` no reemplaza a `opens`: uno publica clases, el otro permite reflexión.»
- 104.0 s – 111.4 s → «Si el error menciona un paquete, abre ese paquete al módulo que lo pide.»

---

## Escena 4 · Vista ↔ Controlador (1:52–2:38)

### 4A · El mapa de conexiones (1:52–2:11)

| En el FXML | Une | En el controlador |
|---|---|---|
| `fx:controller="cl.duoc.pokedex.controller.PokedexController"` | crea el controlador | `public class PokedexController` |
| `<ComboBox fx:id="categoriaComboBox"/>` | mismo nombre | `@FXML private ComboBox<String> categoriaComboBox;` |
| `onAction="#registrarCarta"` | método anotado | `@FXML private void registrarCarta() { … }` |

**Lower-thirds**
- 112.6 s – 121.0 s → «`fx:controller` apunta a la clase; `fx:id` debe coincidir con el campo; `onAction` con el método.»
- 121.0 s – 130.5 s → «Si un nombre no coincide, el campo queda en `null` o el botón no hace nada.»

### 4B · `initialize()` y el método del botón (2:11–2:30)

**FXML**
```xml
<VBox fx:controller="cl.duoc.pokedex.controller.PokedexController">
    <ComboBox fx:id="categoriaComboBox"/>
    <Button text="Registrar" onAction="#registrarCarta"/>
</VBox>
```

**Controlador**
```java
@FXML private ComboBox<String> categoriaComboBox;

@FXML
public void initialize() {
    categoriaComboBox.setItems(...);
}

@FXML
private void registrarCarta() {
    // se ejecuta al presionar el botón
}
```

**Reglas**
1. `fx:controller` usa el nombre completo de la clase.
2. `fx:id` = nombre exacto del campo `@FXML`.
3. `onAction` = nombre exacto del método `@FXML` (puede ser `private`).
4. `initialize()` corre **después** de inyectar los campos.

**Lower-thirds**
- 132.6 s – 141.0 s → «`initialize()` se ejecuta al cargar la vista, cuando los campos `@FXML` ya están listos.»
- 141.0 s – 149.4 s → «El método de `onAction` puede ser privado, pero debe llamarse igual y llevar `@FXML`.»

### 4C · Qué pasa al hacer clic (2:30–2:38)

Flujo en 5 chips: `Button` → `onAction` → `Controlador` → `Repository/DAO` → `TableView`.

**Lower-third**
- 150.2 s – 157.4 s → «Un clic recorre las capas y vuelve a la tabla: la vista nunca guarda datos por su cuenta.»

---

## Escena 4 bis · Atributo, constructor e `initialize()` (2:38–3:58)

> El capítulo que responde: *¿por qué el ComboBox va declarado arriba, se llena en `initialize()` y no en el constructor?*

### 4 bis.1 · Orden de ejecución (2:38–2:58)

**En pantalla** — 4 pasos numerados:

| # | Paso | Qué ocurre |
|---|---|---|
| 1 | `new PokedexController()` | FXMLLoader instancia la clase. Los campos `@FXML` todavía valen `null`. |
| 2 | FXML crea los controles | El loader lee el archivo y construye cada control del layout. |
| 3 | Inyección de campos | Por reflexión, JavaFX asigna cada control al campo con el mismo `fx:id`. |
| 4 | JavaFX llama `initialize()` | Los campos ya existen: aquí se configuran. Después se muestra la ventana. |

**Panel derecho — el campo cambia de estado**
```
categoriaComboBox   null
categoriaComboBox   ComboBox@1a2b
categoriaComboBox   3 opciones · listo
```
Nota: «Si tocas el campo antes del paso 3: `NullPointerException`.»

**Lower-thirds**
- 158.6 s – 167.0 s → «FXMLLoader crea el controlador, crea los controles y los inyecta: todo antes de `initialize()`.»
- 167.0 s – 177.4 s → «Por eso el constructor no sirve para tocar un `ComboBox`: en ese momento el campo todavía es `null`.»

### 4 bis.2 · ComboBox: declarar vs configurar (2:58–3:22)

**En pantalla**
```java
// ATRIBUTO: solo se declara, no se crea
@FXML private ComboBox<String> categoriaComboBox;

// initialize(): JavaFX ya lo inyectó
@FXML
public void initialize() {
    categoriaComboBox.setItems(
        FXCollections.observableArrayList(
            "Pokémon", "Energía", "Entrenador"));
    categoriaComboBox.getSelectionModel()
        .selectFirst();
}
```

**Panel «¿Por qué no en el constructor?»**
- ✗ El constructor corre **antes** de que FXML inyecte los campos.
- ✗ `categoriaComboBox` todavía es `null`: cualquier llamada falla.
- ✓ `initialize()` corre **después** de inyectar y **antes** de mostrar la ventana.

**Código incorrecto**
```java
public PokedexController() {
    categoriaComboBox.setItems(...);
    // ✗ NullPointerException
}
```

**Resultado:** `getValue()` → `"Pokémon"`.

**Lower-thirds**
- 177.6 s – 189.5 s → «El atributo **declara** el control; `initialize()` lo **configura**: opciones y selección.»
- 189.5 s – 201.6 s → «`initialize()` se ejecuta una vez, después de la inyección y antes de que aparezca la ventana.»

### 4 bis.3 · TableView: columnas y datos (3:22–3:46)

**En pantalla**
```java
@FXML private TableView<Carta> cartasTable;
@FXML private TableColumn<Carta, String> nombreColumn;
@FXML private TableColumn<Carta, String> valorColumn;

@FXML
public void initialize() {
    nombreColumn.setCellValueFactory(
        c -> new SimpleStringProperty(c.getValue().getNombre()));
    valorColumn.setCellValueFactory(
        c -> new SimpleStringProperty("$"
            + c.getValue().calcularValorEstimado()));
    cartasTable.setItems(cartas);
}
```

**Panel derecho — tabla resultante**
```
Nombre           Valor
Pikachu          $4.200
Energía Fuego    $1.200
```
Notas:
- «La columna también es un campo `@FXML`: si su `fx:id` no coincide, queda en `null`.»
- «El valor no se guarda: lo calcula el modelo con `calcularValorEstimado()`.»

**Lower-thirds**
- 201.6 s – 213.5 s → «La `TableView` también se declara como campo y se arma en `initialize()`: columnas, factories y datos.»
- 213.5 s – 225.6 s → «Cada columna es un campo `@FXML` con su `fx:id`: si no coincide, la columna queda en `null`.»

### 4 bis.4 · Regla de oro (3:46–3:58)

| Dónde | Qué va ahí | Por qué |
|---|---|---|
| **Atributo** | Declarar los `@FXML`; listas con `new`. | FXML llena los `@FXML`; las listas existen desde el inicio. |
| **Constructor** | Dependencias que no son de la vista. | Corre antes de la inyección: no toques controles. |
| **`initialize()`** | Items, columnas, selección, listeners. | Corre después de inyectar y antes de mostrar. |
| **`onAction`** | Reaccionar al clic del usuario. | La ventana ya está visible y los datos cargados. |

**Frase final:** «Si el FXML tiene `fx:id`, **no** lo crees con `new`: el objeto lo crea el FXML.»

**Lower-third**
- 225.6 s – 237.4 s → «Atributo: declara. Constructor: dependencias. `initialize()`: configura. `onAction`: reacciona.»

---

## Escena 5 · Patrón de capas y responsabilidades (3:58–4:54)

**En pantalla** — pila de 5 capas, cada una con «HACE» y «NO HACE»:

| Capa | HACE | NO HACE |
|---|---|---|
| **App / Launcher** | Arranca JavaFX y carga el FXML. | Lógica de negocio. |
| **Vista** (`pokedex-view.fxml`) | Declara controles, layout y eventos. | Validar ni guardar datos. |
| **Controlador** | Recibe eventos, valida y actualiza la tabla. | Leer o escribir archivos. |
| **Modelo** (`Carta`, `CartaPokemon`, `CartaEnergia`) | Datos, reglas y `calcularValorEstimado()`. | Conocer JavaFX o JSON. |
| **Repository + DAO** | Colección en memoria y persistencia con Gson. | Mostrar mensajes o tocar la vista. |

**Franja final:** «Dirección de dependencias: Vista → Controlador → Modelo / Repository → DAO → JSON».

**Lower-thirds**
- 238.6 s – 252.0 s → «Cada capa tiene una sola responsabilidad: si una hace dos cosas, algo está mal ubicado.»
- 252.0 s – 266.0 s → «La vista declara; el controlador coordina; el modelo decide; el repository y el DAO guardan.»
- 266.0 s – 280.0 s → «El controlador nunca lee archivos: delega en Repository, que usa el DAO con Gson.»
- 280.0 s – 293.4 s → «El modelo no conoce JavaFX: por eso se puede probar y reutilizar sin la interfaz.»

---

## Escena 6 · Cómo organizar el proyecto (4:54–5:28)

**En pantalla** — árbol de paquetes:
```
cl.duoc.pokedex
├─ App.java  ·  Launcher.java
├─ controller/   eventos y validación
├─ model/        datos y reglas
├─ repository/   colección en memoria
├─ dao/          lectura y escritura JSON
└─ view/         pokedex-view.fxml (resources)
```

**Reglas**
- Un paquete por responsabilidad.
- Nombres en singular: `Carta`, `CartaDaoJson`.
- El FXML vive en `src/main/resources` con la ruta del paquete.
- El modelo **no** importa `javafx.*`.
- La vista no importa `java.io.*`.

**Lower-thirds**
- 294.6 s – 304.0 s → «Organiza por responsabilidad, no por tipo de archivo. Un paquete por capa.»
- 304.0 s – 313.4 s → «El FXML va en `resources` con la misma ruta del paquete; el modelo no importa JavaFX.»
- 313.4 s – 327.4 s → «La dependencia siempre baja: vista → controlador → modelo/repository → DAO. Nunca al revés.»

---

## Escena 7 · Errores comunes (5:28–6:08)

| # | Síntoma | Causa | Solución |
|---|---|---|---|
| 01 | `JavaFX runtime components are missing` | Ejecutar sin el plugin o sin el módulo | `mvn javafx:run` o configurar el módulo |
| 02 | `does not "opens ... to module javafx.fxml"` | Falta `opens` del controlador | `opens cl.duoc.pokedex.controller to javafx.fxml;` |
| 03 | `Controller method not found` | `onAction` no coincide o no tiene `@FXML` | Igualar el nombre y anotar el método |
| 04 | `NullPointerException` en `initialize()` | `fx:id` distinto al campo | Mismo nombre en FXML y Java |
| 05 | `Location is not set` | Ruta del FXML incorrecta | `getResource("/cl/duoc/pokedex/view/pokedex-view.fxml")` |
| 06 | Gson no puede acceder a los campos | Falta `opens` del modelo | `opens cl.duoc.pokedex.model to com.google.gson;` |

**Lower-thirds**
- 328.6 s – 341.0 s → «“JavaFX runtime components are missing” se arregla ejecutando con `mvn javafx:run`.»
- 341.0 s – 354.0 s → «Si el error nombra un paquete y un módulo, agrega el `opens` correspondiente.»
- 354.0 s – 367.4 s → «Un `NullPointerException` en `initialize` casi siempre es un `fx:id` mal escrito.»

---

## Escena 8 · Cierre (6:08–6:20)

**En pantalla** — checklist:
1. Proyecto Maven con JDK 21.
2. `module-info` con `requires` y `opens`.
3. `fx:controller` + `fx:id` + `onAction`.
4. Atributo declara · constructor no toca controles · `initialize()` configura.
5. Una responsabilidad por capa.

**Cierre**
- Título: «PokedexCartas».
- Sub: «compila · abre la ventana · guarda datos».
- Pie: «Guion completo en GUION.md».

**Lower-third (373.2 s – 378.7 s)**
> Si algo falla, lee la primera línea del error: casi siempre dice qué módulo o qué nombre no coincide.

---

## Notas de producción

- Sin música ni voz: el vídeo se sigue solo con subtítulos y cambios de foco.
- Cada bloque de código se resalta por líneas; el resto baja a 26 % de opacidad.
- Los ejemplos usan el código real del proyecto (`PokedexController`, `pokedex-view.fxml`, `module-info` compatible, `pom.xml`).
- Fuente del código: `cl.duoc.pokedex` · JavaFX 21.0.6 · Gson 2.11.0.

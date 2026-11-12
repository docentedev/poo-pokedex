# Evaluación Parcial 2 — Pokédex de Cartas

Aplicación de escritorio en **JavaFX** con persistencia en **JSON** mediante **Gson**, construida sobre el modelo entregado. El objetivo es registrar y eliminar cartas (Pokémon y Energía) desde una única ventana, validando los datos y conservando la información entre ejecuciones.

> **Importante:** las clases del modelo (`Carta`, `CartaPokemon`, `CartaEnergia`, `Evolucionable`) ya vienen implementadas y **no deben modificarse**. La aplicación debe construir la vista, el controlador y la capa de persistencia sobre ese modelo.

---

## 1. Modelo entregado

### CartaPokemon
- Valor base: **$3.000**.
- Si la carta es **brillante** (holográfica), se aplica un bono del **40%**.
- Datos propios: `tipoElemental`, `brillante`, `evolucionActiva`.
- Permite activar su evolución en la colección mediante `activarEvolucion()`.

### CartaEnergia
- Valor base: **$1.000**.
- Si `cantidadEnergia` supera **3,0** puntos, se aplica un recargo del **20%**.
- Dato propio: `cantidadEnergia`.

### Validaciones del modelo
- Nombre: no puede ser nulo ni vacío.
- Año de edición: entre **1996** y **2026**.
- Cantidad: mayor que **cero**.

---

## 2. Requisitos de la solución

### 2.1 Configuración del proyecto
- Mantener JavaFX configurado en `pom.xml`.
- Agregar la dependencia de **Gson**.
- No modificar `Launcher` ni `App`.

### 2.2 Arquitectura MVC + DAO/Repository
El proyecto debe separar responsabilidades en paquetes diferenciados:

- `model`: clases del dominio entregadas.
- `view`: vista declarada en FXML.
- `controller`: lógica de interacción de la ventana.
- `dao`: interfaz DAO y su implementación con Gson.
- `repository`: colección de dominio en memoria y delegación de la persistencia al DAO.

Requisitos específicos:
- Debe existir una **interfaz DAO** con operaciones de lectura y escritura.
- Su implementación debe usar **Gson** y gestionar `pokemons.json` y `energias.json`.
- La clase **Repository** debe mantener una colección en memoria, ofrecer las operaciones usadas por el controlador y delegar la lectura/escritura en el DAO.
- El controlador no debe leer ni escribir archivos directamente.

### 2.3 Ventana única
La aplicación debe abrir una sola ventana con:

- Formulario de registro y botón **Registrar**.
- Tabla con las columnas: **Categoría, Nombre, Año, Cantidad y Valor estimado**.
- Botón **Eliminar** para quitar la carta seleccionada.
- Área de mensajes dentro de la ventana.

### 2.4 Campos del formulario
- Selector de categoría: **Pokémon** o **Energía**.
- Datos comunes: **nombre**, **año de edición** y **cantidad**.
- Datos del Pokémon: **tipo elemental**, **brillante** (sí/no) y **evolución activa** (sí/no).
- Dato de la Energía: **cantidad de energía** (puntos).

Comportamiento dinámico:
- Al cambiar la categoría, solo se habilitan los campos de la subcategoría seleccionada.
- Los campos de la otra subcategoría quedan deshabilitados y no se consideran al registrar.

### 2.5 Validaciones del formulario
Antes de registrar se debe verificar:

- Categoría seleccionada.
- Nombre no vacío ni formado solo por espacios.
- Año entero entre **1996** y **2026**.
- Cantidad entera mayor que **cero**.
- Tipo elemental no vacío ni formado solo por espacios (solo Pokémon).
- Cantidad de energía mayor que **cero**, aceptando decimales (solo Energía).

Si un dato es inválido:
- La carta **no se registra**.
- El área de mensajes indica el campo incorrecto y el motivo.
- Los valores ingresados se conservan para corregirlos.
- La aplicación continúa funcionando sin errores por consola.

### 2.6 Persistencia
Los datos se guardan en la **raíz del proyecto**:

- `pokemons.json`: cartas Pokémon registradas.
- `energias.json`: cartas de Energía registradas.

Comportamiento esperado:
- Al iniciar, cargar automáticamente ambos archivos y mostrar los datos en la tabla.
- Si un archivo no existe, iniciar con la tabla vacía y sin errores.
- Guardar automáticamente después de cada registro o eliminación.
- Lo mostrado en la tabla y lo guardado en los archivos debe coincidir.

### 2.7 Mensajes en la interfaz
El área de mensajes debe informar:

- Registro exitoso, identificando la carta y su categoría.
- Error de validación, indicando el campo y el motivo.
- Eliminación exitosa.
- Intento de eliminar sin selección.
- Error al leer o guardar los archivos.

Cada mensaje reemplaza al anterior. **No se deben usar mensajes por consola.**

---

## 3. Datos de prueba

| Categoría | Nombre | Año | Cantidad | Datos específicos | Valor esperado |
|---|---|---|---|---|---|
| Pokémon | Pikachu | 1998 | 3 | Tipo: Eléctrico · Brillante: sí · Evolución activa: sí | $4.200 |
| Pokémon | Charmander | 2016 | 1 | Tipo: Fuego · Brillante: no · Evolución activa: no | $3.000 |
| Energía | Agua Básica | 2020 | 5 | Energía: 4,0 pts | $1.200 |
| Energía | Planta Básica | 2021 | 2 | Energía: 2,0 pts | $1.000 |

Pruebas finales:
1. Registrar las cuatro cartas y verificar los valores.
2. Presionar **Eliminar** sin seleccionar una fila: debe aparecer el aviso y no cambiar nada.
3. Ingresar un dato inválido: debe aparecer el error y conservarse los valores.
4. Cerrar y reabrir la aplicación: deben aparecer las cuatro cartas.
5. Eliminar la carta Charmander, cerrar y reabrir: Charmander ya no debe aparecer.

---

## 4. Estructura implementada

```text
src/main/java/cl/duoc/pokedex/
├── App.java
├── Launcher.java
├── controller/
│   └── PokedexController.java
├── dao/
│   ├── CartaDao.java
│   └── CartaDaoJson.java
├── model/
│   ├── Carta.java
│   ├── CartaEnergia.java
│   ├── CartaPokemon.java
│   └── Evolucionable.java
└── repository/
    └── CartaRepository.java

src/main/resources/cl/duoc/pokedex/view/
└── pokedex-view.fxml
```

---

## 5. Checklist de cumplimiento

- [x] Dependencia de Gson agregada en `pom.xml`.
- [x] Vista declarada en FXML con formulario, tabla, botones y mensajes.
- [x] Controlador vinculado a la vista mediante `fx:controller` y `@FXML`.
- [x] Selector de categoría con opciones Pokémon y Energía.
- [x] Campos comunes y campos específicos de cada subcategoría.
- [x] Habilitación/deshabilitación dinámica de campos según la categoría.
- [x] Tabla con colección observable y columnas Categoría, Nombre, Año, Cantidad y Valor estimado.
- [x] Valor obtenido desde `calcularValorEstimado()` del modelo.
- [x] Validaciones de campos obligatorios, año, cantidad, tipo elemental y cantidad de energía.
- [x] Mensajes de éxito, error, eliminación, falta de selección y errores de archivo.
- [x] Interfaz DAO con operaciones de lectura y escritura.
- [x] Implementación del DAO con Gson para `pokemons.json` y `energias.json`.
- [x] Clase Repository con colección en memoria y delegación al DAO.
- [x] Carga automática al iniciar.
- [x] Guardado automático después de registrar y eliminar.
- [x] Archivos inexistentes manejados como listas vacías, sin errores.
- [x] Modelo entregado sin modificaciones.
- [x] Proyecto compila correctamente.

---

## 6. Operaciones incluidas

El enunciado solicita únicamente:

1. **Cargar** los datos al iniciar.
2. **Registrar** una carta.
3. **Eliminar** la carta seleccionada.
4. **Guardar** automáticamente después de registrar o eliminar.

No se solicita editar cartas, búsqueda, filtros ni un botón de guardado manual.

---

## 7. Ejecución

Desde la raíz del proyecto:

```bash
mvn javafx:run
```

También se puede ejecutar la clase `cl.duoc.pokedex.Launcher` desde IntelliJ IDEA.

---

## 8. Guía paso a paso

Si necesitas construir este proyecto desde cero, incluyendo todo el código explicado y los conceptos nuevos (campos calculados, `ComboBox`, `CheckBox` y persistencia en dos archivos con Gson), sigue [docs/GUIA.md](docs/GUIA.md).

# Enunciado evaluación parcial 2
## Programación Orientada a Objetos

| Sigla | Asignatura | Experiencia de Aprendizaje |
|---|---|---|
| DSY1102 | Programación Orientada a Objetos | EA2: Desarrollo de Interfaces Gráficas con Persistencia en Archivo |

| Tiempo | Modalidad de Trabajo | Indicadores de logro |
|---|---|---|
| 3 bloques | Individual | IL 2.1 al IL 2.8 |

---

## Condiciones de la evaluación

### Del entorno y la entrega

- La evaluación es de carácter individual. No está permitida ninguna forma de colaboración entre estudiantes.
- No se permite el acceso a internet ni el uso de teléfonos, relojes inteligentes ni ningún otro dispositivo externo.
- El programa debe compilar y ejecutarse correctamente. Una solución que no compile no permite evidenciar ningún indicador de logro.
- El proyecto debe entregarse comprimido en formato ZIP, con tu nombre completo como nombre del archivo, en la actividad habilitada en AVA antes de que finalice la sesión.
- No se aceptan entregas por ningún otro medio ni fuera del horario establecido. La ausencia de entrega en AVA genera automáticamente la nota mínima.

### De tu solución

- El código debe organizarse en clases separadas, respetando las convenciones de nomenclatura de Java: PascalCase para nombres de clase, camelCase para métodos y atributos.
- Puedes crear métodos o clases auxiliares siempre que no contradigan los requerimientos del caso.
- No se admite el uso de herramientas de inteligencia artificial ni de recursos digitales externos.
- Cualquier indicio de colaboración no autorizada, uso de IA o plagio implica la anulación inmediata de la evaluación con nota mínima de 1.0.

### Instrucciones de entrega

- Comprime el proyecto completo (todas las clases) en un único archivo ZIP.
- Nombra el archivo con tu nombre completo, sin espacios ni tildes (ejemplo: `Juan_Perez_Lopez.zip`).
- Sube el archivo a la actividad de entrega habilitada en AVA antes de que finalice la sesión asignada.
- No se aceptan entregas por correo electrónico, USB ni ningún otro medio.
- La ausencia de entrega en AVA genera automáticamente la nota mínima, independientemente del avance de la solución.

---

## 1. Contexto del caso

La tienda de coleccionismo **CartaMon** ya cuenta con el modelo de clases desarrollado en la evaluación anterior: el sistema distingue **cartas Pokémon** y **cartas de Energía**, calcula el valor estimado de cada carta según su tipo, y permite activar la evolución de las cartas Pokémon dentro de la colección. Sin embargo, ese sistema solo funciona por consola y la información se pierde cada vez que el programa se cierra.

La administración de la tienda ha solicitado transformarlo en una aplicación de escritorio de una sola ventana, que permita al personal de inventario registrar y eliminar cartas, y que conserve la información en archivos para que esté disponible la próxima vez que se abra la aplicación.

### Proyecto base

Al inicio de la evaluación, el/la docente te entregará un proyecto Maven con la configuración inicial, la clase de arranque y el modelo ya implementado y probado, correspondiente al diagrama siguiente. Tu trabajo consiste en construir sobre ese modelo la interfaz gráfica y el almacenamiento en archivos. **No debes reescribir ni reemplazar las clases entregadas.**

El modelo entregado ya aplica las siguientes reglas:

- **Carta Pokémon**: valor base de **$3.000**. Si la carta es **brillante** (holográfica), el valor se incrementa en un **40%**.
- **Carta de Energía**: valor base de **$1.000**. Si la cantidad de energía supera **3,0** puntos, el valor se incrementa en un **20%**.

**Datos comunes**: el nombre no puede ser nulo ni vacío, el año de edición debe estar entre **1996** y **2026** y la cantidad debe ser mayor que **cero**. Si un dato no cumple, el modelo lo rechaza con un mensaje que explica el motivo.

---

## 2. Estructura del proyecto

La solución debe separar responsabilidades según el patrón **Modelo-Vista-Controlador**, con una capa de acceso a datos basada en el patrón **DAO/Repository**. El proyecto debe contener, como mínimo:

- **Configuración del proyecto**: el proyecto base ya incluye las dependencias de JavaFX y la clase de arranque de la aplicación. Debes agregar al archivo `pom.xml` la dependencia de la librería **Gson** disponible en el laboratorio, necesaria para trabajar con archivos JSON.
- Distribución de paquetes y responsabilidades acorde al patrón de diseño.

---

## 3. Ventana de la aplicación

Al ejecutar la aplicación se abre una única ventana, desde la cual se realizan todas las acciones. La ventana debe contener:

- Un **formulario de registro** con los campos descritos más abajo y un botón **Registrar**.
- Una **tabla** con las cartas registradas y las columnas **Categoría, Nombre, Año, Cantidad y Valor estimado**. El valor que se muestra es el que calcula el modelo para cada carta.
- Un botón **Eliminar**, que quita del registro la carta seleccionada en la tabla. Si no hay una fila seleccionada, la aplicación informa que se debe seleccionar una carta y no realiza ningún cambio.
- Un **área de mensajes** dentro de la misma ventana, donde se informa el resultado de cada acción: registro exitoso, dato no válido, eliminación, falta de selección o error al leer o guardar los archivos. Cada mensaje reemplaza al anterior. **Los mensajes no se muestran por consola.**

### Campos del formulario

- Un selector de tipo con las opciones **Pokémon** y **Energía**.
- Datos comunes: **nombre**, **año de edición** y **cantidad**.
- Datos de la carta Pokémon: **tipo elemental**, si es **brillante** (sí/no) y si tiene la **evolución activa** (sí/no).
- Dato de la carta de Energía: **cantidad de energía** (puntos).

Al cambiar el tipo en el selector, solo quedan habilitados los datos específicos del tipo elegido; los datos del otro tipo quedan deshabilitados y no se consideran al registrar.

Al presionar **Registrar**, la aplicación valida los datos según la sección 4. Si son correctos, registra la carta, la tabla la muestra de inmediato, el área de mensajes informa la confirmación (por ejemplo: *"Pikachu (Pokémon) registrada correctamente."*) y el formulario queda vacío para un nuevo registro.

---

## 4. Validaciones del formulario

Antes de registrar, el formulario debe verificar los datos ingresados según las siguientes reglas:

- **Tipo**: debe estar seleccionado.
- **Nombre**: no puede estar vacío ni contener solo espacios.
- **Año de edición**: número entero entre **1996** y **2026**.
- **Cantidad**: número entero mayor que **cero**.
- **Tipo elemental** (solo carta Pokémon): no puede estar vacío ni contener solo espacios.
- **Cantidad de energía** (solo carta de Energía): número mayor que **cero**; acepta decimales.

Las reglas de nombre, año de edición y cantidad son las mismas que ya aplica el modelo entregado. Si algún dato no es válido:

- la carta **no se registra**;
- el área de mensajes indica qué campo es incorrecto y por qué;
- los valores ya ingresados se mantienen para que puedan corregirse;
- la aplicación no se detiene ni muestra errores por consola.

---

## 5. Almacenamiento de la información

La información de las cartas debe conservarse entre una ejecución y otra, en formato **JSON**, en la carpeta raíz del proyecto:

- `pokemons.json`: contiene las cartas Pokémon registradas.
- `energias.json`: contiene las cartas de Energía registradas.

El comportamiento esperado es el siguiente:

- Al iniciar, la aplicación carga automáticamente la información de ambos archivos y la muestra en la tabla.
- Si los archivos no existen (por ejemplo, la primera vez que se ejecuta), la aplicación inicia con la tabla vacía y sin mostrar errores.
- Cada vez que se registra o se elimina una carta, los archivos se actualizan automáticamente, sin que el usuario deba presionar un botón para guardar.
- Lo que muestra la tabla y lo guardado en los archivos debe coincidir en todo momento.

---

## 6. Datos de prueba y resultado esperado

Registra desde la aplicación las siguientes cartas:

| Categoría | Nombre | Año | Cantidad | Datos específicos | Valor estimado |
|---|---|---|---|---|---|
| Pokémon | Pikachu | 1998 | 3 | Tipo: Eléctrico · Brillante: sí · Evolución activa: sí | $4.200 |
| Pokémon | Charmander | 2016 | 1 | Tipo: Fuego · Brillante: no · Evolución activa: no | $3.000 |
| Energía | Agua Básica | 2020 | 5 | Energía: 4,0 pts | $1.200 |
| Energía | Planta Básica | 2021 | 2 | Energía: 2,0 pts | $1.000 |

Luego de registrarlas, la ventana debe verse de forma similar a la siguiente:

> *Figura 1. Ventana con las cuatro cartas registradas.* `[pendiente: capturar pantalla real de la app]`

Si se presiona **Eliminar** sin seleccionar una fila, el aviso aparece en la misma ventana:

> *Figura 2. Aviso por falta de selección.* `[pendiente: capturar pantalla real de la app]`

Si un dato del formulario no es válido, el área de mensajes indica el campo con problemas y se mantienen los valores ingresados:

> *Figura 3. Error de validación en el año de edición.* `[pendiente: capturar pantalla real de la app]`

### Verificación de almacenamiento

1. Cierra la aplicación y vuelve a abrirla: la tabla debe mostrar las mismas cuatro cartas.
2. Elimina la carta Charmander, cierra la aplicación y vuelve a abrirla: Charmander ya no debe aparecer.

Las imágenes son referenciales: la distribución, los textos y el estilo de las ventanas pueden variar, siempre que estén presentes todos los elementos solicitados y que los valores calculados sean correctos.

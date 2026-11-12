# AutoFix EP2: Pokedex JavaFX Project

## 🚀 Descripción del proyecto
Este proyecto es una **interfaz gráfica con JavaFX** que muestra una Pokédex interactiva. Los datos de los Pokémon están cargados a partir de archivos JSON y se gestionan a través de un DAO (Data Access Object) que permite obtener y almacenar información de tarjetas y energías.

- **Lógica de negocio**: `Carta`, `CartaPokemon`, `CartaEnergia`, `Evolucionable` y sus repositorios.
- **UI**: `App.java` y `Launcher.java` con un FXML (`pokedex-view.fxml`).
- **Controladores**: `PokedexController.java` gestiona eventos y actualizaciones de la vista.
- **Datos**: `pokemons.json`, `energias.json` y un `pokedex` JSON con la configuración inicial.
- **Construcción**: Maven (`pom.xml`).

## 📚 Tutoriales recomendados
- **IntelliJ JavaFX paso a paso 👉**
  <https://www.youtube.com/watch?v=w67WE4gUzJ8>

- **Controller en JavaFX 👉**
  <https://www.youtube.com/watch?v=jApRmGhjuQE>

- **Análisis del proyecto Pokedex 👉**
  <https://www.youtube.com/watch?v=wpyZahEik5U>

## ⚙️ Instalación y ejecución
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd AutoFix_EP2_Base

# Descargar dependencias y construir
mvn clean package

# Ejecutar
mvn javafx:run
```

> **Nota**: Si usas IntelliJ, abre la carpeta y permite la configuración del módulo JavaFX. Asegúrate de que la SDK sea JDK 17 o superior.

## 📦 Dependencias (Maven)
```xml
<dependency>
    <groupId>org.openjfx</groupId>
    <artifactId>javafx-controls</artifactId>
    <version>17.0.9</version>
</dependency>
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Por favor, crea una rama, realiza tus cambios y abre un pull request. Para más detalles, consulta el archivo `CONTRIBUTING.md`.

## 📄 Licencia
[MIT](LICENSE)

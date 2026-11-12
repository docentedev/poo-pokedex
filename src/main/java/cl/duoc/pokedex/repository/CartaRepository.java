package cl.duoc.pokedex.repository;

import cl.duoc.pokedex.dao.CartaDao;
import cl.duoc.pokedex.dao.CartaDaoJson;
import cl.duoc.pokedex.model.Carta;
import cl.duoc.pokedex.model.CartaEnergia;
import cl.duoc.pokedex.model.CartaPokemon;

import java.util.ArrayList;
import java.util.List;

/**
 * Repository de cartas. Mantiene la colección de dominio en memoria y
 * delega en el DAO la lectura y escritura de los archivos JSON.
 */
public class CartaRepository {

    private final CartaDao dao;
    private final List<Carta> cartas = new ArrayList<>();

    public CartaRepository() {
        this(new CartaDaoJson());
    }

    public CartaRepository(CartaDao dao) {
        this.dao = dao;
    }

    /**
     * Carga desde los archivos todas las cartas y reemplaza la colección en memoria.
     */
    public void cargar() {
        List<Carta> cargadas = new ArrayList<>();
        cargadas.addAll(dao.leerCartasPokemon());
        cargadas.addAll(dao.leerCartasEnergia());

        cartas.clear();
        cartas.addAll(cargadas);
    }

    /**
     * Retorna una copia de la colección de cartas.
     */
    public List<Carta> listar() {
        return new ArrayList<>(cartas);
    }

    /**
     * Agrega una carta y persiste la colección completa. Si el guardado falla,
     * la colección en memoria se mantiene sin cambios.
     */
    public void registrar(Carta carta) {
        List<Carta> actualizadas = new ArrayList<>(cartas);
        actualizadas.add(carta);
        guardar(actualizadas);

        cartas.clear();
        cartas.addAll(actualizadas);
    }

    /**
     * Elimina una carta y persiste la colección completa. Si el guardado falla,
     * la colección en memoria se mantiene sin cambios.
     */
    public void eliminar(Carta carta) {
        List<Carta> actualizadas = new ArrayList<>(cartas);
        if (!actualizadas.remove(carta)) {
            return;
        }
        guardar(actualizadas);

        cartas.clear();
        cartas.addAll(actualizadas);
    }

    private void guardar(List<Carta> lista) {
        List<CartaPokemon> pokemones = new ArrayList<>();
        List<CartaEnergia> energias = new ArrayList<>();

        for (Carta carta : lista) {
            if (carta instanceof CartaPokemon pokemon) {
                pokemones.add(pokemon);
            } else if (carta instanceof CartaEnergia energia) {
                energias.add(energia);
            }
        }

        dao.guardarCartasPokemon(pokemones);
        dao.guardarCartasEnergia(energias);
    }
}

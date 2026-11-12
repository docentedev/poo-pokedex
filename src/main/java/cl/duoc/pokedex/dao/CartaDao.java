package cl.duoc.pokedex.dao;

import cl.duoc.pokedex.model.CartaEnergia;
import cl.duoc.pokedex.model.CartaPokemon;

import java.util.List;

/**
 * Contrato de acceso a datos para las cartas de la colección.
 * Define las operaciones de lectura y escritura sobre los archivos JSON.
 */
public interface CartaDao {

    /**
     * Lee todas las cartas Pokémon almacenadas.
     *
     * @return lista de cartas Pokémon; vacía si el archivo no existe
     */
    List<CartaPokemon> leerCartasPokemon();

    /**
     * Lee todas las cartas de energía almacenadas.
     *
     * @return lista de cartas de energía; vacía si el archivo no existe
     */
    List<CartaEnergia> leerCartasEnergia();

    /**
     * Guarda la lista de cartas Pokémon en su archivo JSON.
     *
     * @param cartas cartas Pokémon a persistir
     */
    void guardarCartasPokemon(List<CartaPokemon> cartas);

    /**
     * Guarda la lista de cartas de energía en su archivo JSON.
     *
     * @param cartas cartas de energía a persistir
     */
    void guardarCartasEnergia(List<CartaEnergia> cartas);
}

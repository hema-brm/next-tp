'use client'

import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface Details {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  stats: {
    HP: number;
    speed: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
  };
  evolutions: {
    name: string;
    pokedexId: number;
  }[];
  types: {
    id: number;
    name: string;
    image: string;
  }[];
}

const DetailsPage = () => {
    const [pokemon, setPokemon] = useState<Details | null>(null);
    const router = useRouter();
    const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchPokemonDetails();
    }
  }, [router.isReady, id]);

  const fetchPokemonDetails = async () => {
    try {
      const resp = await axios.get(
        `https://nestjs-pokedex-api.vercel.app/pokemons/${id}`
      );
      setPokemon(resp.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du Pokémon :", error);
    }
  };

  if (!pokemon) {
    return <p>Chargement...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Retour
      </button>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <img
            src={pokemon.image}
            alt={pokemon.name}
            style={{ width: "200px", height: "200px" }}
          />
          <h1>{pokemon.name}</h1>
        </div>

        <div>
          <h2>Statistiques</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {Object.entries(pokemon.stats).map(([stat, value]) => (
                <tr key={stat}>
                  <td style={{ textTransform: "capitalize", padding: "5px 10px" }}>
                    {stat}
                  </td>
                  <td style={{ padding: "5px 10px", textAlign: "right" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Types</h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {pokemon.types.map((type) => (
            <div
              key={type.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={type.image}
                alt={type.name}
                style={{ width: "50px", height: "50px" }}
              />
              <span>{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Évolutions</h2>
      </div>
    </div>
  );
};

export default DetailsPage;

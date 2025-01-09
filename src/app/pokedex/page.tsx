'use client'

import { useState, useEffect } from "react";
import axios from "axios";

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
};

interface Type {
    id: number;
    name: string;
    image: string;
};

const Pokedex: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [limit, setLimit] = useState<number>(50);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  useEffect(() => {
    fetchPokemons();
    fetchTypes();
  }, [offset, limit]);
  
  useEffect(() => {
    window.addEventListener("scroll", scrollHandle);
    return () => window.removeEventListener("scroll", scrollHandle);
  }, []);
  
  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limit}&offset=${offset}`);

      const promises = resp.data.map(async (pokemon: any) => {

        return {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          types: pokemon.types.map((type: Type) => ({
            id: type.id,
            name: type.name,
            image: type.image
          })),
        };
      });

      const results = await Promise.all(promises);
      setPokemons(results);
    } catch (error) {
      console.error("Erreur lors de la récupération des pokémons :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const resp = await axios.get(`https://nestjs-pokedex-api.vercel.app/types`);
      
      const promises = resp.data.map(async (type: Type) => {
        return {
          id: type.id,
          name: type.name,
        };
      });

      const results = await Promise.all(promises);
      setTypes(results);
    } catch (error) {
      console.error("Erreur lors de la récupération des types de pokémon :", error);
    }
  };

  const scrollHandle = () => {
    if (window.innerHeight + document.documentElement.scrollTop >=document.documentElement.offsetHeight - 10) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const filteredPokemons = () =>{
    return pokemons.filter(
        (pokemon) =>
            pokemon.name.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter ? pokemon.types.some((type) => type.name.toLowerCase() === typeFilter): true)
        );
   };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{textAlign: "center", marginBottom:"20px"}}>POKEDEX</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearch}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <select
          onChange={handleTypeFilter}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
        <option value=""> All selected </option>
        {types.map((type) => (
          <option key={type.id} value={type.name.toLowerCase()}>
            {type.name}
          </option>
        ))}
         
        </select>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={300}>300</option>
          <option value={400}>400</option>
          <option value={500}>500</option>
          <option value={600}>600</option>
          <option value={700}>700</option>
          <option value={800}>800</option>
          <option value={900}>900</option>
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredPokemons().map((pokemon) => (
          <div
            key={pokemon.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              style={{ width: "100px", height: "100px" }}
            />
            <h4>#{pokemon.id}</h4>
            <h3 style={{ textTransform: "capitalize" }}>{pokemon.name}</h3>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
              {pokemon.types.map((type) => (
                <img
                key={type.id}
                src={type.image}
                alt={type.name}
                style={{ width: "25px", height: "25px" }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading && <p>Chargement...</p>}
    </div>
  );
};

export default Pokedex;

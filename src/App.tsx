import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import './App.css';

const GET_POKEMON_NAMES = gql`
  query GetPokemonNames($limit: Int) {
    pokemon_v2_pokemon(limit: $limit) {
      name
      height
      weight
      base_experience
    }
  }
`;

interface Pokemon {
  id: string;
  name: string;
}

function App() {
  const [displayNumber, setDisplayNumber] = useState(20);
  const [filter, setFilter] = useState('');
  const { loading, error, data } = useQuery<{ pokemon_v2_pokemon: Pokemon[] }>(GET_POKEMON_NAMES, {
  });

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      const initialPokemonList = data?.pokemon_v2_pokemon || [];
      setPokemonList(initialPokemonList);
    }
  }, [data]);

  useEffect(() => {
    if (pokemonList.length > 0) {
      setSelectedPokemon(Math.min(9, pokemonList.length - 1));
    }
  }, [pokemonList]);

  const handlePokemonClick = (index: number) => {
    setSelectedPokemon(index === selectedPokemon ? null : index);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredPokemonList = pokemonList.filter((poke) =>
    poke.name.toLowerCase().includes(filter.toLowerCase())
  );

  console.log(selectedPokemon);

  return (
    <div className="App">
      <div className='inputContainer'>
        <div className='displayNumber'>
          <h4>Number of Pokémon to display</h4>
          <input className='numberInput' type='number' value={displayNumber} onChange={(e) => setDisplayNumber(parseInt(e.target.value))} />
        </div>
        <div className='filter'>
          <h4>Search for Pokémon by name</h4>
          <input type='text' value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>
      <div className='pokemonList'>
        <div className='listedElements'>
          <h3>Pokémon Names</h3>
          <ul>
            {filteredPokemonList.slice(0, displayNumber).map((pokemon: Pokemon, index) => (
              <li key={pokemon.id}>
                <button
                  onClick={() => handlePokemonClick(index)}
                  className={index === selectedPokemon ? 'selected' : ''}
                >
                  {pokemon.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className='selectedPokemon'>
          <h3> Selected Pokemon</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
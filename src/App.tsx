import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import './App.css';
//renk değiştirme denemesine başlıyorumadawd
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
  height: number;
  weight: number;
  base_experience: number;
}

function App() {
  const availableColors = ["#ed4e2b", "#0c741f", "#5733FF", "#1a587c", "#f528d6"];
  const [selectedItemColor, setSelectedItemColor] = useState("");
  const [colorIndex, setColorIndex] = useState(0);

  const [displayNumber, setDisplayNumber] = useState(20);
  const [filter, setFilter] = useState('');
  const { loading, error, data } = useQuery<{ pokemon_v2_pokemon: Pokemon[] }>(GET_POKEMON_NAMES, {
  });

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [selectedPokemonInfo, setSelectedPokemonInfo] = useState<Pokemon | null>(null);
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]);

  const handlePokemonClick = (index: number) => {
    const selected: number | null = index;
    setSelectedPokemon(selected);
    setSelectedPokemonInfo(filteredPokemonList[selected]);
  };

  useEffect(() => {
    const selectedColor = availableColors[colorIndex % availableColors.length];
    setSelectedItemColor(selectedColor);
    setColorIndex(colorIndex + 1);
  }, [selectedPokemon, filter]);

  useEffect(() => {
    if (selectedPokemon !== null) {
      setSelectedPokemonInfo(filteredPokemonList[selectedPokemon]);
    } else {
      setSelectedPokemonInfo(null);
    }
  }, [selectedPokemon, filteredPokemonList]);

  useEffect(() => {
    if (data) {
      const initialPokemonList = data?.pokemon_v2_pokemon || [];
      setPokemonList(initialPokemonList);
    }
  }, [data]);

  useEffect(() => {
    const filteredList = pokemonList.filter((poke) =>
      poke.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredPokemonList(filteredList.slice(0, displayNumber));

  }, [filter, displayNumber, pokemonList]);

  useEffect(() => {
    if (filteredPokemonList.length > 0) {
      if (displayNumber < 10) {
        setSelectedPokemon(filteredPokemonList.length - 1);
      } else {
        setSelectedPokemon(Math.min(9, filteredPokemonList.length - 1));
      }
    }
  }, [filteredPokemonList]);



  if (loading) return <p className='loading'>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
            {filteredPokemonList.map((pokemon: Pokemon, index) => (
              <li key={pokemon.id}>
                <button
                  onClick={() => handlePokemonClick(index)}
                  style={{ backgroundColor: index === selectedPokemon ? selectedItemColor : "" }}
                >
                  {pokemon.name}
                </button>
              </li>
            ))}

          </ul>
        </div>
        <div className='selectedPokemon'>
          <h3> Selected Pokemon</h3>
          {selectedPokemonInfo ? (
            <div>
              <p>Name: {selectedPokemonInfo.name}</p>
              <p>Height: {selectedPokemonInfo.height}</p>
              <p>Weight: {selectedPokemonInfo.weight}</p>
              <p>Base Experience: {selectedPokemonInfo.base_experience}</p>
            </div>
          ) : (
            <p>No Pokemon selected.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
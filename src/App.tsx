import React from 'react';
import { gql, useQuery } from '@apollo/client';

//filtre denemesine başlıyorumadwad

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
  const { loading, error, data } = useQuery<{ pokemon_v2_pokemon: Pokemon[] }>(GET_POKEMON_NAMES, {
    variables: { limit: 10 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const pokemonList = data?.pokemon_v2_pokemon || [];
  console.log(pokemonList);

  return (
    <div className="App">
      <h1>Pokémon Names</h1>
      <ul>
        {pokemonList.map((pokemon: Pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

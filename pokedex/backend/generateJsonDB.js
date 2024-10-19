const fs = require("fs");
const axios = require('axios');

async function generateJsonDB() {
  // TODO: fetch data pokemon api dan buatlah JSON data sesuai dengan requirement.
  // json file bernama db.json. pastikan ketika kalian menjalankan npm run start
  // dan ketika akses url http://localhost:3000/pokemon akan muncul seluruh data
  // pokemon yang telah kalian parsing dari public api pokemon
  const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon?limit=120";
  const result = await axios.get(pokemonApiURL);
  const pokemons = result.data.results;
  const parsedPokemons = [];
  for(const pokemon of pokemons) {
    const detail = await axios.get(pokemon.url);
    parsedPokemons.push({
      id: detail.data.id,
      name: detail.data.name,
      types: detail.data.types.map(el => el.type.name),
      abilities: detail.data.abilities.map(el => el.ability.name),
      height: detail.data.height,
      weight: detail.data.weight,
      cries: detail.data.cries,
    })
  }
  let db = fs.readFileSync('db.json');
  db = JSON.parse(db.toString());
  db.pokemon = parsedPokemons;
  fs.writeFileSync('db.json', JSON.stringify(db, null, 4));
}

generateJsonDB();

const pokemonList = document.getElementById("pokemonList");
const newPokemonNameInput = document.getElementById("newPokemonName");
const addPokemonButton = document.getElementById("addPokemon");

async function listPokemon() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
        if (response.ok) {
            const data = await response.json();
            const pokemons = data.results;
            pokemonList.innerHTML = "";
            pokemons.forEach(pokemon => {
                const listItem = document.createElement("li");
                listItem.innerText = pokemon.name;
                pokemonList.appendChild(listItem);
            });
        } else {
            console.error("Erro ao buscar Pokémon.");
        }
    } catch (error) {
        console.error("Erro ao buscar Pokémon: " + error);
    }
}

function addPokemon(newPokemonName) {
    const listItem = document.createElement("li");
    listItem.innerText = newPokemonName;
    pokemonList.appendChild(listItem);
    newPokemonNameInput.value = "";
}

addPokemonButton.addEventListener("click", () => {
    const newPokemonName = newPokemonNameInput.value;
    addPokemon(newPokemonName);
});

listPokemon();

const pokemonList = document.getElementById("pokemonList");

// Função para buscar e listar Pokémon com mais detalhes
async function listPokemonWithDetails() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
        if (response.ok) {
            const data = await response.json();
            const pokemonUrls = data.results;

            pokemonList.innerHTML = "";

            for (const pokemonUrl of pokemonUrls) {
                const response = await fetch(pokemonUrl.url);
                if (response.ok) {
                    const pokemonData = await response.json();
                    const listItem = createPokemonListItem(pokemonData);
                    pokemonList.appendChild(listItem);
                }
            }
        } else {
            console.error("Erro ao buscar Pokémon.");
        }
    } catch (error) {
        console.error("Erro ao buscar Pokémon: " + error);
    }
}

function createPokemonListItem(pokemonData) {
    const listItem = document.createElement("li");

    // Nome do Pokémon
    const nameElement = document.createElement("h2");
    nameElement.innerText = pokemonData.name;

    // ID do Pokémon
    const idElement = document.createElement("p");
    idElement.innerText = `ID: ${pokemonData.id}`;

    // Tipos do Pokémon
    const typesElement = document.createElement("p");
    const types = pokemonData.types.map(type => type.type.name).join(", ");
    typesElement.innerText = `Tipos: ${types}`;

    // Imagem do Pokémon
    const imageElement = document.createElement("img");
    imageElement.src = pokemonData.sprites.front_default;
    imageElement.alt = pokemonData.name;

    listItem.appendChild(nameElement);
    listItem.appendChild(idElement);
    listItem.appendChild(typesElement);
    listItem.appendChild(imageElement);

    return listItem;
}

listPokemonWithDetails();

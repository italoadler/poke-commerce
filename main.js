const pokemonList = document.getElementById("pokemonList");
const cart = document.getElementById("cart");
const cartItems = [];

// Função para buscar e listar Pokémon com detalhes
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
                    // Gere um preço aleatório entre $1 e $100
                    const price = Math.floor(Math.random() * 100) + 1;
                    const listItem = createPokemonListItem(pokemonData, price);
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

function createPokemonListItem(pokemonData, price) {
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

    // Preço do Pokémon
    const priceElement = document.createElement("p");
    priceElement.innerText = `Preço: $${price}`;

    // Botão "Adicionar ao Carrinho"
    const addButton = document.createElement("button");
    addButton.innerText = "Adicionar ao Carrinho";
    addButton.addEventListener("click", () => {
        addToCart(pokemonData.name, price);
    });

    listItem.appendChild(nameElement);
    listItem.appendChild(idElement);
    listItem.appendChild(typesElement);
    listItem.appendChild(imageElement);
    listItem.appendChild(priceElement);
    listItem.appendChild(addButton);

    return listItem;
}

function addToCart(pokemonName, price) {
    cartItems.push({ name: pokemonName, price });
    updateCart();
}

function updateCart() {
    cart.innerHTML = "Carrinho de Compras:";
    if (cartItems.length === 0) {
        cart.innerHTML += " O carrinho está vazio.";
    } else {
        const cartList = document.createElement("ul");
        for (const item of cartItems) {
            const cartItem = document.createElement("li");
            cartItem.innerText = `${item.name} - $${item.price}`;
            cartList.appendChild(cartItem);
        }
        cart.appendChild(cartList);
    }
}

listPokemonWithDetails();

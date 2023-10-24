// Obtém elementos do DOM pelo ID
const pokemonList = document.getElementById("pokemonList");
const cart = document.getElementById("cart");
const cartItems = []; // Array para armazenar itens no carrinho

// Função para buscar e listar Pokémon com detalhes
async function listPokemonWithDetails() {
  try {
    // Faz uma solicitação assíncrona para a API do Pokémon
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
    if (response.ok) {
      // Se a resposta for bem-sucedida, converte-a para JSON
      const data = await response.json();
      const pokemonUrls = data.results; // Obtém URLs de Pokémon

      pokemonList.innerHTML = ""; // Limpa a lista de Pokémon no HTML

      // Itera pelas URLs dos Pokémon
      for (const pokemonUrl of pokemonUrls) {
        const response = await fetch(pokemonUrl.url); // Faz uma solicitação para obter detalhes do Pokémon
        if (response.ok) {
          const pokemonData = await response.json();
          // Gera um preço aleatório entre $1 e $100
          const price = Math.floor(Math.random() * 100) + 1;
          const listItem = createPokemonListItem(pokemonData, price); // Cria um item de lista com detalhes do Pokémon
          pokemonList.appendChild(listItem); // Adiciona o item à lista de Pokémon
        }
      }
    } else {
      console.error("Erro ao buscar Pokémon.");
    }
  } catch (error) {
    console.error("Erro ao buscar Pokémon: " + error);
  }
}

// Função para criar um item de lista com detalhes do Pokémon
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
  priceElement.innerText = `Preço: R$${price}`;

  // Botão "Adicionar ao Carrinho"
  const addButton = document.createElement("button");
  addButton.innerText = "Adicionar ao Carrinho";
  addButton.addEventListener("click", () => {
    addToCart(pokemonData.name, price);
  });

  // Adiciona elementos ao item de lista
  listItem.appendChild(nameElement);
  listItem.appendChild(idElement);
  listItem.appendChild(typesElement);
  listItem.appendChild(imageElement);
  listItem.appendChild(priceElement);
  listItem.appendChild(addButton);

  return listItem;
}

// Função para adicionar Pokémon ao carrinho
function addToCart(pokemonName, price) {
  // Verifica se o Pokémon já existe no carrinho
  const existingItem = cartItems.find(item => item.name === pokemonName);
  if (existingItem) {
    // Aumenta a quantidade se já existir no carrinho
    existingItem.quantity++;
  } else {
    // Adiciona o Pokémon com quantidade 1 se não existir
    cartItems.push({ name: pokemonName, price, quantity: 1 });
  }
  updateCart(); // Atualiza o carrinho
}

// Função para atualizar o carrinho
function updateCart() {
  cart.innerHTML = "Carrinho de Compras:";
  if (cartItems.length === 0) {
    cart.innerHTML += " O carrinho está vazio.";
  } else {
    const cartList = document.createElement("ul");
    let total = 0; // Variável para totalizar o valor do carrinho

    // Itera pelos itens no carrinho
    for (const item of cartItems) {
      const cartItem = document.createElement("li");
      const name = item.name;
      const price = item.price;
      const quantity = item.quantity;
      const itemTotal = price * quantity;

      cartItem.innerText = `${name} - R$${price} x ${quantity} = R$${itemTotal}`;

      cartList.appendChild(cartItem);
      total += itemTotal; // Adiciona ao total
    }

    cart.appendChild(cartList);

    // Adiciona o valor total ao carrinho
    const totalElement = document.createElement("p");
    totalElement.innerText = `Total: R$${total}`;
    cart.appendChild(totalElement);

    // Botão para limpar o carrinho
    const clearButton = document.createElement("button");
    clearButton.innerText = "Limpar Carrinho";
    clearButton.addEventListener("click", clearCart);
    cart.appendChild(clearButton);
  }
}

listPokemonWithDetails(); // Chama a função para listar Pokémon quando a página carrega

// Função para remover um Pokémon do carrinho
function removeFromCart(pokemonName) {
  const existingItem = cartItems.find(item => item.name === pokemonName);
  if (existingItem) {
    // Diminui a quantidade se existir no carrinho
    existingItem.quantity--;
    // Remove o item se a quantidade for zero
    if (existingItem.quantity === 0) {
      const index = cartItems.indexOf(existingItem);
      if (index > -1) {
        cartItems.splice(index, 1);
      }
    }
    updateCart(); // Atualiza o carrinho
  }
}

// Função para limpar o carrinho
function clearCart() {
  cartItems.length = 0; // Limpa o carrinho
  updateCart(); // Atualiza o carrinho
}

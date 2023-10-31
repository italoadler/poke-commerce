const pokemonList = document.getElementById("pokemonList");
const cart = document.getElementById("cart");
const cartItems = [];

// Função para buscar e listar Pokémon com detalhes
async function listPokemonWithDetails() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
    if (response.ok) {
      const data = await response.json();
      console.log(data)
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
  priceElement.innerText = `Preço: R$${price}`;

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
  updateCart();
}

// Função para atualizar o carrinho
function updateCart() {
  cart.innerHTML = "Carrinho de Compras:";
  if (cartItems.length === 0) {
    cart.innerHTML += " O carrinho está vazio.";
  } else {
    const cartList = document.createElement("ul");
    let total = 0; // Variável para totalizar o valor do carrinho

    for (const item of cartItems) {
      const cartItem = document.createElement("li");

      // Adicione um botão de remoção
      const removeButton = document.createElement("button");
      removeButton.innerText = "Remover";
      removeButton.classList.add("remove-button"); // Adicione a classe "remove-button"
      removeButton.addEventListener("click", () => {
        removeFromCart(item.name);
      });

      // Crie um elemento de parágrafo para exibir as informações do item
      const itemInfo = document.createElement("p");
      const name = item.name;
      const price = item.price;
      const quantity = item.quantity;
      const itemTotal = price * quantity;
      itemInfo.innerText = `${name} - R$${price} x ${quantity} = R$${itemTotal}`;

      // Adicione o botão de remoção e informações do item ao item do carrinho
      cartItem.appendChild(removeButton);
      cartItem.appendChild(itemInfo);

      cartList.appendChild(cartItem);
      total += itemTotal; // Adiciona ao total
    }

    cart.appendChild(cartList);

    // Adicione o valor total ao carrinho
    const totalElement = document.createElement("p");
    totalElement.innerText = `Total: R$${total}`;
    cart.appendChild(totalElement);

    // Botão para limpar o carrinho
    const clearButton = document.createElement("button");
    clearButton.innerText = "Limpar Carrinho";
    clearButton.addEventListener("click", clearCart);
    cart.appendChild(clearButton);

    // Botão para finalizar compra
    const checkoutButton = document.createElement("button");
    checkoutButton.innerText = "Finalizar Compra";
    checkoutButton.addEventListener("click", () => {
      alert("Obrigado pela compra!");
      finalizePurchase();
      clearCart();
    });
    cart.appendChild(checkoutButton);

  }
}

listPokemonWithDetails();

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
    updateCart();
  }
}

function clearCart() {
  cartItems.length = 0; // Limpa o carrinho
  updateCart();
}

// function finalizePurchase() {
//   fetch("http://localhost:3001/checkout", {
//     method: "POST",
//     body: JSON.stringify(cartItems),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Erro na resposta do servidor (Status ${response.status})`);
//       }
//       return response.json();
//     })
//     .catch(error => {
//       if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
//         console.error("Erro de rede: Verifique sua conexão com a internet ou a disponibilidade do servidor.");
//       } else if (error.message.includes("CORS")) {
//         console.error("Erro de CORS: O servidor não permite solicitações do domínio do front-end.");
//       } else {
//         console.error("Erro desconhecido: ", error);
//       }
//     });

// }
async function finalizePurchase() {
  try {
    const response = await fetch("http://localhost:3001/checkout", {
      method: "POST",
      body: JSON.stringify(cartItems),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na resposta do servidor (Status ${response.status})`);
    }

    const data = await response.json();
    // Faça algo com os dados (caso necessário)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      console.error("Erro de rede: Verifique sua conexão com a internet ou a disponibilidade do servidor.");
    } else if (error.message.includes("CORS")) {
      console.error("Erro de CORS: O servidor não permite solicitações do domínio do front-end.");
    } else {
      console.error("Erro desconhecido: ", error);
    }
  }
}


// Função para mostrar o pop-up de recibo
function showReceiptPopup(receipt) {
  const receiptDetails = document.getElementById("receiptDetails");

  // Limpe os detalhes do recibo
  receiptDetails.innerHTML = "";

  // Preencha os detalhes do recibo
  const receiptItems = receipt.items.map(item => {
    return `<p>${item.name} - R$${item.price} x ${item.quantity} = R$${item.price * item.quantity}</p>`;
  });

  const total = `<p>Total: R$${receipt.total}</p>`;

  receiptDetails.innerHTML = receiptItems.join("") + total;

  // Exiba o pop-up
  const popup = document.getElementById("receiptPopup");
  popup.style.display = "block";
}

// Função para fechar o pop-up
function closePopup() {
  const popup = document.getElementById("receiptPopup");
  popup.style.display = "none";
}

// Princípio da Responsabilidade Única (SRP)
// Dividimos a lógica em funções com responsabilidades específicas.

// Função para buscar e listar Pokémon com detalhes
async function listPokemonWithDetails() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
      if (response.ok) {
        const data = await response.json();
        const pokemonUrls = data.results;
        pokemonList.innerHTML = "";
        for (const pokemonUrl of pokemonUrls) {
          const response = await fetch(pokemonUrl.url);
          if (response.ok) {
            const pokemonData = await response.json();
            const price = generateRandomPrice(); // Princípio do Aberto/Fechado (OCP)
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
  
  // Função para gerar um preço aleatório
  function generateRandomPrice() {
    return Math.floor(Math.random() * 100) + 1;
  }
  
  // Função para criar um item de Pokémon
  function createPokemonListItem(pokemonData, price) {
    const listItem = document.createElement("li");
    listItem.appendChild(createPokemonInfo(pokemonData, price));
    listItem.appendChild(createAddToCartButton(pokemonData, price));
    return listItem;
  }
  
  // Função para criar informações do Pokémon
  function createPokemonInfo(pokemonData, price) {
    const info = document.createElement("div");
    info.appendChild(createElementWithText("h2", pokemonData.name));
    info.appendChild(createElementWithText("p", `ID: ${pokemonData.id}`));
    info.appendChild(createElementWithText("p", `Tipos: ${getPokemonTypes(pokemonData)}`));
    info.appendChild(createPokemonImage(pokemonData));
    info.appendChild(createElementWithText("p", `Preço: R$${price}`));
    return info;
  }
  
  // Função para criar um botão "Adicionar ao Carrinho"
  function createAddToCartButton(pokemonData, price) {
    const addButton = document.createElement("button");
    addButton.innerText = "Adicionar ao Carrinho";
    addButton.addEventListener("click", () => {
      addToCart(pokemonData.name, price);
    });
    return addButton;
  }
  
  // Função para criar um elemento com texto
  function createElementWithText(tag, text) {
    const element = document.createElement(tag);
    element.innerText = text;
    return element;
  }
  
  // Função para criar a imagem do Pokémon
  function createPokemonImage(pokemonData) {
    const imageElement = document.createElement("img");
    imageElement.src = pokemonData.sprites.front_default;
    imageElement.alt = pokemonData.name;
    return imageElement;
  }
  
  // Função para obter os tipos do Pokémon
  function getPokemonTypes(pokemonData) {
    return pokemonData.types.map(type => type.type.name).join(", ");
  }
  
  // Função para adicionar Pokémon ao carrinho
  function addToCart(pokemonName, price) {
    const existingItem = findCartItem(pokemonName);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ name: pokemonName, price, quantity: 1 });
    }
    updateCart();
  }
  
  // Função para encontrar um item no carrinho
  function findCartItem(pokemonName) {
    return cartItems.find(item => item.name === pokemonName);
  }
  
  // Função para atualizar o carrinho
  function updateCart() {
    cart.innerHTML = "Carrinho de Compras:";
    if (cartItems.length === 0) {
      cart.innerHTML += " O carrinho está vazio.";
    } else {
      const cartList = createCartList();
      cart.appendChild(cartList);
      cart.appendChild(createTotalElement());
      cart.appendChild(createClearButton());
      cart.appendChild(createCheckoutButton());
    }
  }
  
  // Função para criar a lista de itens no carrinho
  function createCartList() {
    const cartList = document.createElement("ul");
    let total = 0;
  
    for (const item of cartItems) {
      const cartItem = createCartItemElement(item);
      cartList.appendChild(cartItem);
      total += item.price * item.quantity;
    }
  
    return cartList;
  }
  
  // Função para criar um elemento de item no carrinho
  function createCartItemElement(item) {
    const cartItem = document.createElement("li");
    cartItem.appendChild(createRemoveButton(item.name));
    cartItem.appendChild(createElementWithText("p", `${item.name} - R$${item.price} x ${item.quantity} = R$${item.price * item.quantity}`));
    return cartItem;
  }
  
  // Função para criar um botão de remoção
  function createRemoveButton(pokemonName) {
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remover";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => {
      removeFromCart(pokemonName);
    });
    return removeButton;
  }
  
  // Função para criar o elemento de total no carrinho
  function createTotalElement() {
    const totalElement = document.createElement("p");
    totalElement.innerText = `Total: R$${calculateTotal()}`;
    return totalElement;
  }
  
  // Função para calcular o total do carrinho
  function calculateTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  
  // Função para criar o botão de limpar o carrinho
  function createClearButton() {
    const clearButton = document.createElement("button");
    clearButton.innerText = "Limpar Carrinho";
    clearButton.addEventListener("click", clearCart);
    return clearButton;
  }
  
  // Função para criar o botão de finalizar compra
  function createCheckoutButton() {
    const checkoutButton = document.createElement("button");
    checkoutButton.innerText = "Finalizar Compra";
    checkoutButton.addEventListener("click", finalizePurchase);
    return checkoutButton;
  }
  
  // Princípio da Inversão de Dependência (DIP)
  // Separamos a lógica de comunicação com o servidor em uma função separada.
  
  async function finalizePurchase() {
    try {
      const response = await sendPurchaseRequest(cartItems);
      handlePurchaseResponse(response);
    } catch (error) {
      handlePurchaseError(error);
    }
  }
  
  async function sendPurchaseRequest(data) {
    const response = await fetch("http://localhost:3001/checkout", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
  
    if (!response.ok) {
      throw new Error(`Erro na resposta do servidor (Status ${response.status})`);
    }
  
    return response.json();
  }
  
  function handlePurchaseResponse(receipt) {
    showReceiptPopup(receipt);
    clearCart();
  }
  
  function handlePurchaseError(error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      console.error("Erro de rede: Verifique sua conexão com a internet ou a disponibilidade do servidor.");
    } else if (error.message.includes("CORS")) {
      console.error("Erro de CORS: O servidor não permite solicitações do domínio do front-end.");
    } else {
      console.error("Erro desconhecido: ", error);
    }
  }
  
  // Função para mostrar o pop-up de recibo
  function showReceiptPopup(receipt) {
    const receiptDetails = document.getElementById("receiptDetails");
    receiptDetails.innerHTML = "";
  
    const receiptItems = receipt.items.map(item => {
      return `<p>${item.name} - R$${item.price} x ${item.quantity} = R$${item.price * item.quantity}</p>`;
    });
  
    const total = `<p>Total: R$${receipt.total}</p>`;
  
    receiptDetails.innerHTML = receiptItems.join("") + total;
  
    const popup = document.getElementById("receiptPopup");
    popup.style.display = "block";
  }
  
  // Função para fechar o pop-up
  function closePopup() {
    const popup = document.getElementById("receiptPopup");
    popup.style.display = "none";
  }
  
  // Inicialização
  const pokemonList = document.getElementById("pokemonList");
  const cart = document.getElementById("cart");
  const cartItems = [];
  
  listPokemonWithDetails();
  
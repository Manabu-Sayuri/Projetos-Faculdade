// URL base para buscar os primeiros 20 pokémons
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

// Elemento container do HTML onde os cards serão inseridos
const pokemonContainer = document.getElementById('pokemon-container');

// Função principal assíncrona para buscar a lista de Pokémons
async function carregarPokemons() {
    try {
        // 1. Requisição HTTP via fetch para obter a lista inicial
        const response = await fetch(API_URL);
        const data = await response.json();

        // 2. Para cada item da lista, busca os detalhes completos do Pokémon
        for (const item of data.results) {
            const pokemonResponse = await fetch(item.url);
            const pokemonData = await pokemonResponse.json();

            // 3. Função responsável por criar e renderizar o Card dinamicamente
            criarCardPokemon(pokemonData);
        }
    } catch (error) {
        console.error('Erro ao consumir a API:', error);
        pokemonContainer.innerHTML = '<p style="color:red;">Erro ao carregar os personagens. Tente novamente mais tarde.</p>';
    }
}

// Função para construir cada Card utilizando estritamente a manipulação do DOM
function criarCardPokemon(pokemon) {
    // A. Criar o container do card
    const card = document.createElement('div');
    card.classList.add('card');

    // B. Criar o cabeçalho do card (Nome + Coração)
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = pokemon.name;

    const favoriteIcon = document.createElement('i');
    favoriteIcon.classList.add('fa-regular', 'fa-heart', 'favorite-icon');
    
    // Funcionalidade interativa para trocar o coração para preenchido ao clicar
    favoriteIcon.addEventListener('click', () => {
        favoriteIcon.classList.toggle('fa-regular');
        favoriteIcon.classList.toggle('fa-solid');
    });

    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(favoriteIcon);

    // C. Criar a caixa central de imagem
    const imageBox = document.createElement('div');
    imageBox.classList.add('card-image-box');

    const img = document.createElement('img');
    // Pega a imagem oficial de alta qualidade da API
    img.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    img.alt = `Imagem do ${pokemon.name}`;

    imageBox.appendChild(img);

    // D. Criar a seção de informações/status adicionais (as linhas do layout)
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    // Extrai os tipos do pokémon
    const tipos = pokemon.types.map(t => t.type.name).join(', ');

    // Criando as linhas de informação usando a estrutura DOM
    const linhaId = criarLinhaInfo(`#${pokemon.id}`);
    const linhaTipo = criarLinhaInfo(`Tipo: ${tipos}`);
    const linhaAltura = criarLinhaInfo(`Altura: ${(pokemon.height / 10).toFixed(1)} m`);
    const linhaPeso = criarLinhaInfo(`Peso: ${(pokemon.weight / 10).toFixed(1)} kg`);

    cardInfo.appendChild(linhaId);
    cardInfo.appendChild(linhaTipo);
    cardInfo.appendChild(linhaAltura);
    cardInfo.appendChild(linhaPeso);

    // E. Montagem final do Card
    card.appendChild(cardHeader);
    card.appendChild(imageBox);
    card.appendChild(cardInfo);

    // F. Inserir o Card pronto no container principal da página
    pokemonContainer.appendChild(card);
}

// Função auxiliar para criar as barras horizontais de informação
function criarLinhaInfo(texto) {
    const div = document.createElement('div');
    div.classList.add('info-line');

    const span = document.createElement('span');
    span.textContent = texto;

    div.appendChild(span);
    return div;
}

// Executa a função inicial ao carregar a página
carregarPokemons();
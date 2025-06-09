const listaPokemon = document.querySelector("#listaPokemon");
const btnCargarMas = document.querySelector("#btnCargarMas");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
let pokemones = [];
let pokemonesFiltrados = [];
let currentPage = 1;
const itemsPerPage = 39;
const pokemon_max = 493;

async function cargarPokemones() {
    const promesas = [];
    for (let i = 1; i <= pokemon_max; i++) {
        promesas.push(fetch(URL + i).then(response => response.json()));
    }
    pokemones = await Promise.all(promesas);
    pokemonesFiltrados = pokemones;
    mostrarPagina(currentPage);
}

function mostrarPagina(page) {

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    
    if(page === 1) {
        listaPokemon.innerHTML = "";
    }    
    const pageItems = pokemonesFiltrados.slice(startIndex, endIndex);
    pageItems.forEach(pokemon => mostrarPokemon(pokemon));
    
    if (endIndex >= pokemonesFiltrados.length) {
        btnCargarMas.style.display = 'none';
    } else {
        btnCargarMas.style.display = 'block';
    }
}

const svgParticle = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="#DAA520">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
</svg>
`;

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');
    let pokeId = poke.id.toString().padStart(3, "0");

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}" data-state="default">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
        </div>
    `;

    if (poke.sprites.other["official-artwork"].front_shiny) {
        const preloadedShiny = new Image();
        preloadedShiny.src = poke.sprites.other["official-artwork"].front_shiny;
    }

    const img = div.querySelector(".pokemon-imagen img");
    img.addEventListener("click", function() {
        img.style.opacity = 0;
        setTimeout(() => {
            if (img.dataset.state === "default") {
                img.src = poke.sprites.other["official-artwork"].front_shiny;
                img.dataset.state = "shiny";
                mostrarParticulaConSonido(div);
            } else {
                img.src = poke.sprites.other["official-artwork"].front_default;
                img.dataset.state = "default";
            }
            img.style.opacity = 1;
        }, 300);
    });

    listaPokemon.append(div);
}

function mostrarParticulaConSonido(card) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="#DAA520">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
      </svg>
    `;
    const imagenContainer = card.querySelector(".pokemon-imagen");
    imagenContainer.appendChild(particle);

    const sonido = new Audio("sounds/shiny-sound.mp3");
    sonido.volume = 0.20;
    sonido.play();

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

btnCargarMas.addEventListener("click", () => {
    currentPage++;
    mostrarPagina(currentPage);
});

botonesHeader.forEach(boton => {
    boton.addEventListener("click", (event) => {
        const botonId = event.currentTarget.id;
        currentPage = 1;

        if (botonId === "ver-todos") {
            pokemonesFiltrados = pokemones;
        } else if (botonId === "kanto") {
            pokemonesFiltrados = pokemones.filter(poke => poke.id <= 151);
        } else if (botonId === "johto") {
            pokemonesFiltrados = pokemones.filter(poke => poke.id >= 152 && poke.id <= 251);
        } else if (botonId === "hoenn") {
            pokemonesFiltrados = pokemones.filter(poke => poke.id >= 252 && poke.id <= 386);
        } else if (botonId === "sinnoh") {
            pokemonesFiltrados = pokemones.filter(poke => poke.id >= 387 && poke.id <= pokemon_max);
        } else {
            pokemonesFiltrados = pokemones.filter(poke =>
                poke.types.some(type => type.type.name === botonId)
            );
        }
        mostrarPagina(currentPage);
    });
});

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const searchInput = document.querySelector('#searchInput');

function filtrarPorNombre() {
    const query = searchInput.value.toLowerCase().replace(/\s/g, '');
    currentPage = 1; 
    if(query === "") {
        pokemonesFiltrados = pokemones;
    } else {
        pokemonesFiltrados = pokemones.filter(poke => 
            poke.name.toLowerCase().replace(/\s/g, '').includes(query)
        );
    }
    listaPokemon.innerHTML = "";
    mostrarPagina(currentPage);
}

searchInput.addEventListener('input', debounce(filtrarPorNombre, 300));

document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(e) {
      document.querySelectorAll(".dropdown").forEach(function(dropdown) {
        if (!dropdown.contains(e.target)) {
          let toggle = dropdown.querySelector(".dropdown-toggle");
          if (toggle) toggle.checked = false;
        }
      });
    });
  
    document.querySelectorAll(".dropdown .nav-item button").forEach(function(button) {
      button.addEventListener("click", function() {
        let dropdown = button.closest(".dropdown");
        if (dropdown) {
          let toggle = dropdown.querySelector(".dropdown-toggle");
          if (toggle) toggle.checked = false;
        }
      });
    });
  });

cargarPokemones();
let pokeDex = document.getElementById("pokeDex");

for (let i = 0; i < userPokemon.length; i++) {
  let currentPokemon = userPokemon[i];
  fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemon}`)
  .then((response) => response.json())
  .then((data) => {
    let pokemonSprite = data.sprites.front_default;

    let hpStat = data.stats.find((stat) => stat.stat.name === "hp").base_stat;

    // Create object for tracking states
    let pokemonData = {
      name: currentPokemon.toUpperCase(),
      number: data.id,
      hp: hpStat,
      types: data.types
      .map((typeInfo) => typeInfo.type.name)
      .join(", "),
    };
    addCard(pokemonSprite, pokemonData);
  });
}

function addCard(sprite, data) {
    let dexCard = document.createElement("div");
    dexCard.classList.add("pokedex-card");
    let numberElement = document.createElement("div");
    numberElement.classList.add("pokedex-number");
    numberElement.textContent = data.number;
    let imgElement = document.createElement("img");
    imgElement.classList.add("pokedex-image");
    imgElement.src = sprite;
    let nameElement = document.createElement("div");
    nameElement.classList.add("pokedex-name");
    nameElement.textContent = data.name;
    let typeElement = document.createElement("div");
    typeElement.classList.add("pokedex-type");
    typeElement.textContent = data.types;
    let hpElement = document.createElement("div");
    hpElement.classList.add("pokedex-type");
    hpElement.textContent = data.hp + " HP";
    pokeDex.appendChild(dexCard);
    dexCard.appendChild(numberElement);
    dexCard.appendChild(imgElement);
    dexCard.appendChild(nameElement);
    dexCard.appendChild(typeElement);
    dexCard.appendChild(hpElement);
}


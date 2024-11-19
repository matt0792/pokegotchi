let isBattleValid = JSON.parse(sessionStorage.getItem("battleValid")) || false;

if (isBattleValid === false) {
  window.location.replace("index.html");
}

let pokeDex = document.getElementById("pokeDex");

let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));

let chosenPokemon;
let enemyPokemonData;
let playerPokemonData;
let enemySprite;
let playerSprite;
let winCoins;

let pokemonSelect = document.getElementById("pokemonSelect");
let enemySelectDisplay = document.getElementById("enemySelect");
let enemySpriteDisplay = document.getElementById("enemySprite");
let enemyNameDisplay = document.getElementById("enemyName");
let enemyStatsDisplay = document.getElementById("enemyStats");
let enemyHpDisplay = document.getElementById("enemyHp");
let introText = document.getElementById("introText");
let battleEvents = document.getElementById("battleEvents");
let coinClaimElement = document.getElementById("coinClaim");
let coinButtonElement = document.getElementById("coinButton");

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
        winCoins: Math.max(0, Math.floor((110 - hpStat) / 2)),
        types: data.types.map((typeInfo) => typeInfo.type.name).join(", "),
      };
      addCard(pokemonSprite, pokemonData);
    });
}

function addCard(sprite, data) {
  let dexCard = document.createElement("div");
  dexCard.classList.add("pokedex-card");
  dexCard.classList.add("combat-card");
  dexCard.setAttribute(
    "onclick",
    `choosePokemon("${data.name}"); chooseAnimation(this); setWinCoins(${data.winCoins})`
  );
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
  let winCoinElement = document.createElement("div");
  winCoinElement.classList.add("pokedex-type");
  winCoinElement.textContent = `Win: + ${data.winCoins} coins`;
  pokeDex.appendChild(dexCard);
  dexCard.appendChild(numberElement);
  dexCard.appendChild(imgElement);
  dexCard.appendChild(nameElement);
  dexCard.appendChild(typeElement);
  dexCard.appendChild(hpElement);
  dexCard.appendChild(winCoinElement);
}

function setWinCoins(winCoinsFromChoice) {
  winCoins = winCoinsFromChoice;
}

function choosePokemon(pokemon) {
  chosenPokemon = String(pokemon).toLowerCase();

  setTimeout(() => {
    battleInit(chosenPokemon);
  }, 1000);
}

function chooseAnimation(card) {
  card.classList.add("choose-animation");
  pokemonSelect.classList.add("fade-out");
}

function battleInit(chosenPokemon) {
  pokemonSelect.classList.add("hidden");
  battleIntro(chosenPokemon);
}

let battleIntroScene = document.getElementById("battleIntroScene");
let playerPokemon = document.getElementById("playerPokemon");
let enemyPokemon = document.getElementById("enemyPokemon");

function battleIntro(chosenPokemon) {
  battleIntroScene.classList.remove("hidden");
  battleIntroScene.classList.add("active");

  fetchPlayerPokemonSprite(chosenPokemon);

  enemyPokemon.classList.add("top-pokemon-slide");
  playerPokemon.classList.add("bottom-pokemon-slide");

  setTimeout(() => {
    battleCommence();
    enemyPokemon.classList.remove("top-pokemon-slide");
    playerPokemon.classList.remove("bottom-pokemon-slide");
  }, 2500);
}

function fetchPlayerPokemonSprite(pokemonName) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
      let pokemonSprite = data.sprites.front_default;

      let hpStat = data.stats.find((stat) => stat.stat.name === "hp").base_stat;

      playerPokemonData = {
        name: data.name.toUpperCase(),
        stats: data.stats,
        sprite: data.sprites.front_default,
        hp: hpStat,
        maxHp: hpStat, // Track maximum HP
        types: data.types
          .map((typeInfo) => typeInfo.type.name.toUpperCase())
          .join(", "),
      };

      playerPokemon.innerHTML = "";

      let playerPokeImage = document.createElement("img");
      playerPokeImage.src = pokemonSprite;
      playerPokeImage.classList.add("battle-pokemon-image");

      // Create HP bar container
      let hpBarContainer = document.createElement("div");
      hpBarContainer.classList.add("hp-bar-container");

      let hpBar = document.createElement("div");
      hpBar.classList.add("hp-bar");
      hpBar.style.width = "100%"; // Start at full width
      hpBarContainer.appendChild(hpBar);

      let pokemonName = document.createElement("div");
      pokemonName.classList.add("enemy-stats");
      pokemonName.innerText = playerPokemonData.name;

      playerPokemon.appendChild(playerPokeImage);
      playerPokemon.appendChild(hpBarContainer);
      playerPokemon.appendChild(pokemonName);

      playerPokemonData.hpBar = hpBar; // Save for dynamic updates
    })
    .catch((error) => console.error("Error fetching Pokémon sprite:", error));
}

function fetchEnemyPokemonData() {
  let randomId = Math.floor(Math.random() * 1000) + 1;

  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    .then((response) => response.json())
    .then((data) => {
      let pokemonSprite = data.sprites.front_default;

      let hpStat = data.stats.find((stat) => stat.stat.name === "hp").base_stat;

      enemyPokemonData = {
        name: data.name.toUpperCase(),
        stats: data.stats,
        sprite: pokemonSprite,
        hp: hpStat,
        maxHp: hpStat, // Track maximum HP
        types: data.types
          .map((typeInfo) => typeInfo.type.name.toUpperCase())
          .join(", "),
      };

      displayEnemyAtSelect(enemyPokemonData, pokemonSprite);
      displayEnemy(enemyPokemonData, pokemonSprite);
      isBattleValid = false;
      sessionStorage.setItem("battleValid", JSON.stringify(isBattleValid));
    })
    .catch((error) =>
      console.error("Error fetching enemy Pokémon sprite:", error)
    );
}

function displayEnemy(data, pokemonSprite) {
  // Create and append the enemy Pokémon image
  let enemyPokeImage = document.createElement("img");
  enemyPokeImage.src = pokemonSprite;
  enemyPokeImage.classList.add("battle-pokemon-image");

  // Create HP bar container
  let hpBarContainer = document.createElement("div");
  hpBarContainer.classList.add("hp-bar-container");

  let hpBar = document.createElement("div");
  hpBar.classList.add("hp-bar");
  hpBar.style.width = "100%";
  hpBarContainer.appendChild(hpBar);

  let pokemonName = document.createElement("div");
  pokemonName.classList.add("enemy-stats");
  pokemonName.innerText = data.name;

  // Append image and HP bar to the enemy display
  enemyPokemon.appendChild(enemyPokeImage);
  enemyPokemon.appendChild(hpBarContainer);
  enemyPokemon.appendChild(pokemonName);

  // Attach hpBar to enemyPokemonData for updates
  enemyPokemonData.hpBar = hpBar;
}

function displayEnemyAtSelect(data, sprite) {
  let enemyPokeImage = document.createElement("img");
  enemyPokeImage.src = sprite;
  enemySpriteDisplay.appendChild(enemyPokeImage);
  enemyNameDisplay.textContent = data.name;
  enemyStatsDisplay.textContent = data.types;
  enemyHpDisplay.textContent = data.hp + " HP";
}

function battleCommence() {
  introText.classList.add("hidden");
  battleEvents.classList.remove("hidden");
  battleEvents.classList.add("battle-events");
  battleActions(
    playerPokemonData.name,
    playerPokemonData.hp,
    enemyPokemonData.name,
    enemyPokemonData.hp
  );
}

let playerTurn = true;

function battleActions(playerName, playerHp, enemyName, enemyHp) {
  if (playerHp <= 0) {
    battleEvents.classList.add("event-update");
    battleEvents.textContent = `${playerName} runs out of HP, battle lost! You lost 10 coins!`;
    playerPokemon.classList.add("lose-anim");
    sessionStorage.setItem(
      "userCoins",
      JSON.stringify(Math.max(0, Math.floor(coinAmount - 10)))
    );
  } else if (enemyHp <= 0) {
    enemyPokemon.classList.add("lose-anim");
    battleEvents.classList.add("event-update");
    battleEvents.textContent = `${enemyName} runs out of HP, battle won! You got ${winCoins} coins!`;
    sessionStorage.setItem("userCoins", JSON.stringify(coinAmount + winCoins));
    coinClaimElement.classList.remove("hidden");
  } else {
    randomAttack(playerName, playerHp, enemyName, enemyHp);
  }

  if (!playerTurn) {
    playerPokemon.classList.add("combat-bounce");
    enemyPokemon.classList.add("combat-shake");
    setTimeout(() => {
      playerPokemon.classList.remove("combat-bounce");
      enemyPokemon.classList.remove("combat-shake");
    }, 400);
  } else {
    enemyPokemon.classList.add("combat-bounce");
    playerPokemon.classList.add("combat-shake");
    setTimeout(() => {
      enemyPokemon.classList.remove("combat-bounce");
      playerPokemon.classList.remove("combat-shake");
    }, 400);
  }
}

function randomAttack(playerName, playerHp, enemyName, enemyHp) {
  battleEvents.classList.add("event-update");
  let action = Math.floor(Math.random() * 1);

  switch (action) {
    case 0:
      attack(playerName, playerHp, enemyName, enemyHp);
      break;
    case 1:
      heal(playerName, playerHp, enemyName, enemyHp);
      break;
  }

  if (playerTurn) {
    playerTurn = false;
  } else {
    playerTurn = true;
  }

  setTimeout(() => {
    battleEvents.classList.remove("event-update");
  }, 500);
}

function attack(playerName, playerHp, enemyName, enemyHp) {
  let damage = Math.floor(Math.random() * 30) + 17;
  let dodgeChance = Math.floor(Math.random() * 10);
  let attacker, defender, hpBar, targetHp, maxHp;

  // Determine attacker and defender
  if (playerTurn) {
    attacker = playerName;
    defender = enemyName;
    targetHp = enemyPokemonData.hp;
    maxHp = enemyPokemonData.maxHp;
    hpBar = enemyPokemonData.hpBar;
  } else {
    attacker = enemyName;
    defender = playerName;
    targetHp = playerPokemonData.hp;
    maxHp = playerPokemonData.maxHp;
    hpBar = playerPokemonData.hpBar;
  }

  // Check if dodge occurs
  if (dodgeChance > 8) {
    battleEvents.textContent = `${defender} evades ${attacker}'s attack!`;
  } else {
    // Apply damage if no dodge
    targetHp = Math.max(0, targetHp - damage);
    battleEvents.textContent = `${attacker} attacks and deals ${damage} damage!`;
    // Update HP bar width
    hpBar.style.width = `${(targetHp / maxHp) * 100}%`;
  }

  // Update the respective HP data
  if (playerTurn) {
    enemyPokemonData.hp = targetHp;
    enemyHp -= damage;
  } else {
    playerPokemonData.hp = targetHp;
    playerHp -= damage;
  }

  if (playerHp <= 0) {
    battleEvents.classList.add("event-update");
    battleEvents.textContent = `${playerName} runs out of HP, battle lost! You lost 10 coins!`;
    playerPokemon.classList.add("lose-anim");
    sessionStorage.setItem(
      "userCoins",
      JSON.stringify(Math.max(0, Math.floor(coinAmount - 10)))
    );

    setTimeout(() => {
      battleIntroScene.classList.add("fade-out");
    }, 900);
    setTimeout(() => {
      window.location.replace("index.html");
    }, 2300);
    return
  } else if (enemyHp <= 0) {
    enemyPokemon.classList.add("lose-anim");
    battleEvents.classList.add("event-update");
    battleEvents.textContent = `${enemyName} runs out of HP, battle won! You got ${winCoins} coins!`;
    sessionStorage.setItem("userCoins", JSON.stringify(coinAmount + winCoins));
    coinClaimElement.classList.remove("hidden");
    return
  }

  setTimeout(() => {
    battleActions(
      playerName,
      playerPokemonData.hp,
      enemyName,
      enemyPokemonData.hp
    );
  }, 1500);
}
fetchPokemon();
fetchEnemyPokemonData();

function coinClaim() {
  battleIntroScene.classList.add("fade-out");
  setTimeout(() => {
    window.location.replace("index.html");
  }, 1500);
}

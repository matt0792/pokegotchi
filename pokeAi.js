let pen = document.getElementById("penSection");

let tutArrow = document.getElementById("tutArrow");

let pArray = JSON.parse(sessionStorage.getItem("userPokemon")) || [];
let milestones = JSON.parse(sessionStorage.getItem("userPokemon")) || [];

let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
let coinDisplay = document.getElementById("currencyAmount");
coinDisplay.textContent = coinAmount;

let statArray = [];

let log = document.getElementById("log");
let logElement = document.getElementById("logElement");

let spawnAmount = pArray.length;

document.addEventListener("DOMContentLoaded", function () {
  if (pArray.length == 0) {
    spawnStarterCoin();
  } else if (pArray.length == 1) {
    newEvent("MILESTONE: Your first Pokémon!");
  } else if (pArray.length % 10 == 0) {
    newEvent(`MILESTONE: ${pArray.length} total Pokémon!`);
  }

  if (pArray.length >= 1) {
    logElement.classList.remove("hidden")
  }

  document.getElementById("fileInput").addEventListener("change", readFile);
});

for (let i = 0; i < spawnAmount; i++) {
  let toSpawn = pArray[i];
  fetch(`https://pokeapi.co/api/v2/pokemon/${toSpawn}`)
    .then((response) => response.json())
    .then((data) => {
      let pokemonSprite = data.sprites.front_default;

      let xLoc = Math.random() * (window.screen.height - 600) + 70;
      let yLoc = Math.random() * (window.screen.width - 200) + 70;

      // Create object for tracking states
      let pokemonData = {
        name: toSpawn,
        hunger: Math.random() * 100,
        x: xLoc,
        y: yLoc,
        imgElement: null,
      };
      statArray.push(pokemonData);
      spawnPokemon(pokemonSprite, xLoc, yLoc, pokemonData);
    });
}

function spawnPokemon(sprite, x, y, pokemonData) {
  // Display sprite
  let imgElement = document.createElement("img");
  imgElement.src = sprite;
  imgElement.classList.add("poke-ai");
  imgElement.style.top = `${x}px`;
  imgElement.style.left = `${y}px`;
  pen.appendChild(imgElement);

  // Store imgElement
  pokemonData.imgElement = imgElement;
}

let actionRate;

function changeRate() {
  let baseInterval = 200;
  let amount = pArray.length;
  let variation = Math.floor(Math.random() * 1000);

  let actionRate = baseInterval + variation;

  setTimeout(randomAction, actionRate);
}

// Start the first action
changeRate();

function randomAction() {
  // Choose random pokemon for action
  let randomIndex = Math.floor(Math.random() * spawnAmount);
  let chosenPokemon = statArray[randomIndex];

  let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
  if (coinAmount >= 20) {
    tutArrow.classList.remove("hidden");
  } 

  // Choose an action
  let action = Math.floor(Math.random() * 10);

  switch (action) {
    case 0:
      move(chosenPokemon);
      break;
    case 1:
      move(chosenPokemon);
      break;
    case 2:
      move(chosenPokemon);
      break;
    case 3:
      emote(chosenPokemon);
      break;
    case 4:
      spin(chosenPokemon);
      break;
    case 5:
      bounce(chosenPokemon);
      break;
    case 6:
      spawnCoin();
      break;
    case 7:
      findCoins(chosenPokemon);
      break;
    case 7:
      move(chosenPokemon);
      break;
    case 8:
      spawnSuperCoin();
      break;
  }
  changeRate();
}

function move(pokemon) {
  let speed = Math.floor(Math.random() * 80) + 20;
  let currentTop = parseInt(pokemon.imgElement.style.top, 10) || 0;
  let currentLeft = parseInt(pokemon.imgElement.style.left, 10) || 0;

  // Define boundaries with a 100px padding from each edge
  const lowerBoundary = window.innerHeight - 500; // Bottom padding
  const upperBoundary = 100; // Top padding
  const rightBoundary = window.innerWidth - 10; // Right padding
  const leftBoundary = 10; // Left padding

  // Random direction: up, down, left, or right
  let direction = Math.floor(Math.random() * 4);

  switch (direction) {
    case 0: // Move up
      if (currentTop > upperBoundary)
        pokemon.imgElement.style.top = `${currentTop - speed}px`;
      break;
    case 1: // Move down
      if (currentTop < lowerBoundary)
        pokemon.imgElement.style.top = `${currentTop + speed}px`;
      break;
    case 2: // Move left
      if (currentLeft > leftBoundary)
        pokemon.imgElement.style.left = `${currentLeft - speed}px`;
      break;
    case 3: // Move right
      if (currentLeft < rightBoundary)
        pokemon.imgElement.style.left = `${currentLeft + speed}px`;
      break;
  }
}

let emoteArray = [
  '<i class="bi bi-emoji-expressionless-fill"></i>',
  '<i class="bi bi-emoji-surprise-fill"></i>',
  '<i class="bi bi-heartbreak-fill"></i>',
  '<i class="bi bi-heart-fill"></i>',
  '<i class="bi bi-fire"></i>',
  '<i class="bi bi-hand-thumbs-up-fill"></i>',
  '<i class="bi bi-hand-thumbs-down-fill"></i>',
];

function emote(pokemon) {
  // Select a random emote from the array
  let index = Math.floor(Math.random() * emoteArray.length);
  let emote = emoteArray[index];

  // Create emote element
  let emoteElement = document.createElement("span");
  emoteElement.innerHTML = emote;
  emoteElement.classList.add("emote");

  // Position emote above the Pokémon
  emoteElement.style.position = "absolute";
  emoteElement.style.top = `${parseInt(pokemon.imgElement.style.top) - 40}px`;
  emoteElement.style.left = `${parseInt(pokemon.imgElement.style.left) + 30}px`;

  // Append emote to the pen
  pen.appendChild(emoteElement);

  // Remove the emote after 1 second
  setTimeout(() => {
    emoteElement.remove();
  }, 1000);
}

function spin(pokemon) {
  pokemon.imgElement.classList.add("spin");

  setTimeout(() => {
    pokemon.imgElement.classList.remove("spin");
  }, 700);
}

function bounce(pokemon) {
  pokemon.imgElement.classList.add("bounce");

  setTimeout(() => {
    pokemon.imgElement.classList.remove("bounce");
  }, 400);
}

function spawnCoin() {
  let spawnChance = Math.floor(Math.random() * 10);

  if (spawnChance > 0) {
    // random position for spawn
    let x = Math.random() * (window.screen.height - 600) + 70;
    let y = Math.random() * (window.screen.width - 600) + 300;

    let coinElement = document.createElement("div");
    coinElement.innerHTML = '<i class="bi bi-cash"></i>';
    coinElement.classList.add("coin-spawn");
    coinElement.style.top = `${x}px`;
    coinElement.style.left = `${y}px`;
    coinElement.setAttribute("onclick", `collectCoin(this)`);
    pen.appendChild(coinElement);

    // Despawn
    setTimeout(() => {
      coinElement.remove();
    }, 6000);
  }
}

function collectCoin(coin) {
  let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
  coinAmount += 1;
  coinDisplay.textContent = coinAmount;
  sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
  createCircles(coin);
  newEvent("You found a coin!");
  coin.remove();
}

function createCircles(coinElement) {
  const numCircles = 20; // Number of circles to generate
  const container = document.body; // Parent container for circles

  // Get the position of the coin element
  const coinRect = coinElement.getBoundingClientRect();
  const coinX = coinRect.left + coinRect.width / 2; // X position of the center of the coin
  const coinY = coinRect.top + coinRect.height / 2; // Y position of the center of the coin

  for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement("div");
    circle.classList.add("reveal-circle");

    // Random size
    const size = Math.floor(Math.random() * 5) + 5;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    // Random angle for the direction (0 to 360 degrees)
    const angle = Math.random() * 2 * Math.PI;

    // Random speed for the animation duration
    const speed = Math.random() * 1 + 1;

    // Calculate x and y based on the random angle
    const x = Math.cos(angle) * 1000 + "px";
    const y = Math.sin(angle) * 1000 + "px";

    // Set the animation duration and direction using CSS variables
    circle.style.setProperty("--x", x);
    circle.style.setProperty("--y", y);
    circle.style.animationDuration = `${speed}s`;

    // Position circle at the coin's center initially
    circle.style.left = `${coinX - size / 2}px`; // Align with coin element's position
    circle.style.top = `${coinY - size / 2}px`; // Align with coin element's position
    circle.style.transform = "translate(-50%, -50%)";

    container.appendChild(circle);

    // Remove circle after animation ends to prevent DOM buildup
    circle.addEventListener("animationend", () => {
      circle.remove();
    });
  }
}

let eventDisplay = document.getElementById("eventDisplay");

function findCoins(pokemon) {
  let chance = Math.floor(Math.random() * 10);
  if (chance > 6) {
    let coinsFound = Math.floor(Math.random() * 2) + 2;
    let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
    coinAmount += coinsFound;
    sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
    coinDisplay.textContent = coinAmount;
    newEvent(
      `${String(pokemon.name).toUpperCase()} found ${coinsFound} coins!`
    );
    createCircles(pokemon.imgElement);
  }
}

function createCircles(pokemon) {
  const numCircles = 10; // Number of circles to generate
  const container = document.body; // Parent container for circles

  // Get the position of the coin element
  const pokemonRect = pokemon.getBoundingClientRect();
  const coinX = pokemonRect.left + pokemonRect.width / 2; // X position of the center of the coin
  const coinY = pokemonRect.top + pokemonRect.height / 2; // Y position of the center of the coin

  for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement("div");
    circle.classList.add("reveal-circle");

    // Random size
    const size = Math.floor(Math.random() * 5) + 5;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    // Random angle for the direction (0 to 360 degrees)
    const angle = Math.random() * 2 * Math.PI;

    // Random speed for the animation duration
    const speed = Math.random() * 5 + 1;

    // Calculate x and y based on the random angle
    const x = Math.cos(angle) * 1000 + "px";
    const y = Math.sin(angle) * 1000 + "px";

    // Set the animation duration and direction using CSS variables
    circle.style.setProperty("--x", x);
    circle.style.setProperty("--y", y);
    circle.style.animationDuration = `${speed}s`;

    // Position circle at the coin's center initially
    circle.style.left = `${coinX - size / 2}px`; // Align with coin element's position
    circle.style.top = `${coinY - size / 2}px`; // Align with coin element's position
    circle.style.transform = "translate(-50%, -50%)";

    container.appendChild(circle);

    // Remove circle after animation ends to prevent DOM buildup
    circle.addEventListener("animationend", () => {
      circle.remove();
    });
  }
}

function spawnStarterCoin() {
  let x = Math.random() * (window.screen.height - 600) + 70;
  let y = Math.random() * (window.screen.width - 600) + 300;

  let coinElement = document.createElement("div");
  coinElement.innerHTML = '<i class="bi bi-cash"></i>';
  coinElement.classList.add("coin-spawn");
  coinElement.style.top = `${x}px`;
  coinElement.style.left = `${y}px`;
  coinElement.setAttribute("onclick", `collectStarterCoin(this)`);
  pen.appendChild(coinElement);
}

function collectStarterCoin(coin) {
  coinAmount += 37;
  coinDisplay.textContent = coinAmount;
  sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
  createCircles(coin);
  coin.remove();
  tutArrow.classList.remove("hidden");
}

function spawnSuperCoin() {
  let chance = Math.floor(Math.random() * 10);
  if (chance > 7) {
  let x = Math.random() * (window.screen.height - 600) + 70;
  let y = Math.random() * (window.screen.width - 600) + 300;

  let coinElement = document.createElement("div");
  coinElement.innerHTML = '<i class="bi bi-cash"></i>';
  coinElement.classList.add("coin-spawn");
  coinElement.classList.add("super-coin");
  coinElement.style.top = `${x}px`;
  coinElement.style.left = `${y}px`;
  coinElement.setAttribute("onclick", `collectSuperCoin(this)`);
  pen.appendChild(coinElement);
  newEvent("A SUPER COIN appeared!");
      // Despawn
      setTimeout(() => {
        coinElement.remove();
      }, 2000);
    }
}

function collectSuperCoin(coin) {
  let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
  coinAmount += 4;
  coinDisplay.textContent = coinAmount;
  sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
  createCircles(coin);
  createCircles(coin);
}

function newEvent(content) {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let message = `(${hours}:${minutes}) - ${content}`;
  eventDisplay.textContent = message;
  let milestones = JSON.parse(sessionStorage.getItem("milestones")) || [];

  if (!Array.isArray(milestones)) {
    milestones = [];
  }

  milestones.push(message);
  addToLog(message);
  sessionStorage.setItem("milestones", JSON.stringify(milestones));
}

function populateLog() {
  let milestones = JSON.parse(sessionStorage.getItem("milestones")) || [];

  if (!Array.isArray(milestones)) {
    milestones = [];
  }

  for (let i = 0; i < milestones.length; i++) {
    let newEntry = document.createElement("p");
    newEntry.textContent = milestones[i];
    log.appendChild(newEntry);
  }
  log.scrollTop = log.scrollHeight;
}

function addToLog(message) {
  let newEntry = document.createElement("p");
  newEntry.textContent = message;
  log.appendChild(newEntry);

  log.scrollTop = log.scrollHeight;
}

populateLog();


let clicks = 0;
let loadSection = document.getElementById("loadSection");

function showSaveOptions() {
  clicks += 1;

  if (clicks >= 5) {
    loadSection.classList.remove("hidden");
  }
}

function downloadHelper() {
    let now = new Date();
    let id = now.getTime();
    saveToFile(JSON.parse(sessionStorage.getItem("userPokemon")), id)
}

function saveToFile(array, fileName) {
  // Convert the array to JSON
  const jsonString = JSON.stringify(array, null, 2); // Pretty-print for readability
  
  // Create a Blob object
  const blob = new Blob([jsonString], { type: "application/json" });
  
  // Create a link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  
  // Set your custom file name and extension
  link.download = `${fileName}.pok`; // Replace .myext with your preferred extension
  
  // Trigger the download
  link.click();
  
  // Cleanup
  URL.revokeObjectURL(link.href);
}

function readFile(event) {
  const file = event.target.files[0];
  
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function (e) {
      const fileContents = e.target.result;
      try {
          // Parse JSON back into an array
          let pArray = JSON.parse(sessionStorage.getItem("userPokemon")) || [];
          const array = JSON.parse(fileContents);
          combined = array.concat(pArray);
          sessionStorage.setItem("userPokemon", JSON.stringify(combined));
      } catch (err) {
          console.error("Error parsing file:", err);
      }
  };
  reader.readAsText(file);
}
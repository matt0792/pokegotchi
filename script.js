let pokemonArray;
let randomPokemon;
let pokemonDetails;

let userPokemon = JSON.parse(sessionStorage.getItem("userPokemon")) || [];

let nameField = document.getElementById("nameField");
let spriteDiv = document.getElementById("pokemonSprite");
let typeField = document.getElementById("typeField");
let openButton = document.getElementById("openButton");
let loader = document.getElementById("loader");
let loadDesc = document.getElementById("loadDesc");

let descriptions = [
  "Checking the Pokédex… please wait!",
  "A wild Pokémon is appearing… just a moment!",
  "Searching tall grass… hold tight!",
];

let circleText = document.getElementById("circleText");
let text = "GET RANDOM POKÉMON GET RANDOM POKÉMON ";
let radius = 150;

// Clear any existing content and create spans for each character
circleText.innerHTML = "";
const angleStep = 360 / text.length;

[...text].forEach((char, i) => {
  let span = document.createElement("span");
  span.innerText = char;

  // Calculate angle for each character
  let angle = angleStep * i;

  // Position each character around the circle and rotate it to match the circle's curvature
  span.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(90deg)`;

  circleText.appendChild(span);
});

function fetchPokemon() {
  // Display random loading text
  let descIndex = Math.floor(Math.random() * 3);
  loadDesc.textContent = descriptions[descIndex];
  // Get pokemon array from pokeapi
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then((response) => response.json())
    .then((data) => {
      pokemonArray = data.results;
      // Call getRandomPokemon after array is populated
      getRandomPokemon();
    });
}

// Get random pokemon from the array
function getRandomPokemon() {
  if (pokemonArray && pokemonArray.length > 0) {
    // Generate a random index between 1 and 1000
    let randomIndex = Math.floor(Math.random() * 1000) + 1;
    randomPokemon = pokemonArray[randomIndex];
    getPokemonData(randomPokemon.name);
  } else {
    console.log("Pokemon array is not yet loaded.");
  }
}

// Fetch data for chosen pokemon
function getPokemonData(pokemonName) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
      pokemonDetails = {
        name: data.name.toUpperCase(),
        stats: data.stats,
        sprite: data.sprites.front_default,
        types: data.types
          .map((typeInfo) => typeInfo.type.name.toUpperCase())
          .join(", "),
      };
      loader.classList.add("hidden");
      openButton.classList.remove("hidden");
    });
}

// Pokemon reveal stuff

let topBanner = document.getElementById("nameBannerTop");
let bottomBanner = document.getElementById("nameBannerBottom");
let spriteDisplay = document.getElementById("spriteDisplay");
let revealName = document.getElementById("revealName");
let revealStats = document.getElementById("revealStats");
let revealDetails = document.getElementById("revealDetails");
let currencyDisplay = document.getElementById("openCurrency");

function drawHelper() {
  let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
  if (coinAmount >= 20) {
    currencyDisplay.classList.add("hidden");
    pokemonDraw(pokemonDetails);
    userPokemon.push(String(pokemonDetails.name).toLowerCase());
    sessionStorage.setItem("userPokemon", JSON.stringify(userPokemon));
  }
}

function pokemonDraw(pokemonDetails) {
  openButton.classList.add("hidden");
  createCircles();
  revealDetails.classList.remove("hidden");
  topBanner.textContent = pokemonDetails.name;
  bottomBanner.textContent = pokemonDetails.name;
  triggerSlideIn();
  // Display sprite
  spriteDisplay.innerHTML = "";
  let imgElement = document.createElement("img");
  imgElement.src = pokemonDetails.sprite;
  imgElement.alt = `${pokemonDetails.name} sprite`;
  imgElement.classList.add("reveal-sprite");
  spriteDisplay.appendChild(imgElement);

  // Display data
  revealName.textContent = pokemonDetails.name;
  revealStats.textContent = pokemonDetails.types;
}

function triggerSlideIn() {
  topBanner.classList.remove("hidden");
  bottomBanner.classList.remove("hidden");
  topBanner.classList.add("top-slide");
  bottomBanner.classList.add("bottom-slide");
}

// Reveal animation

function createCircles() {
  const numCircles = 100; // Number of circles to generate
  const container = document.body; // Parent container for circles

  for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement("div");
    circle.classList.add("reveal-circle");

    // Random size
    const size = Math.floor(Math.random() * 45) + 20;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    // Random angle for the direction (0 to 360 degrees)
    const angle = Math.random() * 2 * Math.PI;

    // Random speed for the animation duration
    const speed = Math.random() * 3 + 1;

    // Calculate x and y based on the random angle
    const x = Math.cos(angle) * 1000 + "px";
    const y = Math.sin(angle) * 1000 + "px";

    // Set the animation duration and direction using CSS variables
    circle.style.setProperty("--x", x);
    circle.style.setProperty("--y", y);
    circle.style.animationDuration = `${speed}s`;

    // Position circle at the center of the screen initially
    circle.style.left = "50%";
    circle.style.top = "50%";
    circle.style.transform = "translate(-50%, -50%)";

    container.appendChild(circle);

    // Remove circle after animation ends to prevent DOM buildup
    circle.addEventListener("animationend", () => {
      circle.remove();
    });
  }
}

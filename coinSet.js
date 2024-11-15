let coinAmount = JSON.parse(sessionStorage.getItem("userCoins")) || 0;
sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
let coinDisplay = document.getElementById("currencyAmount");
coinDisplay.textContent = coinAmount;

function openPokemon() {
  if (coinAmount >= 20) {
    coinAmount -= 20;
    coinDisplay.textContent = coinAmount;
    sessionStorage.setItem("userCoins", JSON.stringify(coinAmount));
  }
}

let circleCostText = document.getElementById("openCost");

if (coinAmount < 20) {
  circleCostText.textContent = "Price: 20";
}

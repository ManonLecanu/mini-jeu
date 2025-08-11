// 1. Sélectionner les éléments HTML
const gameBoard = document.getElementById("game-board");
const movesCounter = document.getElementById("moves");
const timeCounter = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");

// 2. Créer le tableau des cartes (paires d'emojis ici)
let cardsArray = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥝", "🍉"];
cardsArray = [...cardsArray, ...cardsArray]; // On duplique pour avoir les paires

// 3. Fonction pour mélanger les cartes (algorithme de Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // index aléatoire
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

// 4. Variables pour le jeu
let firstCard = null;
let secondCard = null;
let lockBoard = false; // empêche de cliquer trop vite
let moves = 0;
let matchedPairs = 0;
let timerInterval;
let time = 0;

// 5. Fonction pour créer les cartes dans le DOM
function createBoard() {
  gameBoard.innerHTML = ""; // vider le plateau
  shuffle(cardsArray).forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol; // stocke le symbole
    card.innerHTML = ""; // face cachée au départ

    // Ajouter l'événement au clic
    card.addEventListener("click", flipCard);

    gameBoard.appendChild(card);
  });
}

// 6. Fonction pour retourner une carte
function flipCard() {
  if (lockBoard || this === firstCard) return; // évite bugs
  this.classList.add("flipped");
  this.innerHTML = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

// 7. Vérifier si c'est une paire
function checkMatch() {
  lockBoard = true;
  moves++;
  movesCounter.textContent = moves;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    resetTurn();
    if (matchedPairs === cardsArray.length / 2) {
      clearInterval(timerInterval); // stop le chrono
      setTimeout(
        () =>
          alert(
            `Bravo 🎉 ! Tu as gagné en ${moves} coups et ${time} secondes !`
          ),
        500
      );
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.innerHTML = "";
      secondCard.innerHTML = "";
      resetTurn();
    }, 1000);
  }
}

// 8. Réinitialiser les variables après un tour
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// 9. Bouton recommencer
restartBtn.addEventListener("click", startGame);

// 10. Fonction pour démarrer le jeu
function startGame() {
  moves = 0;
  matchedPairs = 0;
  movesCounter.textContent = moves;
  createBoard();
  startTimer(); // on démarre le chrono
}

function startTimer() {
  clearInterval(timerInterval); // on reset le timer s'il existait
  time = 0;
  timeCounter.textContent = time;

  timerInterval = setInterval(() => {
    time++;
    timeCounter.textContent = time;
  }, 1000);
}

// 11. Lancer le jeu au chargement
startGame();

"use strict";

// Game variables. Wins and losses stay in place when a new round starts.
const MAX_ATTEMPTS = 7;
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;
let round = 0;
let isGameOver = false;

// Get the HTML elements that the game needs to update.
const playerGuess = document.querySelector("#playerGuess");
const guessButton = document.querySelector("#guessBtn");
const resetButton = document.querySelector("#resetBtn");
const attemptsDisplay = document.querySelector("#attempt-count");
const winsDisplay = document.querySelector("#win-count");
const lossesDisplay = document.querySelector("#loss-count");
const roundDisplay = document.querySelector("#round-number");
const guessesDisplay = document.querySelector("#guess-list");
const guessesLeftDisplay = document.querySelector("#remaining");
const feedback = document.querySelector("#feedback");
const feedbackText = document.querySelector("#feedback-text");

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  attempts = 0;
  round += 1;
  isGameOver = false;

  roundDisplay.textContent = round;
  playerGuess.value = "";
  playerGuess.disabled = false;
  guessButton.hidden = false;
  guessButton.disabled = false;
  resetButton.style.display = "none";
  guessesDisplay.replaceChildren();
  updateAttemptsDisplay();
  showFeedback("Enter your first guess to get started.");
  playerGuess.focus();
}

function updateAttemptsDisplay() {
  attemptsDisplay.textContent = attempts;
  const guessesLeft = MAX_ATTEMPTS - attempts;
  guessesLeftDisplay.textContent = `${guessesLeft} ${guessesLeft === 1 ? "guess" : "guesses"} left`;
}

function showFeedback(message, state = "neutral") {
  feedback.dataset.state = state;
  feedbackText.textContent = message;
  const icon = feedback.querySelector(".feedback-icon");
  icon.textContent = state === "win" ? "✓" : state === "loss" || state === "error" ? "!" : "i";
}

function displayGuess(guess) {
  const guessChip = document.createElement("span");
  guessChip.className = "guess-chip";
  guessChip.textContent = guess;
  guessesDisplay.append(guessChip);
}

function checkGuess() {
  if (isGameOver) return;

  const rawGuess = playerGuess.value.trim();
  const guess = Number(rawGuess);

  if (rawGuess === "" || !Number.isInteger(guess) || guess < 1 || guess > 99) {
    showFeedback("Enter a whole number from 1 to 99.", "error");
    playerGuess.focus();
    return;
  }

  attempts += 1;
  displayGuess(guess);
  updateAttemptsDisplay();

  if (guess === randomNumber) {
    finishGame(true);
  } else if (attempts === MAX_ATTEMPTS) {
    finishGame(false);
  } else if (guess < randomNumber) {
    showFeedback("Not quite — try a higher number.");
  } else {
    showFeedback("A little too high — try a lower number.");
  }

  playerGuess.value = "";
  if (!isGameOver) playerGuess.focus();
}

function finishGame(won) {
  isGameOver = true;
  playerGuess.disabled = true;
  guessButton.disabled = true;
  guessButton.hidden = true;
  resetButton.style.display = "block";

  if (won) {
    wins += 1;
    winsDisplay.textContent = wins;
    showFeedback(`You got it! The number was ${randomNumber}. You guessed it in ${attempts} ${attempts === 1 ? "try" : "tries"}!`, "win");
  } else {
    losses += 1;
    lossesDisplay.textContent = losses;
    showFeedback(`You lost! The number was ${randomNumber}. Click Reset to try again.`, "loss");
  }
}

// Event listeners for the Guess and Reset buttons.
guessButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", initializeGame);

// Let the player submit a guess by pressing Enter as well.
playerGuess.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkGuess();
});

initializeGame();

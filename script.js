// UI Elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const humanVsHumanButton = document.getElementById('human-vs-human');
const humanVsComputerButton = document.getElementById('human-vs-computer');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restart');
const resetScoreButton = document.getElementById('reset-score');
const backToMenuButton = document.getElementById('back-to-menu');
const messageElement = document.getElementById('message');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');

// Game State
let currentPlayer = 'X';
let isGameActive = true;
let boardState = Array(9).fill(null);
let scoreX = 0;
let scoreO = 0;
let gameMode = 'human-vs-human'; // Default mode

// Winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Function to start a new game
function startGame() {
  homeScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  updateMessage("It's X's turn");
}

// Event Listeners
humanVsHumanButton.addEventListener('click', () => setGameMode('human-vs-human'));
humanVsComputerButton.addEventListener('click', () => setGameMode('human-vs-computer'));
restartButton.addEventListener('click', restartGame);
resetScoreButton.addEventListener('click', resetScore);
backToMenuButton.addEventListener('click', goBackToMenu);

// Set the game mode and start the game
function setGameMode(mode) {
  gameMode = mode;
  startGame();
}

// Handle player moves
function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  if (boardState[cellIndex] || !isGameActive) return;

  boardState[cellIndex] = currentPlayer;
  updateCell(cell, currentPlayer);

  if (checkWin(currentPlayer)) {
    updateScore(currentPlayer);
    endGame(`${currentPlayer} wins!`);
  } else if (isDraw()) {
    endGame("It's a draw!");
  } else {
    switchPlayer();
    if (gameMode === 'human-vs-computer' && currentPlayer === 'O') {
      computerMove();
    }
  }
}

// Update the cell with the current player's mark
function updateCell(cell, player) {
  cell.textContent = player;
  cell.classList.add('taken');
}

// Check for a winning combination
function checkWin(player) {
  const winningCombination = WINNING_COMBINATIONS.find(combination =>
    combination.every(index => boardState[index] === player)
  );

  if (winningCombination) {
    winningCombination.forEach(index => {
      cells[index].classList.add('winner');  // Add the winner class to the winning cells
    });
    return true;
  }
  return false;
}

// Check for a draw
function isDraw() {
  return boardState.every(cell => cell !== null);
}

// End the game and display the result
function endGame(resultMessage) {
  isGameActive = false;
  updateMessage(resultMessage);
}

// Update the message displayed on the screen
function updateMessage(message) {
  messageElement.textContent = message;
}

// Restart the game
function restartGame() {
  boardState.fill(null);
  isGameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken', 'winner');
  });
  updateMessage("It's X's turn");
}

// Update the score based on the winner
function updateScore(winner) {
  if (winner === 'X') {
    scoreX++;
    scoreXElement.textContent = `X: ${scoreX}`;
  } else if (winner === 'O') {
    scoreO++;
    scoreOElement.textContent = `O: ${scoreO}`;
  }
}

// Reset the score to zero
function resetScore() {
  scoreX = 0;
  scoreO = 0;
  scoreXElement.textContent = `X: ${scoreX}`;
  scoreOElement.textContent = `O: ${scoreO}`;
  restartGame(); // Reset the game after score reset
}

// Go back to the home screen and reset the game
function goBackToMenu() {
  homeScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
  restartGame();  // Reset the game when going back to the menu
}

// Handle the computer's move
function computerMove() {
  const emptyCells = getEmptyCells();
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  
  boardState[randomCell] = 'O';
  updateCell(cells[randomCell], 'O');

  if (checkWin('O')) {
    updateScore('O');
    endGame("Computer (O) wins!");
  } else if (isDraw()) {
    endGame("It's a draw!");
  } else {
    switchPlayer();
  }
}

// Get the indexes of empty cells
function getEmptyCells() {
  return boardState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
}

// Switch the current player
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateMessage(`It's ${currentPlayer}'s turn`);
}


// Initialize event listeners for the game cells
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

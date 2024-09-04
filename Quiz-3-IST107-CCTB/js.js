/*
# This project is based on a public project but has been modified 
# according to the requirements of the IST 107 Course.
# Instructor: Washington Valencia
# Institution: CCTB College
*/

"use strict";

/*

A SIMPLE TIC-TAC-TOE GAME IN JAVASCRIPT

(1) Grid layout

The game grid is represented in the array Grid.cells as follows:

[0] [1] [2]
[3] [4] [5]
[6] [7] [8]

The cells (array elements) hold the following numeric values:
0 if not occupied, 1 for player, 3 for computer.
This allows us to quickly get an overview of the game state:
if the sum of all the cells in a row is 9, the computer wins,
if it is 3 and all the cells are occupied, the human player wins,
etc.

(2) Strategy of makeComputerMove()

The computer first  looks for almost completed rows, columns, and
diagonals, where there are two fields occupied either by the human
player or by the computer itself. If the computer can win by
completing a sequence, it does so; if it can block the player from
winning with the next move, it does that. If none of that applies,
it plays the center field if that's free, otherwise it selects a
random free field. This is not a 100 % certain strategy, but the
gameplay experience is fairly decent.

*/

//==================================
// EVENT BINDINGS
//==================================

// Bind Esc key to closing the modal dialog
document.onkeypress = function (evt) {
  evt = evt || window.event;
  var modal = document.getElementsByClassName("modal")[0];
  if (evt.keyCode === 27) {
    modal.style.display = "none";
  }
};

// When the user clicks anywhere outside of the modal dialog, close it
window.onclick = function (evt) {
  var modal = document.getElementsByClassName("modal")[0];
  if (evt.target === modal) {
    modal.style.display = "none";
  }
};

//==================================
// HELPER FUNCTIONS
//==================================
function sumArray(array) {
  var sum = 0,
    i = 0;
  for (i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function isInArray(element, array) {
  if (array.indexOf(element) > -1) {
    return true;
  }
  return false;
}

function shuffleArray(array) {
  var counter = array.length,
    temp,
    index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function intRandom(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//==================================
// GRID OBJECT
//==================================

// Grid constructor
//=================
function Grid() {
  this.cells = new Array(9);
}

// Grid methods
//=============

// Get free cells in an array.
// Returns an array of indices in the original Grid.cells array, not the values
// of the array elements.
// Their values can be accessed as Grid.cells[index].
Grid.prototype.getFreeCellIndices = function () {
  var i = 0,
    resultArray = [];
  for (i = 0; i < this.cells.length; i++) {
    if (this.cells[i] === 0) {
      resultArray.push(i);
    }
  }
  // console.log("resultArray: " + resultArray.toString());
  // debugger;
  return resultArray;
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns the values of the elements.
Grid.prototype.getRowValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowValues!");
    return undefined;
  }
  var i = index * 3;
  return this.cells.slice(i, i + 3);
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns an array with the indices, not their values.
Grid.prototype.getRowIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowIndices!");
    return undefined;
  }
  var row = [];
  index = index * 3;
  row.push(index);
  row.push(index + 1);
  row.push(index + 2);
  return row;
};

// get a column (values)
Grid.prototype.getColumnValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnValues!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(this.cells[i]);
  }
  return column;
};

// get a column (indices)
Grid.prototype.getColumnIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnIndices!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(i);
  }
  return column;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagValues = function (arg) {
  var cells = [];
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagValues!");
    return undefined;
  } else if (arg === 0) {
    cells.push(this.cells[0]);
    cells.push(this.cells[4]);
    cells.push(this.cells[8]);
  } else {
    cells.push(this.cells[2]);
    cells.push(this.cells[4]);
    cells.push(this.cells[6]);
  }
  return cells;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagIndices = function (arg) {
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagIndices!");
    return undefined;
  } else if (arg === 0) {
    return [0, 4, 8];
  } else {
    return [2, 4, 6];
  }
};

// Get first index with two in a row (accepts computer or player as argument)
Grid.prototype.getFirstWithTwoInARow = function (agent) {
  if (agent !== computer && agent !== player) {
    console.error(
      "Function getFirstWithTwoInARow accepts only player or computer as argument."
    );
    return undefined;
  }
  var sum = agent * 2,
    freeCells = shuffleArray(this.getFreeCellIndices());
  for (var i = 0; i < freeCells.length; i++) {
    for (var j = 0; j < 3; j++) {
      var rowV = this.getRowValues(j);
      var rowI = this.getRowIndices(j);
      var colV = this.getColumnValues(j);
      var colI = this.getColumnIndices(j);
      if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
        return freeCells[i];
      } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
        return freeCells[i];
      }
    }
    for (j = 0; j < 2; j++) {
      var diagV = this.getDiagValues(j);
      var diagI = this.getDiagIndices(j);
      if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
        return freeCells[i];
      }
    }
  }
  return false;
};

Grid.prototype.reset = function () {
  for (var i = 0; i < this.cells.length; i++) {
    this.cells[i] = 0;
  }
  return true;
};

//==================================
//  FUNCTIONS
//==================================

// Global Variables
var moves = 0,
  winner = 0,
  x = 1,
  o = 3,
  player = x,
  computer = o,
  whoseTurn = x,
  gameOver = false,
  score = {
    ties: 0,
    player: 0,
    computer: 0,
  },
  xText = '<span class="x">&times;</span>',
  oText = '<span class="o">o</span>',
  playerText = xText,
  computerText = oText,
  difficulty = 1,
  myGrid = new Grid(); // Initialize Grid instance
q;
//==================================
// MAIN FUNCTIONS
//==================================

function initialize() {
  showOptionsDialog(); // Show options dialog on load
}

function showOptionsDialog() {
  var optionsDlg = document.getElementById("optionsDlg");
  optionsDlg.style.display = "block";
}

function getOptions() {
  var selectedRole = document.querySelector(
    'input[name="player"]:checked'
  ).value;
  var selectedDifficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;

  player = selectedRole === "x" ? 1 : 3;
  computer = player === 1 ? 3 : 1;
  difficulty = parseInt(selectedDifficulty);

  document.getElementById("optionsDlg").style.display = "none";
  startGame();
}

function startGame() {
  myGrid.reset();
  document.querySelectorAll(".td_game div").forEach((cell) => {
    cell.innerHTML = "";
    cell.className = "fixed";
  });
  updateScores();
  if (whoseTurn === computer) {
    setTimeout(makeComputerMove, 400);
  }
}

function cellClicked(cellId) {
  var cellIndex = parseInt(cellId.replace("cell", ""));
  if (myGrid.cells[cellIndex] || checkWinner()) return;

  myGrid.cells[cellIndex] = player;
  document.getElementById(cellId).innerHTML = playerText;

  if (checkWinner()) {
    setTimeout(() => announceWinner(player), 500);
  } else if (myGrid.getFreeCellIndices().length === 0) {
    setTimeout(() => announceWinner(0), 500); // It's a tie
  } else {
    whoseTurn = computer;
    setTimeout(makeComputerMove, 400);
  }
}

function makeComputerMove() {
  if (gameOver) return;

  var cell = -1;
  if (moves >= 3) {
    cell =
      myGrid.getFirstWithTwoInARow(computer) ||
      myGrid.getFirstWithTwoInARow(player);
    if (cell === false) {
      if (myGrid.cells[4] === 0 && difficulty === 1) {
        cell = 4;
      } else {
        var emptyCells = myGrid.getFreeCellIndices();
        cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    }
  } else if (moves === 0 && Math.random() < 0.8) {
    cell = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
  } else {
    if (myGrid.cells[4] === 0 && difficulty === 1) {
      cell = 4;
    } else {
      var emptyCells = myGrid.getFreeCellIndices();
      cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  var id = "cell" + cell;
  document.getElementById(id).innerHTML = computerText;
  document.getElementById(id).style.cursor = "default";

  myGrid.cells[cell] = computer;
  moves++;

  if (moves >= 5) {
    winner = checkWin();
  }

  if (winner === 0 && !gameOver) {
    whoseTurn = player;
  }
}

function checkWinner() {
  var winner = 0;

  // Check rows, columns, diagonals
  for (var i = 0; i < 3; i++) {
    if (myGrid.getRowValues(i).every((cell) => cell === player)) {
      winner = player;
    } else if (myGrid.getColumnValues(i).every((cell) => cell === player)) {
      winner = player;
    }
  }

  for (var i = 0; i < 2; i++) {
    if (myGrid.getDiagValues(i).every((cell) => cell === player)) {
      winner = player;
    }
  }

  if (winner === 0) {
    for (var i = 0; i < 3; i++) {
      if (myGrid.getRowValues(i).every((cell) => cell === computer)) {
        winner = computer;
      } else if (myGrid.getColumnValues(i).every((cell) => cell === computer)) {
        winner = computer;
      }
    }

    for (var i = 0; i < 2; i++) {
      if (myGrid.getDiagValues(i).every((cell) => cell === computer)) {
        winner = computer;
      }
    }
  }

  if (winner === 0 && myGrid.getFreeCellIndices().length === 0) {
    winner = 0; // Tie
  }

  return winner;
}

function announceWinner(winner) {
  var winText = document.getElementById("winText");
  var winAnnounce = document.getElementById("winAnnounce");

  if (winner === 0) {
    winText.textContent = "It's a tie!";
    score.ties++;
  } else if (winner === player) {
    winText.textContent = "Player wins!";
    score.player++;
  } else if (winner === computer) {
    winText.textContent = "Computer wins!";
    score.computer++;
  }

  winAnnounce.style.display = "block";
  updateScores();
}

function updateScores() {
  document.getElementById("player_score").textContent = score.player;
  document.getElementById("computer_score").textContent = score.computer;
  document.getElementById("tie_score").textContent = score.ties;
}

function restartGame(ask) {
  if (moves > 0 && !confirm("Are you sure you want to start over?")) {
    return;
  }
  gameOver = false;
  moves = 0;
  winner = 0;
  whoseTurn = player;
  myGrid.reset();

  document.querySelectorAll(".td_game div").forEach((cell) => {
    cell.innerHTML = "";
    cell.style.cursor = "pointer";
    cell.classList.remove("win-color");
  });

  if (ask) {
    setTimeout(showOptionsDialog, 200);
  } else if (whoseTurn === computer) {
    setTimeout(makeComputerMove, 800);
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function endGame(who) {
  if (who === player) {
    announceWinner("Congratulations, you won!");
  } else if (who === computer) {
    announceWinner("Computer wins!");
  } else {
    announceWinner("It's a tie!");
  }
  gameOver = true;
  whoseTurn = 0;
  moves = 0;
  winner = 0;
  updateScores();
  setTimeout(restartGame, 800, false);
}

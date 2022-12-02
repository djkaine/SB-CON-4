//grabbing board element
const board = document.querySelector("#board");
const modalContainer = document.querySelector("#modal-container");
const modalMessage = document.querySelector("#modal-message");
const resetButton = document.querySelector("#reset");

resetButton.onclick = () => {
  location.reload();
};

const WHITE_TURN = 1;
const BLACK_TURN = 2;

//0-empty, 1-white, 2-black
const pieces = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

let playerTurn = WHITE_TURN; //2 for player two
let hoverColumn = -1;
let animating = false;

//making board size
for (let i = 0; i < 42; i++) {
  let cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);
  //making hover over cell
  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7);
  };
  //dropping piece
  cell.onclick = () => {
    if (!animating) {
      onColumnClicked(i % 7);
    }
  };
}
//checking board rows if space
function onColumnClicked(column) {
  let availableRow = pieces
    .filter((_, index) => index % 7 === column)
    .lastIndexOf(0);
  if (availableRow === -1) {
    return;
  }

  pieces[availableRow * 7 + column] = playerTurn;
  let cell = board.children[availableRow * 7 + column];

  let piece = document.createElement("div");
  piece.className = "piece";
  piece.dataset.placed = true;
  piece.dataset.player = playerTurn;
  cell.appendChild(piece);

  //adding animation
  let unplacedPiece = document.querySelector("[data-placed='false']");
  let unplacedY = unplacedPiece.getBoundingClientRect().y;
  let placedY = piece.getBoundingClientRect().y;
  let yDiff = unplacedY - placedY;
  animating = true;
  removeUnplacedPiece();
  let animation = piece.animate(
    [
      { transform: `translateY(${yDiff}px)`, offset: 0 },
      { transform: `translateY(0px)`, offset: 0.6 },
      { transform: `translateY(${yDiff / 20}px)`, offset: 0.8 },
      { transform: `translateY(0px)`, offset: 0.95 },
    ],
    {
      duration: 400,
      easing: "linear",
      iterations: 1,
    }
  );
  //checking for win
  animation.addEventListener("finish", checkGameWinOrDraw);
}

function checkGameWinOrDraw() {
  animating = false;
  //check if draw
  if (!pieces.includes(0)) {
    modalContainer.style.display = "block";
    modalMessage.textContent = "Draw";
  }

  //check if won
  if (hasPlayerWon(playerTurn, pieces)) {
    modalContainer.style.display = "block";
    modalMessage.textContent = `${
      playerTurn === WHITE_TURN ? "White" : "Black"
    } WON!`;
  }

  if (playerTurn === WHITE_TURN) {
    playerTurn = BLACK_TURN;
  } else {
    playerTurn = WHITE_TURN;
  }
  updateHover();
}

//update hover
function updateHover() {
  removeUnplacedPiece();
  //add piece
  if (pieces[hoverColumn] === 0) {
    let cell = board.children[hoverColumn];
    let piece = document.createElement("div");
    piece.className = "piece";
    piece.dataset.placed = false;
    piece.dataset.player = playerTurn;
    cell.appendChild(piece);
  }
}

function removeUnplacedPiece() {
  //remove piece
  let unplacedPiece = document.querySelector("[data-placed='false']");
  if (unplacedPiece) {
    unplacedPiece.parentElement.removeChild(unplacedPiece);
  }
}
//placing piece onto board
function onMouseEnteredColumn(column) {
  hoverColumn = column;
  if (!animating) {
    updateHover();
  }
}

function hasPlayerWon(playerTurn, pieces) {
  for (let index = 0; index < 42; index++) {
    if (
      index % 7 < 4 &&
      pieces[index] === playerTurn &&
      pieces[index + 1] === playerTurn &&
      pieces[index + 2] === playerTurn &&
      pieces[index + 3] === playerTurn
    ) {
      return true;
    }
    if (
      index < 21 &&
      pieces[index] === playerTurn &&
      pieces[index + 7] === playerTurn &&
      pieces[index + 14] === playerTurn &&
      pieces[index + 21] === playerTurn
    ) {
      return true;
    }
    if (
      index % 7 < 4 &&
      index < 18 &&
      pieces[index] === playerTurn &&
      pieces[index + 8] === playerTurn &&
      pieces[index + 16] === playerTurn &&
      pieces[index + 24] === playerTurn
    ) {
      return true;
    }
    if (
      index % 7 >= 3 &&
      index < 21 &&
      pieces[index] === playerTurn &&
      pieces[index + 6] === playerTurn &&
      pieces[index + 12] === playerTurn &&
      pieces[index + 18] === playerTurn
    ) {
      return true;
    }
  }

  return false;
}

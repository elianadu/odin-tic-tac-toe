const numRows = 3;
const numColumns = 3;
const boardDiv = document.querySelector(".board");
const moveStatusDiv = document.querySelector(".move-status-message");
let playerOneName = "";
let playerTwoName = "";
let numPlayerOneWins = 0;
let numPlayerTwoWins = 0;
let numDraws = 0;

function Cell() {
  let value = 0;

  const changeCellValue = (player) => {
    value = player;
  };
  const readCellValue = () => value;

  return { changeCellValue, readCellValue };
}

function Gameboard() {
  const board = [];
  for (let i = 0; i < numRows; i++) {
    board[i] = [];
    for (let j = 0; j < numColumns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.readCellValue())
    );
    console.log(boardWithCellValues);
  };

  const isValidMove = (row, column) => board[row][column].readCellValue() === 0;

  const placeMarker = (row, column, player) =>
    board[row][column].changeCellValue(player);

  return { getBoard, printBoard, placeMarker, isValidMove };
}

function GameController() {
  const board = Gameboard();

  players = [
    {
      name: playerOneName,
      marker: 1,
    },
    {
      name: playerTwoName,
      marker: 2,
    },
  ];

  let activePlayer = players[0];

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`It is ${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    const isWinningMove = () => {
      const readableBoard = board
        .getBoard()
        .map((row) => row.map((cell) => cell.readCellValue()));

      const isThreeInARow = () => {
        let isAWin = true;
        for (j = 0; j < numColumns; j++) {
          if (readableBoard[row][j] !== getActivePlayer().marker) {
            isAWin = false;
          }
        }
        return isAWin;
      };

      const isThreeInAColumn = () => {
        let isAWin = true;
        for (i = 0; i < numRows; i++) {
          if (readableBoard[i][column] !== getActivePlayer().marker) {
            isAWin = false;
          }
        }
        return isAWin;
      };

      const isThreeInADiagonal = () => {
        let isAWin = true;

        const downDiagonalCells = [
          [0, 0],
          [1, 1],
          [2, 2],
        ];
        const upDiagonalCells = [
          [0, 2],
          [1, 1],
          [2, 0],
        ];

        const isADownDiagonalCell = () => {
          return (
            (row === 0 && column === 0) ||
            (row === 1 && column === 1) ||
            (row === 2 && column === 2)
          );
        };

        const isAnUpDiagonalCell = () => {
          return (
            (row === 0 && column === 2) ||
            (row === 1 && column === 1) ||
            (row === 2 && column === 0)
          );
        };

        if (isADownDiagonalCell) {
          for (let i = 0; i < numRows; i++) {
            if (
              readableBoard[downDiagonalCells[i][0]][
                downDiagonalCells[i][1]
              ] !== getActivePlayer().marker
            ) {
              isAWin = false;
            }
          }
          if (isAWin) return isAWin;
        }
        if (isAnUpDiagonalCell) {
          let isAWin = true;
          for (let i = 0; i < numRows; i++) {
            if (
              readableBoard[upDiagonalCells[i][0]][upDiagonalCells[i][1]] !==
              getActivePlayer().marker
            ) {
              isAWin = false;
            }
          }
          if (isAWin) return isAWin;
        }
        return false;
      };
      return isThreeInARow() || isThreeInAColumn() || isThreeInADiagonal();
    };

    const boardIsFull = () => {
      const readableBoard = board
        .getBoard()
        .map((row) => row.map((cell) => cell.readCellValue()));
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numColumns; j++) {
          if (readableBoard[i][j] === 0) return false;
        }
      }
      return true;
    };

    if (!board.isValidMove(row, column)) {
      console.log(`Sorry, that's not valid`);
      printNewRound();
      return "invalid";
    } else {
      board.placeMarker(row, column, getActivePlayer().marker);

      if (isWinningMove()) {
        console.log(`${getActivePlayer().name} wins!`);
        board.printBoard();
        return "winning";
      } else if (boardIsFull()) {
        console.log(`You tied!`);
        return "tie";
      } else {
        switchTurns();
        printNewRound();
        return "";
      }
    }
  };
  printNewRound();
  return { getActivePlayer, playRound, getBoard: board.getBoard };
}

function ScreenController() {
  const game = GameController();
  const activePlayerDiv = document.querySelector(".active-player-message");

  const createBoard = () => {
    displayResults();
    const clearScreen = (() => {
      while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild);
      }
      boardDiv.classList.remove("hidden");
    })();

    const activePlayer = game.getActivePlayer().name;
    activePlayerDiv.textContent = `${activePlayer}'s turn`;

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        const cellDiv = document.createElement(`div`);
        cellDiv.classList.add("cell");
        cellDiv.classList.add(`row-${i}`);
        cellDiv.classList.add(`column-${j}`);

        cellDiv.addEventListener("click", () => {
          let move = game.playRound(i, j);
          let isValid = true;
          let isWinning = false;
          let isTie = false;

          if (move === "invalid") {
            isValid = false;
          } else if (move === "winning") {
            isWinning = true;
          } else if (move === "tie") {
            isTie = true;
          }
          updateScreen(isValid, isWinning, isTie);
        });

        boardDiv.appendChild(cellDiv);
      }
    }
  };

  const displayResults = () => {
    const playerOneWinsDiv = document.querySelector(".player-one-wins");
    const playerTwoWinsDiv = document.querySelector(".player-two-wins");
    const drawsDiv = document.querySelector(".draws");
    playerOneWinsDiv.textContent = `${playerOneName}'s wins: ${numPlayerOneWins}`;
    playerTwoWinsDiv.textContent = `${playerTwoName}'s wins: ${numPlayerTwoWins}`;
    drawsDiv.textContent = `Draws: ${numDraws}`;
  };

  const updateScreen = (isValid, isWinning, isTie) => {
    const activePlayer = game.getActivePlayer().name;
    const readableBoard = game
      .getBoard()
      .map((row) => row.map((cell) => cell.readCellValue()));
    const boardArr = Array.from(boardDiv.querySelectorAll(".cell"));
    activePlayerDiv.textContent = `${activePlayer}'s turn`;
    if (!isValid) {
      moveStatusDiv.textContent = "Sorry, that's not a valid move.";
    } else if (isWinning || isTie) {
      if (isWinning) {
        if (activePlayer === playerOneName) {
          numPlayerOneWins++;
        } else {
          numPlayerTwoWins++;
        }
        moveStatusDiv.textContent = `${activePlayer} won!`;
      } else if (isTie) {
        numDraws++;
        moveStatusDiv.textContent = `You tied!`;
      }
      displayResults();
    } else {
      moveStatusDiv.textContent = "";
    }

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        if (readableBoard[i][j] === 1) {
          boardArr[i * numRows + j].textContent = "X";
        } else if (readableBoard[i][j] === 2) {
          boardArr[i * numRows + j].textContent = "O";
        } else {
          boardArr[i * numRows + j].textContent = "";
        }
      }
    }
  };

  createBoard();
}

function SetGame() {
  const restartBtn = document.querySelector(".restart");
  const startBtn = document.querySelector(".start");

  boardDiv.classList.add("hidden");

  startBtn.addEventListener("click", () => {
    playerOneName =
      document.querySelector(".player-one-name").value || "Player One";
    playerTwoName =
      document.querySelector(".player-two-name").value || "Player Two";

    const enterPage = document.querySelector(".enter-page");
    enterPage.classList.add("hidden");

    restartBtn.textContent = "Restart";
    restartBtn.classList.remove("hidden");
    moveStatusDiv.textContent = "";
    ScreenController();
  });

  restartBtn.addEventListener("click", () => {
    moveStatusDiv.textContent = "";
    ScreenController();
  });
}

SetGame();

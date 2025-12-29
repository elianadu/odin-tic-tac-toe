const numRows = 3;
const numColumns = 3;

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

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  // const readableBoard = board.getBoard();

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

    const getMoveStatus = () => {
        let moveStatus = "";
    if (!board.isValidMove(row, column)) {
      console.log("Sorry, that's not a valid move!");
      printNewRound();
    } else {
      board.placeMarker(row, column, getActivePlayer().marker);

      if (isWinningMove()) {
        console.log(`${getActivePlayer().name} wins!`);
        board.printBoard();
      } else if (boardIsFull()) {
        console.log(`You tied!`);
      } else {
        switchTurns();
        printNewRound();
      }
    }
    return moveStatus;
    }
    return {getMoveStatus};
  };
  printNewRound();
  return { getActivePlayer, playRound, getBoard: board.getBoard};
}


function ScreenController() {
  const game = GameController();
  const activePlayerDiv = document.querySelector(".active-player-message");
  const boardDiv = document.querySelector(".board");

  const createBoard = () => {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        const cellDiv = document.createElement(`div`);
        cellDiv.classList.add("cell");
        cellDiv.classList.add(`row-${i}`);
        cellDiv.classList.add(`column-${j}`);

        cellDiv.addEventListener("click", () => {
            game.playRound(i, j);
            updateScreen();
        })

        boardDiv.appendChild(cellDiv);
      }
    }
  }

  const updateScreen = () => {
    const activePlayer = game.getActivePlayer().name;
    const readableBoard = game.getBoard().map((row) => row.map((cell) => cell.readCellValue()));
    const boardArr = Array.from(boardDiv.querySelectorAll(".cell"));
    activePlayerDiv.textContent = `${activePlayer}'s turn`;

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numColumns; j++) {
        if (readableBoard[i][j] === 1) {
            boardArr[i*numRows + j].textContent = "X";
        }
        else if (readableBoard[i][j] === 2) {
            boardArr[i*numRows + j].textContent = "O";
        }
        else {
            boardArr[i*numRows + j].textContent = "";
        }
      }
    }
  };

createBoard();
updateScreen();
}

ScreenController();

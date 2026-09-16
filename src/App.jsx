import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import GameOver from "./components/gameOver.jsx";
import { useState } from "react";
import Log from "./components/Log.jsx";
import { WINNING_COMBINATIONS } from "./components/Winning_Combinations.js";
const PLAYERS = {
    X: "Player 1",
    O: "Player 2"
}

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveWinner(gameBoard, players) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSympol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSympol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSympol =
      gameBoard[combination[2].row][combination[2].column];
    if (
      firstSquareSympol &&
      firstSquareSympol === secondSquareSympol &&
      firstSquareSympol === thirdSquareSympol
    ) {
      winner = players[firstSquareSympol];
    }
  }
  return winner;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);

  function deriveActive(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;
  const activePlayer = deriveActive(gameTurns)

  function handleSelectSquares(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActive(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRematch() {
    setGameTurns([]);
  }

  function handlePlayerChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver onRestart={handleRematch} winner={winner} />
        )}
        <GameBoard onSelectSquare={handleSelectSquares} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
      {console.log(activePlayer)}
    </>
  );
}

export default App;

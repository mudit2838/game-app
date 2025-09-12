import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TicTacToeGame = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null)); // 3x3 grid flattened
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
      [0, 4, 8], [2, 4, 6],             // diagonals
    ];

    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // 'X' or 'O'
      }
    }

    return board.every(cell => cell !== null) ? 'Draw' : null;
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsXTurn(!isXTurn);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Games
      </button>

      <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            className="w-24 h-24 text-4xl font-bold bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center"
          >
            {cell}
          </button>
        ))}
      </div>

      {!winner ? (
        <h2 className="text-xl mb-6">Turn: {isXTurn ? 'X' : 'O'}</h2>
      ) : (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-green-400">
            {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}
          </h2>
          <button
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;

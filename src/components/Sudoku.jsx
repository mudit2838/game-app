import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialPuzzle = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const Sudoku = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(initialPuzzle.map(row => row.slice()));
  const [highlightNumber, setHighlightNumber] = useState(null);
  const [resetKey, setResetKey] = useState(0); // Force re-render grid

  const handleChange = (row, col, value) => {
    if (value === '' || /^[1-9]$/.test(value)) {
      const newBoard = board.map(r => r.slice());
      newBoard[row][col] = value === '' ? 0 : parseInt(value);
      setBoard(newBoard);
    }
  };

  const isValidSudoku = (board) => {
    const isValidGroup = (arr) => {
      const nums = arr.filter(n => n !== 0);
      return new Set(nums).size === nums.length;
    };

    for (let r = 0; r < 9; r++) if (!isValidGroup(board[r])) return false;
    for (let c = 0; c < 9; c++) {
      const col = [];
      for (let r = 0; r < 9; r++) col.push(board[r][c]);
      if (!isValidGroup(col)) return false;
    }
    for (let br = 0; br < 3; br++)
      for (let bc = 0; bc < 3; bc++) {
        const block = [];
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 3; c++)
            block.push(board[br * 3 + r][bc * 3 + c]);
        if (!isValidGroup(block)) return false;
      }

    return true;
  };

  const checkSolution = () => {
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (board[r][c] === 0) {
          alert('⚠️ Please fill all cells.');
          return;
        }

    if (isValidSudoku(board)) alert('🎉 Congratulations! Sudoku Solved!');
    else alert('❌ Oops! Mistake Found.');
  };

  const resetBoard = () => {
    setBoard(initialPuzzle.map(row => row.slice()));
    setHighlightNumber(null);
    setResetKey(prev => prev + 1);  // Increment to force re-render
  };

  const getRemainingCount = (num) => {
    let totalFilled = 0;
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (board[r][c] === num) totalFilled++;

    const remaining = 9 - totalFilled;
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative p-6">

      {/* Back to Games Button */}
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
      >
        ← Back to Games
      </button>

      <h1 className="text-4xl font-extrabold text-red-500 mb-6">Sudoku Game</h1>

      {/* Sudoku Grid */}
      <div key={resetKey} className="grid grid-rows-9 gap-[1px] border-4 border-white shadow-lg">
        {board.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-9 gap-[1px]">
            {row.map((cell, cIdx) => (
              <input
                key={cIdx}
                type="text"
                maxLength="1"
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
                disabled={initialPuzzle[rIdx][cIdx] !== 0}
                className={`w-14 h-14 text-center text-xl font-bold border border-gray-500
                  ${(Math.floor(rIdx / 3) + Math.floor(cIdx / 3)) % 2 === 0
                    ? 'bg-gray-700'
                    : 'bg-gray-800'}
                  ${highlightNumber && cell === highlightNumber ? 'bg-yellow-500' : ''}
                  disabled:bg-gray-600 disabled:text-white cursor-pointer`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Number Palette */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 mb-6">
        {[1,2,3,4,5,6,7,8,9].map(num => (
          <button
            key={num}
            className={`relative w-14 h-14 flex items-center justify-center font-bold text-xl border-2 rounded
              ${highlightNumber === num
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-600'}`}
            onClick={() => setHighlightNumber(highlightNumber === num ? null : num)}
          >
            {num}
            <span className="absolute top-0 right-1 text-xs text-gray-300">
              {getRemainingCount(num)}
            </span>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={checkSolution}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Check Solution
        </button>
        <button
          onClick={resetBoard}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Reset Board
        </button>
      </div>
    </div>
  );
};

export default Sudoku;

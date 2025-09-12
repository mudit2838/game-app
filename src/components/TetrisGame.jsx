import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

// All possible Tetris shapes
const shapes = [
  [[1, 1, 1, 1]],          // I Shape
  [[1, 1], [1, 1]],        // O Shape
  [[0, 1, 0], [1, 1, 1]],    // T Shape
  [[1, 1, 0], [0, 1, 1]],    // S Shape
  [[0, 1, 1], [1, 1, 0]],    // Z Shape
  [[1, 0, 0], [1, 1, 1]],    // L Shape
  [[0, 0, 1], [1, 1, 1]],     // J Shape
  [[1], [1], [1], [1]]      // I Shape     
];

// Pick a random shape
const randomShape = () => shapes[Math.floor(Math.random() * shapes.length)];

const TetrisGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const gridRef = useRef(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const pieceRef = useRef({ shape: randomShape(), x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [_, setRender] = useState(0); // Used to force re-render

  // Drawing the grid and current piece
  const draw = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    // Draw placed blocks
    gridRef.current.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val) {
          ctx.fillStyle = 'green';
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = 'black';
          ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });

    // Draw current moving piece
    pieceRef.current.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val) {
          ctx.fillStyle = 'red';
          ctx.fillRect((pieceRef.current.x + x) * BLOCK_SIZE, (pieceRef.current.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctx.strokeStyle = 'black';
          ctx.strokeRect((pieceRef.current.x + x) * BLOCK_SIZE, (pieceRef.current.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
  };

  // Check for collisions
  const collide = (dx, dy, shape = pieceRef.current.shape, pos = pieceRef.current) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x + dx;
          const newY = pos.y + y + dy;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && gridRef.current[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  // Fix piece into grid
  const mergePiece = () => {
    pieceRef.current.shape.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val && pieceRef.current.y + y >= 0) {
          gridRef.current[pieceRef.current.y + y][pieceRef.current.x + x] = 1;
        }
      });
    });
  };

  // Clear completed lines
  const clearLines = () => {
    let newGrid = gridRef.current.filter(row => row.some(cell => cell === 0));
    const linesCleared = ROWS - newGrid.length;

    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 10);
    }

    gridRef.current = newGrid;
  };

  // Rotate piece
  const rotate = (matrix) => {
    const N = matrix.length;
    const rotated = Array.from({ length: N }, () => Array(matrix[0].length).fill(0));

    for (let y = 0; y < N; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        rotated[x][N - 1 - y] = matrix[y][x];
      }
    }

    return rotated;
  };

  // Drop piece (controlled by useCallback for stability)
  const drop = useCallback(() => {
    if (gameOver) return;

    if (!collide(0, 1)) {
      pieceRef.current.y += 1;
    } else {
      mergePiece();
      clearLines();
      pieceRef.current = { shape: randomShape(), x: 3, y: 0 };

      if (collide(0, 0, pieceRef.current.shape, pieceRef.current)) {
        setGameOver(true);
      }
    }

    setRender(r => r + 1); // Force re-render
  }, [gameOver]);

  // Game loop: drop piece every 500ms
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(drop, 500);
    return () => clearInterval(interval);
  }, [gameOver, drop]);

  // Keyboard input controls
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;

      if (e.code === 'ArrowLeft' && !collide(-1, 0)) {
        pieceRef.current.x -= 1;
      }
      if (e.code === 'ArrowRight' && !collide(1, 0)) {
        pieceRef.current.x += 1;
      }
      if (e.code === 'ArrowDown') {
        drop();
      }
      if (e.code === 'ArrowUp') {
        const rotated = rotate(pieceRef.current.shape);
        if (!collide(0, 0, rotated)) {
          pieceRef.current.shape = rotated;
        }
      }

      setRender(r => r + 1);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameOver, drop]);

  // Always draw current state
  useEffect(() => {
    draw();
  });

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative">
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Games
      </button>

      <h1 className="text-4xl font-bold text-red-500 mb-4">Tetris</h1>
      <p className="text-white text-xl mb-4">Score: {score}</p>

      <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="border-2 border-white" />

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-5xl text-red-500 font-bold mb-4">Game Over!</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Restart
          </button>
            <p className="text-white text-xl mb-4">Score: {score}</p>
          <button
            onClick={() => navigate('/games')}
            className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Games
          </button>

        </div>
      )}
    </div>
  );
};

export default TetrisGame;

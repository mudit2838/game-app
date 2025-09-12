import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ROWS = 20;
const COLS = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const SnakeGame = () => {
  const navigate = useNavigate();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef(null);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(DIRECTIONS.ArrowRight);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key]) {
        setDirection(DIRECTIONS[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    intervalRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check boundaries
        if (
          newHead.x < 0 ||
          newHead.x >= COLS ||
          newHead.y < 0 ||
          newHead.y >= ROWS ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          clearInterval(intervalRef.current);
          setGameOver(true);
          return prevSnake;
        }

        const hasEatenFood = newHead.x === food.x && newHead.y === food.y;

        if (hasEatenFood) {
          setScore((prev) => prev + 1);
          setFood({
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS),
          });
          return [newHead, ...prevSnake];
        }

        const newSnake = [newHead, ...prevSnake];
        newSnake.pop(); // Remove tail

        return newSnake;
      });
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [direction, food, gameOver]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative">

      {/* Back to Games Button */}
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
      >
        ← Back to Games
      </button>

      <h1 className="text-4xl font-bold text-red-500 mb-6">Snake Game</h1>

      {/* Score Display */}
      <div className="text-xl text-white font-semibold mb-4">Score: {score}</div>

      {/* Game Grid */}
      <div
        className="grid bg-gray-800 border-4 border-white"
        style={{
          gridTemplateRows: `repeat(${ROWS}, 1.5rem)`,
          gridTemplateColumns: `repeat(${COLS}, 1.5rem)`,
        }}
      >
        {[...Array(ROWS)].map((_, rowIdx) =>
          [...Array(COLS)].map((_, colIdx) => {
            const isSnakeCell = snake.some((s) => s.x === colIdx && s.y === rowIdx);
            const isFoodCell = food.x === colIdx && food.y === rowIdx;
            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`w-6 h-6 border border-gray-700 ${isSnakeCell ? 'bg-green-500' : isFoodCell ? 'bg-red-600' : 'bg-gray-900'
                  }`}
              />
            );
          })
        )}
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-8 text-center shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-lg mb-4">Your final score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Restart
            </button>
            <button
              onClick={() => navigate('/games')}
              className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Games
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;

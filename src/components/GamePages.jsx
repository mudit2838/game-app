import React from 'react';
import { useNavigate } from 'react-router-dom';

const gamesList = [
  { id: 1, name: 'Space Invaders', route: 'space-invaders', image: 'space.avif' },
  { id: 2, name: 'Pac-Man', route: 'pacman', image: 'pac-man.avif' },
  { id: 3, name: 'Tetris', route: 'tetris', image: 'tetris.jpg' },
  { id: 4, name: 'Snake', route: 'snake', image: 'snake.png' },
  { id: 5, name: 'Sudoku', route: 'sudoku', image: 'sudoku.webp' },
  { id: 6, name: 'Tic-Tac-Toe', route: 'tic-tac-toe', image: 'tic.png' },
];

const placeholderImage = 'placeholder.png';

const GamesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white relative overflow-y-auto">
      {/* Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Home
      </button>

      <h1 className="text-4xl text-red-500 font-extrabold text-center mt-8 mb-10">
        Available Games
      </h1>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-8">
        {gamesList.map((game) => (
          <div
            key={game.id}
            className="bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col items-center"
          >
            {/* Image Container */}
            <div className="flex justify-center items-center bg-gray-800 h-48 w-full">
              <img
                src={game.image.trim() ? game.image : placeholderImage}
                alt={game.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Text & Button */}
            <div className="p-4 text-center">
              <h2 className="text-2xl font-semibold text-red-500 mb-4">{game.name}</h2>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate(`/games/${game.route}`)}
              >
                Start Game
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;

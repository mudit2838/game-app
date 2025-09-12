import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Same sample list of games
const gamesList = [
  { id: 1, name: 'Space Invaders', image: 'https://via.placeholder.com/600x400?text=Space+Invaders' },
  { id: 2, name: 'Pac-Man', image: 'https://via.placeholder.com/600x400?text=Pac-Man' },
  { id: 3, name: 'Tetris', image: 'https://via.placeholder.com/600x400?text=Tetris' },
  { id: 4, name: 'Super Mario', image: 'https://via.placeholder.com/600x400?text=Super+Mario' },
];

const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the game by id
  const game = gamesList.find((game) => game.id === parseInt(id));

  if (!game) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl text-red-500">Game Not Found</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Games
      </button>

      <h1 className="text-5xl font-extrabold text-red-500 mb-6">{game.name}</h1>

      <img src={game.image} alt={game.name} className="w-full max-w-2xl object-cover rounded-lg shadow-lg mb-6" />

      <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded">
        Play {game.name}
      </button>
    </div>
  );
};

export default GameDetailPage;

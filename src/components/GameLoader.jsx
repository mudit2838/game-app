import React from 'react';
import { useParams } from 'react-router-dom';
import SpaceInvadersGame from './SpaceInvadersGame';
import TetrisGame from './tetrisGame';
import PacMan from './PacMan';
import TicTacToe from './TicTacToe';
import Sudoku from './Sudoku';
import SnakeGame from './SnakeGame';

// import other games as needed

const GameLoader = () => {
  const { gameId } = useParams();

  switch (gameId) {
    case 'space-invaders':
      return <SpaceInvadersGame />;
    case 'tetris':
      return <TetrisGame />;
    case 'pacman':
      return <PacMan/>
    case 'snake':
      return <SnakeGame/>
    case 'tic-tac-toe':
      return <TicTacToe/>
    case 'sudoku':
     return <Sudoku/>
    // Add more games here
    default:
      return (
        <div className="text-center text-red-600 text-3xl mt-10">
          Game not found!
        </div>
      );
  }
};

export default GameLoader;

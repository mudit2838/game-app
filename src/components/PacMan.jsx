import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PacManGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const keys = useRef({});
  const pacman = useRef({ x: 100, y: 100, size: 20, direction: 'right', mouthOpen: true });
  const speed = 5;
  const dots = useRef([]);
  const walls = useRef([]);
  const powerPellets = useRef([]);
  const ghosts = useRef([
    { x: 300, y: 200, size: 20, dx: 2, dy: 2, vulnerable: false }
  ]);
  const lastMouthToggle = useRef(0);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const width = canvas.width;
    const height = canvas.height;

    pacman.current = { x: width / 2, y: height / 2, size: 20, direction: 'right', mouthOpen: true };
    dots.current = [];
    powerPellets.current = [];
    walls.current = [
      { x: 200, y: 150, width: 400, height: 20 },
      { x: 200, y: 300, width: 20, height: 200 },
    ];

    for (let i = 50; i < width - 50; i += 40) {
      for (let j = 50; j < height - 50; j += 40) {
        dots.current.push({ x: i, y: j, size: 6 });
      }
    }

    // Add a few power pellets
    powerPellets.current.push(
      { x: 150, y: 150, size: 10 },
      { x: width - 150, y: height - 150, size: 10 }
    );

    const handleKeyDown = (e) => (keys.current[e.code] = true);
    const handleKeyUp = (e) => (keys.current[e.code] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    let animationFrameId;

    const gameLoop = (timestamp) => {
      if (gameOver) return;

      ctx.clearRect(0, 0, width, height);

      // Toggle mouth animation every 200 ms
      if (timestamp - lastMouthToggle.current > 200) {
        pacman.current.mouthOpen = !pacman.current.mouthOpen;
        lastMouthToggle.current = timestamp;
      }

      // Move Pac-Man
      if (keys.current['ArrowUp']) {
        pacman.current.y -= speed;
        pacman.current.direction = 'up';
      }
      if (keys.current['ArrowDown']) {
        pacman.current.y += speed;
        pacman.current.direction = 'down';
      }
      if (keys.current['ArrowLeft']) {
        pacman.current.x -= speed;
        pacman.current.direction = 'left';
      }
      if (keys.current['ArrowRight']) {
        pacman.current.x += speed;
        pacman.current.direction = 'right';
      }

      // Prevent out of bounds
      pacman.current.x = Math.max(0, Math.min(width - pacman.current.size, pacman.current.x));
      pacman.current.y = Math.max(0, Math.min(height - pacman.current.size, pacman.current.y));

      // Draw walls
      ctx.fillStyle = 'blue';
      walls.current.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

        if (
          pacman.current.x < wall.x + wall.width &&
          pacman.current.x + pacman.current.size > wall.x &&
          pacman.current.y < wall.y + wall.height &&
          pacman.current.y + pacman.current.size > wall.y
        ) {
          // Bounce back
          if (keys.current['ArrowUp']) pacman.current.y += speed;
          if (keys.current['ArrowDown']) pacman.current.y -= speed;
          if (keys.current['ArrowLeft']) pacman.current.x += speed;
          if (keys.current['ArrowRight']) pacman.current.x -= speed;
        }
      });

      // Collect dots
      ctx.fillStyle = 'yellow';
      dots.current = dots.current.filter(dot => {
        const dist = Math.hypot(pacman.current.x - dot.x, pacman.current.y - dot.y);
        if (dist < pacman.current.size) {
          setScore(prev => prev + 1);
          return false;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });


      ctx.fillStyle = 'orange';
      powerPellets.current = powerPellets.current.filter(pellet => {
        const dist = Math.hypot(pacman.current.x - pellet.x, pacman.current.y - pellet.y);
        if (dist < pacman.current.size) {
          setScore(prev => prev + 5);
          ghosts.current.forEach(ghost => (ghost.vulnerable = true));
          return false;
        }
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, pellet.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // Draw Pac-Man with mouth animation
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      const pacX = pacman.current.x + pacman.current.size / 2;
      const pacY = pacman.current.y + pacman.current.size / 2;
      const startAngle = pacman.current.mouthOpen ? 0.25 * Math.PI : 0;
      const endAngle = pacman.current.mouthOpen ? 1.75 * Math.PI : 2 * Math.PI;
      ctx.arc(pacX, pacY, pacman.current.size / 2, startAngle, endAngle, false);
      ctx.lineTo(pacX, pacY);
      ctx.fill();

      // Update and draw ghosts
      ghosts.current.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        if (ghost.x <= 0 || ghost.x + ghost.size >= width) ghost.dx *= -1;
        if (ghost.y <= 0 || ghost.y + ghost.size >= height) ghost.dy *= -1;

        ctx.fillStyle = ghost.vulnerable ? 'lightblue' : 'red';
        ctx.beginPath();
        ctx.arc(ghost.x + ghost.size / 2, ghost.y + ghost.size / 2, ghost.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Collision with Pac-Man
        const dist = Math.hypot(pacman.current.x - ghost.x, pacman.current.y - ghost.y);
        if (dist < pacman.current.size) {
          if (ghost.vulnerable) {
            ghost.x = Math.random() * (width - ghost.size);
            ghost.y = Math.random() * (height - ghost.size);
            ghost.vulnerable = false;
            setScore(prev => prev + 10);
          } else {
            setLives(prev => prev - 1);
            pacman.current.x = width / 2;
            pacman.current.y = height / 2;
          }
        }
      });

      if (lives <= 0 || (dots.current.length === 0 && powerPellets.current.length === 0)) {
        setGameOver(true);
        return;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, lives]);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded z-10"
      >
        Back to Games
      </button>

      {!gameStarted ? (
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded text-xl z-10"
          onClick={() => {
            setScore(0);
            setLives(3);
            setGameOver(false);
            setGameStarted(true);
          }}
        >
          ▶ Play Pac-Man
        </button>
      ) : (
        <>
          <div className="text-center mb-4 z-10">
            <h1 className="text-4xl font-extrabold text-yellow-500">Pac-Man</h1>
            <p className="text-white text-xl mt-4">Score: {score}</p>
            <p className="text-white text-lg mt-1">Lives: {lives}</p>
          </div>

          <canvas ref={canvasRef} className="w-full h-full" />

          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
              <div className="text-center">
                <h2 className="text-5xl text-red-500 font-bold mb-4">Game Over</h2>
                <p className="text-white text-xl mt-2">Score: {score}</p>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
                  onClick={() => setGameStarted(false)}
                >
                  Restart Game
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
        </>
      )}
    </div>
  );
};

export default PacManGame;

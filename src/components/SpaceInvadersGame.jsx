import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SpaceInvadersGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const keys = useRef({});
  const playerX = useRef(0);
  const playerWidth = 50;
  const playerHeight = 20;
  const playerSpeed = 7;

  const bullets = useRef([]);
  const enemies = useRef([]);
  const enemyBullets = useRef([]);
  const lastPlayerBulletTime = useRef(0);
  const lastEnemyBulletTime = useRef(0);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const width = canvas.width;
    const height = canvas.height;

    playerX.current = width / 2;
    bullets.current = [];
    enemies.current = [];
    enemyBullets.current = [];
    lastPlayerBulletTime.current = 0;
    lastEnemyBulletTime.current = 0;

    for (let i = 0; i < 5; i++) {
      enemies.current.push({
        x: 100 + i * 120,
        y: 50,
        width: 40,
        height: 20,
        direction: 1,
      });
    }

    const handleKeyDown = (e) => (keys.current[e.code] = true);
    const handleKeyUp = (e) => (keys.current[e.code] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;

    const gameLoop = (timestamp) => {
      if (gameOver || gameWon) return;

      ctx.clearRect(0, 0, width, height);

      // Player Movement
      if (keys.current['ArrowLeft'] && playerX.current > 0) playerX.current -= playerSpeed;
      if (keys.current['ArrowRight'] && playerX.current < width - playerWidth) playerX.current += playerSpeed;

      // Player bullets
      if (keys.current['Space']) {
        if (timestamp - lastPlayerBulletTime.current > 300) {
          bullets.current.push({
            x: playerX.current + playerWidth / 2 - 2,
            y: height - 60, // Slightly above the player block
            width: 4,
            height: 10,
          });
          lastPlayerBulletTime.current = timestamp;
        }
      }

      // Draw Player
      ctx.fillStyle = 'red';
      ctx.fillRect(playerX.current, height - 50, playerWidth, playerHeight);

      // Update bullets
      bullets.current = bullets.current.filter((b) => b.y > 0);
      bullets.current.forEach((b) => {
        b.y -= 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Update enemies
      let hitEdge = false;
      enemies.current.forEach((enemy) => {
        enemy.x += enemy.direction * 2;
        if (enemy.x + enemy.width >= width || enemy.x <= 0) hitEdge = true;

        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      if (hitEdge) {
        enemies.current.forEach((enemy) => {
          enemy.direction *= -1;
          enemy.y += 20;
        });
      }

      // Enemies fire bullets
      if (timestamp - lastEnemyBulletTime.current > 1000 && enemies.current.length > 0) {
        const randomEnemy = enemies.current[Math.floor(Math.random() * enemies.current.length)];
        enemyBullets.current.push({
          x: randomEnemy.x + randomEnemy.width / 2 - 2,
          y: randomEnemy.y + randomEnemy.height,
          width: 4,
          height: 10,
        });
        lastEnemyBulletTime.current = timestamp;
      }

      // Update enemy bullets
      enemyBullets.current = enemyBullets.current.filter((b) => b.y < height);
      enemyBullets.current.forEach((b) => {
        b.y += 5;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(b.x, b.y, b.width, b.height);

        if (
          b.x < playerX.current + playerWidth &&
          b.x + b.width > playerX.current &&
          b.y + b.height > height - 50
        ) {
          setHealth((prev) => prev - 1);
          enemyBullets.current = enemyBullets.current.filter((bullet) => bullet !== b);
        }
      });

      if (health <= 0) {
        setGameOver(true);
        return;
      }

      // Collision detection (player bullets vs enemies)
      const bulletsToRemove = new Set();
      const enemiesToRemove = new Set();
      bullets.current.forEach((bullet, bIndex) => {
        enemies.current.forEach((enemy, eIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            bulletsToRemove.add(bIndex);
            enemiesToRemove.add(eIndex);
          }
        });
      });

      if (bulletsToRemove.size > 0 && enemiesToRemove.size > 0) {
        Array.from(bulletsToRemove).sort((a, b) => b - a).forEach((idx) => bullets.current.splice(idx, 1));
        Array.from(enemiesToRemove).sort((a, b) => b - a).forEach((idx) => enemies.current.splice(idx, 1));
        setScore((prev) => prev + 10 * enemiesToRemove.size);
      }

      if (enemies.current.length === 0) {
        setGameWon(true);
        return;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, gameWon, health]);

  return (
    <div className="w-full h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
      <button
        onClick={() => navigate('/games')}
        className="absolute top-5 right-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded z-10"
      >
        Back to Games
      </button>

      {!gameStarted ? (
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded text-xl z-10"
          onClick={() => {
            setScore(0);
            setHealth(3);
            setGameOver(false);
            setGameWon(false);
            setGameStarted(true);
          }}
        >
          ▶ Play Space Invaders
        </button>
      ) : (
        <>
          <div className="text-center mb-4 z-10">
            <h1 className="text-4xl font-extrabold text-red-500">Space Invaders</h1>
            <p className="text-white text-xl mt-9">Score: {score}</p>
            <p className="text-white text-lg mt-1">Health: {health}</p>
          </div>

          <canvas ref={canvasRef} className="w-full h-full" />

          {(gameOver || gameWon) && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
              <div className="text-center">
                <h2 className="text-5xl text-red-500 font-bold mb-4">
                  {gameWon ? '🎉 You Win! 🎉 ' : 'Game Over'}
                   <p className="text-white text-xl mt-9">Score: {score}</p>
                </h2>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setGameStarted(false);
                    setScore(0);
                    setHealth(3);
                    setGameOver(false);
                    setGameWon(false);
                  }}
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

export default SpaceInvadersGame;

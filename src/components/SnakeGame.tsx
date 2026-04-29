import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
  className?: string;
}

const GRID_SIZE = 20;
const TILE_COUNT = 25; // 20 * 25 = 500px canvas size
const CANVAS_SIZE = GRID_SIZE * TILE_COUNT;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: 0 };

export function SnakeGame({ onScoreChange, className = '' }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Game state refs to avoid stale closures in requestAnimationFrame
  const displayScore = useRef(0);
  const snake = useRef<Point[]>([...INITIAL_SNAKE]);
  const direction = useRef<Point>({ ...INITIAL_DIRECTION });
  const nextDirection = useRef<Point>({ ...INITIAL_DIRECTION });
  const apple = useRef<Point>({ x: 15, y: 15 });
  const lastRenderTime = useRef<number>(0);
  const SPEED = 12; // Moves per second (higher is faster)

  // Needs to be focusable to capture local keyboard events if preferred over window,
  // but we'll use window with a check, or just straightforward window for simplicity.
  
  const resetGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = { x: 0, y: 0 };
    nextDirection.current = { x: 0, y: 0 };
    // random apple position
    apple.current = { 
      x: Math.floor(Math.random() * (TILE_COUNT - 2)) + 1, 
      y: Math.floor(Math.random() * (TILE_COUNT - 2)) + 1 
    };
    setIsGameOver(false);
    setIsStarted(true);
    setScore(0);
    displayScore.current = 0;
    if (onScoreChange) onScoreChange(0);
  }, [onScoreChange]);

  const updateHighScore = useCallback(() => {
    setHighScore(prev => Math.max(prev, displayScore.current));
  }, []);

  const updateGame = useCallback(() => {
    // Only update if moving
    if (nextDirection.current.x === 0 && nextDirection.current.y === 0) return;

    direction.current = { ...nextDirection.current };
    
    // Calculate new head
    const head = { ...snake.current[0] };
    head.x += direction.current.x;
    head.y += direction.current.y;

    // Check collision with walls
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      setIsGameOver(true);
      updateHighScore();
      return;
    }

    // Check collision with self
    for (const segment of snake.current) {
      if (head.x === segment.x && head.y === segment.y) {
        setIsGameOver(true);
        updateHighScore();
        return;
      }
    }

    // Move snake
    snake.current.unshift(head);

    // Check apple
    if (head.x === apple.current.x && head.y === apple.current.y) {
      // Ate apple
      const newScore = displayScore.current + 10;
      displayScore.current = newScore;
      setScore(newScore);
      if (onScoreChange) onScoreChange(newScore);
      
      // Place new apple away from snake edges
      let newApple = { x: 0, y: 0 };
      let valid = false;
      while (!valid) {
        newApple = { 
          x: Math.floor(Math.random() * (TILE_COUNT - 2)) + 1, 
          y: Math.floor(Math.random() * (TILE_COUNT - 2)) + 1 
        };
        valid = !snake.current.some(s => s.x === newApple.x && s.y === newApple.y);
      }
      apple.current = newApple;
    } else {
      // Didn't eat, remove tail
      snake.current.pop();
    }
  }, [onScoreChange, updateHighScore]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid (optional subtle background)
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.03)';
    ctx.lineWidth = 1;
    for(let i=0; i<=TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
    }

    // Draw Apple (Neon Pink/Red)
    ctx.fillStyle = '#ef4444'; // Red
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    
    // Pulse effect for apple
    const pulseRadius = GRID_SIZE / 2 - 2 + Math.sin(Date.now() / 150) * 2;
    ctx.beginPath();
    ctx.arc(
      apple.current.x * GRID_SIZE + GRID_SIZE / 2, 
      apple.current.y * GRID_SIZE + GRID_SIZE / 2, 
      Math.max(2, pulseRadius), 
      0, 2 * Math.PI
    );
    ctx.fill();

    // Reset shadow for snake segments
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#4ade80';

    // Draw Snake
    snake.current.forEach((point, index) => {
      // Head is brighter
      if (index === 0) {
        ctx.fillStyle = '#86efac';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = '#22c55e';
        ctx.shadowBlur = 8;
      }
      
      ctx.fillRect(
        point.x * GRID_SIZE + 1, 
        point.y * GRID_SIZE + 1, 
        GRID_SIZE - 2, 
        GRID_SIZE - 2
      );
    });
    
    ctx.shadowBlur = 0; // reset

    // Draw Overlays
    if (!isStarted && !isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#4ade80';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4ade80';
      ctx.fillText('PRESS ANY ARROW KEY TO START', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4ade80';
      ctx.fillStyle = '#4ade80';
      ctx.font = '16px monospace';
      ctx.fillText(`SCORE: ${displayScore.current}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
      ctx.fillText('PRESS ENTER TO RESTART', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 50);
    }
  }, [isGameOver, isStarted]);

  // Main game loop
  const gameLoop = useCallback((currentTime: number) => {
    window.requestAnimationFrame(gameLoop);
    
    const secondsSinceLastRender = (currentTime - lastRenderTime.current) / 1000;
    if (secondsSinceLastRender < 1 / SPEED) return;

    if (!isGameOver && isStarted) {
      lastRenderTime.current = currentTime;
      updateGame();
      drawGame();
    } else {
      drawGame(); // Continue drawing static frame
    }
  }, [isGameOver, isStarted, updateGame, drawGame]);

  // Start the gameloop
  useEffect(() => {
    const req = window.requestAnimationFrame(gameLoop);
    return () => window.cancelAnimationFrame(req);
  }, [gameLoop]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys inside the game context
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          resetGame();
        }
        return;
      }

      if (!isStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setIsStarted(true);
      }

      const dir = direction.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y !== 1) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y !== -1) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x !== 1) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x !== -1) nextDirection.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isStarted, resetGame]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex justify-between w-full max-w-[500px] mb-6 font-mono">
        <div className="bg-gray-950/80 backdrop-blur border-2 border-green-500 rounded px-6 py-2 shadow-[0_0_12px_rgba(34,197,94,0.3)_inset] text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)] text-lg">
          SCORE: {score}
        </div>
        <div className="bg-gray-950/80 backdrop-blur border-2 border-blue-500 rounded px-6 py-2 shadow-[0_0_12px_rgba(59,130,246,0.3)_inset] text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)] text-lg">
          HIGH: {highScore}
        </div>
      </div>
      
      <div className="p-3 border-4 border-green-500 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.3)_inset,0_0_40px_rgba(34,197,94,0.3)] bg-gray-950 relative">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_50%,transparent_50%)] bg-[length:100%_4px] opacity-20 mix-blend-overlay z-10"></div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black rounded border border-gray-800"
        />
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState, useCallback } from 'react';

type Point = { x: number, y: number };

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const GAME_SPEED = 50; // ms per frame

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  // Refs for game loop to avoid dependency issues
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const directionRef = useRef(direction);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);
  const trailRef = useRef<{x: number, y: number, opacity: number}[]>([]);

  useEffect(() => {
    snakeRef.current = snake;
    foodRef.current = food;
    directionRef.current = direction;
    gameOverRef.current = gameOver;
    isPausedRef.current = isPaused;
  }, [snake, food, direction, gameOver, isPaused]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setDirection({ x: 0, y: -1 });
    setFood(generateFood(initialSnake));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
    trailRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOverRef.current) {
          resetGame();
        } else {
          setIsPaused(p => !p);
        }
        return;
      }

      if (isPausedRef.current || gameOverRef.current) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      if (time - lastTime < GAME_SPEED) return;
      lastTime = time;

      if (gameOverRef.current || isPausedRef.current) return;

      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const dir = directionRef.current;

      head.x += dir.x;
      head.y += dir.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(currentSnake));
      } else {
        const popped = currentSnake.pop();
        if (popped) {
          trailRef.current.push({ ...popped, opacity: 0.8 });
        }
      }

      // Update trail opacities
      trailRef.current = trailRef.current
        .map(t => ({ ...t, opacity: t.opacity - 0.08 }))
        .filter(t => t.opacity > 0);

      setSnake(currentSnake);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [generateFood, onScoreChange]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw food
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(
      food.x * CELL_SIZE,
      food.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    // Draw trail
    trailRef.current.forEach(segment => {
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255, 0, 255, ${segment.opacity})`;
      ctx.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
    });

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      } else {
        const opacity = Math.max(0.3, 1 - (index / snake.length));
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 0, 255, ${opacity})`;
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 40px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FATAL_ERROR', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
      
      ctx.fillStyle = '#00ffff';
      ctx.font = '24px "VT323", monospace';
      ctx.fillText('PRESS [SPACE] TO REBOOT', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 40px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM_HALTED', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }

  }, [snake, food, gameOver, isPaused]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="bg-[#000000] border-4 border-dashed border-[#ff00ff] block"
      />
    </div>
  );
}

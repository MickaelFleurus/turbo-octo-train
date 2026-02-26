"use client"
import React, { useState, useEffect, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Coordinate = [number, number];
type Tetrominos = 'T' | 'L' | 'I' | 'O';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const CELL_SIZE = 10; // Pixels?

const Tetris: React.FC = () => {
    const [snake, setSnake] = useState<Coordinate[]>([[10, 10]]);
    const [food, setFood] = useState<Coordinate>([15, 15]);
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    // Generate random food position
    const generateFood = useCallback(() => {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        setFood([x, y]);
    }, []);

    // Game loop
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setSnake((prevSnake) => {
                // Use nextDirection and validate it's not opposite to current direction
                let currentDirection = direction;
                if (
                    (direction === 'UP' && nextDirection !== 'DOWN') ||
                    (direction === 'DOWN' && nextDirection !== 'UP') ||
                    (direction === 'LEFT' && nextDirection !== 'RIGHT') ||
                    (direction === 'RIGHT' && nextDirection !== 'LEFT')
                ) {
                    currentDirection = nextDirection;
                    setDirection(nextDirection);
                }

                const head = prevSnake[0];
                let newHead: Coordinate;

                switch (currentDirection) {
                    case 'UP':
                        newHead = [head[0], head[1] - 1];
                        break;
                    case 'DOWN':
                        newHead = [head[0], head[1] + 1];
                        break;
                    case 'LEFT':
                        newHead = [head[0] - 1, head[1]];
                        break;
                    case 'RIGHT':
                        newHead = [head[0] + 1, head[1]];
                        break;
                }

                // Check wall collision
                if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check self collision
                if (prevSnake.some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1])) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food collision
                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    generateFood();
                    setScore((prev) => prev + 1);
                    return newSnake;
                }

                return newSnake.slice(0, -1);
            });
        }, 300);

        return () => clearInterval(interval);
    }, [direction, gameOver, food, generateFood, nextDirection]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log("TODO");
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            console.log("TODO");
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

        };
    }, []);

    const resetGame = () => {
        setSnake([[10, 10]]);
        setFood([15, 15]);
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        setGameOver(false);
        setScore(0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="text-4xl font-bold text-white mb-4">Snake Game</h1>
            <p className="text-xl text-white mb-4">Score: {score}</p>

            <div className="relative border-4 border-white" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE, backgroundColor: '#1a1a1a' }}>
                {/* Snake */}
                {snake.map((segment, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            left: segment[0] * CELL_SIZE,
                            top: segment[1] * CELL_SIZE,
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            backgroundColor: idx === 0 ? '#00ff00' : '#00cc00',
                        }}
                    />
                ))}

                {/* Food */}
                <div
                    style={{
                        position: 'absolute',
                        left: food[0] * CELL_SIZE,
                        top: food[1] * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: '#ff0000',
                    }}
                />
            </div>

            {gameOver && (
                <div className="mt-4 text-center">
                    <p className="text-2xl text-red-500 mb-4">Game Over! Final Score: {score}</p>
                    <button
                        onClick={resetGame}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Play Again
                    </button>
                </div>
            )}

            <p className="text-white mt-4">Use arrow keys to move</p>
        </div>
    );
};

export default Snake;

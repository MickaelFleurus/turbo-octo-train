"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';

import { Game2048Constants } from '@/utils/2048/Game2048Constants';

type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
type Coordinate = [number, number];
type Tile = {
    value: number;
    coord: Coordinate;
    isNew?: boolean;
};

const Game2048: React.FC = () => {

    const [gameOver, setGameOver] = useState(false);
    const [grid, setGrid] = useState<Array<Array<number>>>(Array.from({ length: 4 }, () => Array(4).fill(0)));
    const transpose = (matrix: number[][]): number[][] => {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    };

    const moveDirection = useCallback((direction: Direction) => {
        if (!grid || grid.length === 0) return;  // Guard clause

        const compact = (line: number[]) => {
            return line.filter(v => v !== 0);
        };

        const merge = (line: number[]) => {
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1] && line[i] !== 0) {
                    line[i] *= 2;
                    line.splice(i + 1, 1);
                }
            }
            return line;
        };

        const move = (line: number[]) => {
            let compacted = compact(line);
            let merged = merge(compacted);
            while (merged.length < 4) merged.push(0);
            return merged;
        };

        let newGrid = grid.map(row => [...row]);

        if (direction === 'LEFT') {
            newGrid = newGrid.map(row => move(row));
        } else if (direction === 'RIGHT') {
            newGrid = newGrid.map(row => move(row.reverse()).reverse());
        } else if (direction === 'UP') {
            newGrid = transpose(newGrid);
            newGrid = newGrid.map(row => move(row));
            newGrid = transpose(newGrid);
        } else if (direction === 'DOWN') {
            newGrid = transpose(newGrid);
            newGrid = newGrid.map(row => move(row.reverse()).reverse());
            newGrid = transpose(newGrid);
        }


        let freeCell = new Array<Coordinate>();

        let j = 0;
        newGrid.map(row => {
            row.forEach((value, index) => {
                if (value == 0)
                    freeCell.push([j, index]);
            });
            j++;
        });


        if (freeCell.length == 0 && newGrid.toString() == grid.toString()) {
            setGameOver(true);
        } else {
            const index = Math.floor(freeCell.length * Math.random());
            const cellCoord = freeCell[index];
            newGrid[cellCoord[0]][cellCoord[1]] = 2;
        }

        setGrid(newGrid);
    }, [grid]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    moveDirection("LEFT");
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    moveDirection("RIGHT");
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    moveDirection("UP");
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    moveDirection("DOWN");
                    e.preventDefault();
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [moveDirection]);

    useEffect(() => {
        resetGame();
    }, []);

    const randomNumber = () => { return Math.floor(Math.random() * 4); }

    const resetGame = () => {
        const newGrid = Array.from({ length: 4 }, () => Array(4).fill(0));

        setGameOver(false);
        newGrid[randomNumber()][randomNumber()] = 2;
        newGrid[randomNumber()][randomNumber()] = 2;

        setGrid(newGrid);
        setGameOver(false);
    };

    const getColor = (value: number) => {
        if (value <= 64) {
            const ratio = Math.min(value / 64, 1);
            return chroma.mix('#f66464', '#ff0000', ratio).hex();
        }
        if (value <= 2048) {
            const ratio = Math.min(value / 2048, 1);
            return chroma.mix('#64f69c', '#ffdd00', ratio).hex();
        }

        const ratio = Math.min(value / 32768, 1);
        return chroma.mix('#ffdd00', '#f200ff', ratio).hex();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className="flex gap-8 items-start">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    padding: '12px',
                    width: Game2048Constants.GRID_SIZE,
                    height: Game2048Constants.GRID_SIZE,
                    backgroundColor: '#a44700',
                    boxSizing: 'border-box', borderRadius: '8px'
                }}>
                    {grid.flat().map((cell, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: cell == 0 ? '#ffffff22' : getColor(cell),
                                border: '1px solid #444444',
                                borderRadius: '8px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                aspectRatio: '1 / 1',
                                overflow: 'hidden',
                                lineHeight: '1'
                            }}
                        >
                            {cell !== 0 && cell}
                        </div>
                    ))}
                </div>

            </div >


            {
                gameOver && (
                    <div className="mt-4 text-center">
                        <p className="text-2xl text-red-500 mb-4">Game Over!</p>
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Play Again
                        </button>
                    </div>
                )
            }

            <p className="text-white mt-4">Use the directional arrows to merge the numbers!</p>
        </div >
    );
};

export default Game2048;

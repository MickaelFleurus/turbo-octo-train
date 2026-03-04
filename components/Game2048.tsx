"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';

import { Game2048Constants } from '@/utils/2048/Game2048Constants';

type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
type Tile = {
    id: number;
    value: number;
    row: number;
    col: number;
    isNew?: boolean;
};

const Game2048: React.FC = () => {

    const [gameOver, setGameOver] = useState(false);
    const tileIdRef = useRef(0);
    const [grid, setGrid] = useState<Array<Tile>>(new Array<Tile>());
    const transpose = (matrix: number[][]): number[][] => {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    };

    const moveDirection = useCallback((direction: Direction) => {
        if (!grid || grid.length === 0) return;

        let newTiles = grid.map(tile => ({ ...tile }));
        let merged = new Set<number>();
        if (direction === 'LEFT') {
            for (let row = 0; row < 4; ++row) {
                const rowTiles = newTiles.filter(tile => { return tile.row == row }).sort();
                let col = 0;
                for (let i = 0; i < rowTiles.length; i++) {
                    if (i > 0 && rowTiles[i].value === rowTiles[i - 1].value && !merged.has(rowTiles[i - 1].id)) {
                        rowTiles[i - 1].value *= 2;
                        merged.add(rowTiles[i].id);
                    } else {
                        if (rowTiles[i].col !== col) {
                            rowTiles[i].col = col;
                        }
                        col++;
                    }
                }
            }
        } else if (direction === 'RIGHT') {
            for (let row = 3; row >= 0; --row) {
                const rowTiles = newTiles.filter(tile => { return tile.row == row }).sort((a, b) => { return b.col - a.col; });
                let col = 3;
                for (let i = 0; i < rowTiles.length; i++) {
                    if (i > 0 && rowTiles[i].value === rowTiles[i - 1].value && !merged.has(rowTiles[i - 1].id)) {
                        rowTiles[i - 1].value *= 2;
                        merged.add(rowTiles[i].id);
                    } else {
                        if (rowTiles[i].col !== col) {
                            rowTiles[i].col = col;
                        }
                        col--;
                    }
                }
            }
        } else if (direction === 'UP') {
            for (let col = 0; col < 4; ++col) {
                const colTiles = newTiles.filter(tile => { return tile.col == col }).sort();
                let row = 0;
                for (let i = 0; i < colTiles.length; i++) {
                    if (i > 0 && colTiles[i].value === colTiles[i - 1].value && !merged.has(colTiles[i - 1].id)) {
                        colTiles[i - 1].value *= 2;
                        merged.add(colTiles[i].id);
                    } else {
                        if (colTiles[i].row !== row) {
                            colTiles[i].row = row;
                        }
                        row++;
                    }
                }
            }
        } else if (direction === 'DOWN') {
            for (let col = 3; col >= 0; --col) {
                const colTiles = newTiles.filter(tile => { return tile.col == col }).sort((a, b) => { return b.col - a.col; });
                let row = 3;
                for (let i = 0; i < colTiles.length; i++) {
                    if (i > 0 && colTiles[i].value === colTiles[i - 1].value && !merged.has(colTiles[i - 1].id)) {
                        colTiles[i - 1].value *= 2;
                        merged.add(colTiles[i].id);
                    } else {
                        if (colTiles[i].row !== row) {
                            colTiles[i].row = row;
                        }
                        row--;
                    }
                }
            }
        }
        const finalTiles = newTiles.filter(t => !merged.has(t.id));

        // Spawn new tile
        if (finalTiles.length < 16) {
            let row: number, col: number;
            do {
                row = Math.floor(Math.random() * 4);
                col = Math.floor(Math.random() * 4);
            } while (finalTiles.some(t => t.row === row && t.col === col));

            finalTiles.push({
                id: tileIdRef.current++,
                value: 2,
                row,
                col,
                isNew: true
            });
        }
        setGrid(finalTiles);
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
        const newGrid = new Array<Tile>(2);

        setGameOver(false);
        for (let i = 0; i < 2; i++) {
            newGrid[i] = {
                id: tileIdRef.current++,
                value: 2,
                row: randomNumber(),
                col: randomNumber(),
                isNew: true
            };
        }
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
                    position: 'relative',
                    width: Game2048Constants.GRID_PADDING * 2 + 4 * Game2048Constants.CELL_SIZE + 3 * Game2048Constants.GAP,
                    height: Game2048Constants.GRID_PADDING * 2 + 4 * Game2048Constants.CELL_SIZE + 3 * Game2048Constants.GAP,
                    padding: `${Game2048Constants.GRID_PADDING}px`,
                    backgroundColor: '#a44700',
                    borderRadius: '8px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: `${Game2048Constants.GAP}px`
                }}>
                    {/* Grid background */}
                    {Array.from({ length: 16 }).map((_, idx) => (
                        <div key={`bg-${idx}`} style={{
                            backgroundColor: '#ffffff22',
                            borderRadius: '8px'
                        }} />
                    ))}

                    {/* Animated tiles */}
                    {grid.map(tile => (
                        <motion.div
                            key={tile.id}
                            layoutId={`tile-${tile.id}`}
                            initial={{
                                scale: tile.isNew ? 0 : 1, opacity: 0,
                                left: tile.col * (Game2048Constants.CELL_SIZE + 12) + 12,
                                top: tile.row * (Game2048Constants.CELL_SIZE + 12) + 12
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                left: tile.col * (Game2048Constants.CELL_SIZE + 12) + 12,
                                top: tile.row * (Game2048Constants.CELL_SIZE + 12) + 12
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                position: 'absolute',
                                width: Game2048Constants.CELL_SIZE,
                                height: Game2048Constants.CELL_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: getColor(tile.value),
                                borderRadius: '8px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#ffffff'
                            }}
                        >
                            {tile.value}
                        </motion.div>
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

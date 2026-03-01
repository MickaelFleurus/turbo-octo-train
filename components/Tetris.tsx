"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TetrisGrid } from '@/utils/TetrisGrid';
import { TetrisPiece, TetrisPieceType, TryFallResult, getRandomEnumValue } from '@/utils/TetrisPiece';
import { TetrisGameConstants } from '@/utils/TetrisConstants';

type Direction = 'LEFT' | 'RIGHT' | 'NONE';
type Action = "ROTATE_CLOCKWISE" | "ROTATE_COUNTERCLOCKWISE" | 'PLACE' | 'NONE';


const CELL_SIZE = 30;

const Tetris: React.FC = () => {
    const [gridState, setGridState] = useState<Array<Array<boolean>>>(Array.from({ length: TetrisGameConstants.GRID_HEIGHT }, () => Array(TetrisGameConstants.GRID_WIDTH).fill(false)));
    const gridRef = useRef<TetrisGrid>(new TetrisGrid());
    const [currentTetromino, setCurrentTetromino] = useState<TetrisPiece>(new TetrisPiece(getRandomEnumValue<TetrisPieceType>(TetrisPieceType), gridRef.current));
    const action = useRef<Action>('NONE');
    const direction = useRef<Direction>('NONE');
    const [started, setStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const lastFallTimeRef = useRef<number>(0);
    const fallInterval = useRef<number>(250);
    const lastMoveTimeRef = useRef<number>(0);
    const moveInterval = 100;
    const [nextPieces, setNextPieces] = useState<Array<TetrisPieceType>>(new Array<TetrisPieceType>(3));
    const nextPiecesRef = useRef<Array<TetrisPieceType>>(new Array<TetrisPieceType>(3));
    const stuckCountRef = useRef<number>(0);


    const selectNextPieceRef = useCallback(() => {

        const nextPiece = nextPiecesRef.current.shift();
        if (nextPiece !== undefined)
            setCurrentTetromino(new TetrisPiece(nextPiece, gridRef.current));
        nextPiecesRef.current.push(getRandomEnumValue<TetrisPieceType>(TetrisPieceType));
        setNextPieces([...nextPiecesRef.current]);
        stuckCountRef.current = 0;
    }, [currentTetromino, nextPieces]);

    // Game loop
    useEffect(() => {
        if (gameOver || !started) return;
        let hasChanged = false;
        const interval = setInterval(() => {
            const now = Date.now();

            // Handle piece falling
            if (now - lastFallTimeRef.current >= fallInterval.current) {
                const fallResult = currentTetromino.tryFall();
                if (fallResult === TryFallResult.Stuck) {
                    ++stuckCountRef.current
                    if (stuckCountRef.current == 3) {
                        const lineRemoved = gridRef.current.verifyCompleteLines();
                        setScore(score + 100 * lineRemoved);
                        selectNextPieceRef();
                        fallInterval.current = 250;
                    }
                } else if (fallResult === TryFallResult.Lost) {
                    setGameOver(true);
                } else {
                    stuckCountRef.current = 0;
                }
                lastFallTimeRef.current = now;
                hasChanged = true;
            }
            if (now - lastMoveTimeRef.current >= moveInterval) {
                if (direction.current !== 'NONE') {
                    if (direction.current === 'LEFT') {
                        currentTetromino.tryMoveLeft();
                    } else if (direction.current === 'RIGHT') {
                        currentTetromino.tryMoveRight();
                    }
                    hasChanged = true;
                    lastMoveTimeRef.current = now;
                }

            }
            if (action.current != 'NONE') {
                if (action.current === 'ROTATE_CLOCKWISE' && currentTetromino.canRotate(true)) {
                    currentTetromino.rotate(true);
                } else if (action.current === 'ROTATE_COUNTERCLOCKWISE' && currentTetromino.canRotate(false)) {
                    currentTetromino.rotate(false);
                } else if (action.current === 'PLACE') {
                    fallInterval.current = 10;
                }
                action.current = 'NONE';
            }

            if (hasChanged)
                setGridState([...gridRef.current.grid]);
        }, 16);


        return () => clearInterval(interval);
    }, [gameOver, currentTetromino, started]);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    direction.current = 'LEFT';
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    direction.current = 'RIGHT';
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    action.current = "ROTATE_CLOCKWISE";
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    action.current = "ROTATE_COUNTERCLOCKWISE";
                    e.preventDefault();
                    break;
                case ' ':
                    action.current = "PLACE";
                    e.preventDefault();
                    break;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    direction.current = 'NONE';
                    e.preventDefault();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const resetGame = () => {
        direction.current = 'NONE';
        gridRef.current.resetGrid();
        setGridState([...gridRef.current.grid]);
        setGameOver(false);
        setScore(0);
        setStarted(true);
        nextPiecesRef.current = new Array<TetrisPieceType>(getRandomEnumValue<TetrisPieceType>(TetrisPieceType), getRandomEnumValue<TetrisPieceType>(TetrisPieceType), getRandomEnumValue<TetrisPieceType>(TetrisPieceType));
        setNextPieces([...nextPiecesRef.current]);
        selectNextPieceRef();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <p className="text-xl text-white mb-4">Score: {score}</p>
            <div className="flex gap-8 items-start">
                <div className="relative border box-border" style={{ width: TetrisGameConstants.GRID_WIDTH * CELL_SIZE, height: TetrisGameConstants.GRID_HEIGHT * CELL_SIZE, backgroundColor: '#1a1a1a' }}>
                    {gridState.map((row, y) => (
                        row.map((cell, x) => (
                            <div
                                key={`${y}-${x}`}
                                style={{
                                    position: 'absolute',
                                    left: x * CELL_SIZE,
                                    top: y * CELL_SIZE,
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    backgroundColor: cell ? '#00ff00' : '#1a1a1a',
                                    border: cell ? 'none' : '1px solid #444444',
                                    boxSizing: 'border-box',
                                }}
                            />
                        ))
                    ))}
                </div>
                {/* Next Pieces */}
                <div className="text-white">
                    <fieldset className="border box-border" style={{ padding: '1rem' }}>
                        <legend>Next pieces:</legend>
                        <div className="relative border box-border" style={{ backgroundColor: '#1a1a1a' }}>
                            {nextPieces.map((piece, idx) => {
                                const getPieceLook = (piece: TetrisPieceType): boolean[] => {
                                    let look = new Array<boolean>(16);
                                    look.fill(false);
                                    switch (piece) {
                                        case TetrisPieceType.Tee:
                                            look[1] = true;
                                            look[5] = true;
                                            look[9] = true;
                                            look[6] = true;
                                            break;
                                        case TetrisPieceType.L:
                                            look[1] = true;
                                            look[5] = true;
                                            look[9] = true;
                                            look[10] = true;
                                            break;
                                        case TetrisPieceType.ReverseL:
                                            look[2] = true;
                                            look[6] = true;
                                            look[10] = true;
                                            look[9] = true;
                                            break;
                                        case TetrisPieceType.I:
                                            look.fill(true, 4, 8);
                                            break;
                                        case TetrisPieceType.Cube:
                                            look[5] = true;
                                            look[6] = true;
                                            look[9] = true;
                                            look[10] = true;
                                            break;
                                        case TetrisPieceType.N:
                                            look[2] = true;
                                            look[5] = true;
                                            look[6] = true;
                                            look[9] = true;
                                            break;
                                        case TetrisPieceType.ReverseN:
                                            look[1] = true;
                                            look[5] = true;
                                            look[6] = true;
                                            look[10] = true;
                                            break;
                                    }
                                    return look;
                                };
                                const pieceLook = getPieceLook(piece);
                                const PREVIEW_CELL_SIZE = 20;

                                return (
                                    <div key={idx} className="mb-4" style={{ marginBottom: '1rem' }}>
                                        <div className="relative border box-border" style={{ width: PREVIEW_CELL_SIZE * 4, height: PREVIEW_CELL_SIZE * 4, backgroundColor: '#1a1a1a' }}>
                                            {pieceLook.map((cell, cellIdx) => {
                                                const x = cellIdx % 4;
                                                const y = Math.floor(cellIdx / 4);
                                                return (
                                                    <div
                                                        key={cellIdx}
                                                        style={{
                                                            position: 'absolute',
                                                            left: x * PREVIEW_CELL_SIZE,
                                                            top: y * PREVIEW_CELL_SIZE,
                                                            width: PREVIEW_CELL_SIZE,
                                                            height: PREVIEW_CELL_SIZE,
                                                            backgroundColor: cell ? '#00ff00' : '#1a1a1a',
                                                            border: cell ? 'none' : '1px solid #444444',
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>
                </div>
            </div >
            {
                !started && (<div className="mt-4 text-center">
                    <button
                        onClick={resetGame}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Play!
                    </button>
                </div>)

            }

            {
                gameOver && (
                    <div className="mt-4 text-center">
                        <p className="text-2xl text-red-500 mb-4">Game Over! Final Score: {score}</p>
                        <button
                            onClick={resetGame}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Play Again
                        </button>
                    </div>
                )
            }

            <p className="text-white mt-4">Left and right arrows to move on the sides.</p>
            <p className="text-white mt-4">Up and Down arrows to rotate the current piece.</p>
            <p className="text-white mt-4">Space to directly place the current piece.</p>
        </div >
    );
};

export default Tetris;

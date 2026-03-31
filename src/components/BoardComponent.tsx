import React, {FC, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
    setIsGameEnded: (isGameEnded: boolean) => void
    isGameEnded: boolean;
    isGamePaused: boolean;
    setResult: (result: { winner: Colors | null; reason: "checkmate" | "stalemate" | "timeout" | null }) => void;
    setUndoStack: (undoStack: Board[] | ((prev: Board[]) => Board[])) => void;
    setRedoStack: (redoStack: Board[] | ((prev: Board[]) => Board[])) => void;
}

const BoardComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, swapPlayer, isGameEnded, setIsGameEnded, isGamePaused, setResult, setUndoStack, setRedoStack}) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [checkedCell, setCheckedCell] = useState<Cell | null>(null);

    function makeMove(from: Cell, to: Cell) {
        // Save current board for undo history
        setUndoStack(prev => [...prev, board.getBoardCopy()])
        // Clear redo history after a new move
        setRedoStack([])

        // Copy board before applying move
        const newBoard = board.getBoardCopy();

        // Move figure
        const current = newBoard.getCell(from.x, from.y);
        const target = newBoard.getCell(to.x, to.y);
        newBoard.moveFigure(current, target);

        // Reset highlights and selection
        newBoard.highlightCells(null)
        setSelectedCell(null);

        // Apply updated board
        setBoard(newBoard)

        // Check game-ending conditions
        if (currentPlayer) {
            const opponent = currentPlayer.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

            // Highlight king if opponent is in check
            setCheckedCell(newBoard.getCheckedCell(opponent));

            // Checkmate
            if (newBoard.isCheckmate(opponent)) {
                setIsGameEnded(true);
                setResult({winner: opponent, reason: "checkmate"});
                return;
            }

            // Stalemate
            if (!newBoard.isInCheck(opponent) && !newBoard.hasAnyLegalMove(opponent)) {
                setIsGameEnded(true);
                setResult({winner: null, reason: "stalemate"});
                return;
            }
        }

        // End turn
        swapPlayer()
    }

    function handleCellClick(cell: Cell) {
        if(isGameEnded || isGamePaused) return;

        const isMove = selectedCell && selectedCell !== cell &&
            board.getLegalMoves(selectedCell)?.some(c => c.x === cell.x && c.y === cell.y);
        const isSelectingCell = cell.figure && cell.figure?.color === currentPlayer?.color;

        // Deselect cell on 2nd click
        if (selectedCell && cell.x === selectedCell.x && cell.y === selectedCell.y) {
            const newBoard = board.getBoardCopy();
            setSelectedCell(null);
            newBoard.highlightCells(null)
            setBoard(newBoard)
            return
        }

        if (isMove) return makeMove(selectedCell, cell)

        // Select a cell
        if (isSelectingCell) {
            const newBoard = board.getBoardCopy();
            setSelectedCell(cell);
            newBoard.highlightCells(cell)
            setBoard(newBoard)
        }
    }
    return (
        <div className="border border-stone-400 dark:border-none ml-4 mr-4 inline-block">
            <div className="grid grid-cols-8">
                {board.cells.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((cell, cellIndex) =>
                            <div className="relative" key={cell.id}>
                                <div className="flex items-center justify-center font-bold">
                                    <CellComponent
                                        click={handleCellClick}
                                        cell={cell}
                                        selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                        isChecked={checkedCell?.x === cell.x && checkedCell?.y === cell.y}
                                    />
                                </div>

                                {/* Board numeration */}
                                {cellIndex === 0 &&
                                    <span className=" text-stone-800 dark:text-white absolute top-4 -left-4 text-md pointer-events-none select-none">
                                        {8 - rowIndex}
                                    </span>
                                }
                                {cellIndex === 7 &&
                                    <span className=" text-stone-800 dark:text-white absolute top-4 -right-4 text-md pointer-events-none select-none">
                                        {8 - rowIndex}
                                    </span>
                                }
                                {rowIndex === 7 && (
                                    <span className=" text-stone-800 dark:text-white absolute -bottom-6 right-6 text-md pointer-events-none">
                                        {String.fromCharCode(65 + cellIndex)}
                                     </span>
                                )}
                                {rowIndex === 0 && (
                                    <span className=" text-stone-800 dark:text-white absolute -top-6 left-6 text-md pointer-events-none">
                                        {String.fromCharCode(65 + cellIndex)}
                                     </span>
                                )}
                            </div>)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default BoardComponent;
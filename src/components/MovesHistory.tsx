import React, {FC} from 'react';
import {Move} from "../types/move";

interface MovesHistoryProps {
    title: string;
    moves: Move[];
}

function formatMove(move: Move): string {
    if (move.castling) {
        return move.castling + (move.isCheckmate ? "#" : move.isCheck ? "+" : "");
    }
    if (move.promotion.length > 0) {
        return `${move.to}=${move.promotion[0]}${move.isCheckmate ? "#" : move.isCheck ? "+" : ""}`;
    }
    return [
        move.figure === "Pawn" && move.capture.length > 0 ? move.from.slice(0, 1) : "",
        move.figure !== "Pawn" ? move.figure[0] : "",
        move.capture.length > 0 ? "x" : "",
        move.to,
        move.isCheck && !move.isCheckmate ? "+" : "",
        move.isCheckmate ? "#" : "",
    ].join("");
}

const MovesHistory:FC<MovesHistoryProps> = ({title, moves}) => {
    return (
        <div className="flex flex-col h-full w-[200px] bg-stone-300/80 dark:bg-slate-900/80 backdrop-blur rounded-md p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <h3 className="text-stone-600 dark:text-white font-semibold mb-2 text-center">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {moves.map((move, index) => (
                    <div key={index} className="p-2 w-fit h-2 bg-stone-600/20 dark:bg-white/20 rounded flex items-center justify-center">
                        <p className="text-stone-700 dark:text-white">
                            {formatMove(move)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovesHistory;
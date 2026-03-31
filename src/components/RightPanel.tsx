import React, {FC} from 'react';
import Timer from "./Timer";
import {Player} from "../models/Player";
import MovesHistory from "./MovesHistory";
import {Move} from "../types/move";
interface timerApi {
    whiteTime: number;
    blackTime: number;
    setWhiteTime: React.Dispatch<React.SetStateAction<number>>;
    setBlackTime: React.Dispatch<React.SetStateAction<number>>;
    isGameEnded: boolean;
    isGamePaused: boolean;

}

interface RightPanelProps {
    currentPlayer: Player | null;
    blackMoves: Move[];
    whiteMoves: Move[];
    timerApi: timerApi;
}

const RightPanel: FC<RightPanelProps> = ({currentPlayer, blackMoves, whiteMoves, timerApi}) => {
    const firstMove = blackMoves.length === 0 && whiteMoves.length === 0;
    return (
        <div className="flex flex-col items-center gap-4 pl-4 h-full">
            <MovesHistory title="Black moves:" moves={blackMoves} />
            <Timer
                currentPlayer={currentPlayer}
                firstMove={firstMove}
                timerApi={timerApi}
            />
            <MovesHistory title="White moves:" moves={whiteMoves} />

        </div>
    );
};

export default RightPanel;
import React, {FC} from 'react';
import LostFigures from "./LostFigures";
import {Figure} from "../models/figures/Figure";
import PauseTimerButton from "./PauseTimerButton";

interface LeftPanelProps {
    lostBlackFigures: Figure[]
    lostWhiteFigures: Figure[]
    isGamePaused: boolean;
    setIsGamePaused: (isGamePaused: boolean) => void
}

const LeftPanel: FC<LeftPanelProps> = ({lostBlackFigures, lostWhiteFigures, isGamePaused, setIsGamePaused}) => {

    return (
        <div className="flex flex-col items-center gap-4 pr-4 h-full">
                <LostFigures title="White" figures={lostWhiteFigures}/>
                <PauseTimerButton
                    isGamePaused={isGamePaused}
                    setIsGamePaused={setIsGamePaused}
                />
                <LostFigures title="Black" figures={lostBlackFigures}/>
        </div>
    );
};

export default LeftPanel;

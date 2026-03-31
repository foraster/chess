import React, {FC} from 'react';
interface PauseTimerButtonProps {
    isGamePaused: boolean;
    setIsGamePaused: (isGamePaused: boolean) => void;

}

const PauseTimerButton: FC<PauseTimerButtonProps> = ({isGamePaused, setIsGamePaused}) => {
    return (
            <button
                type="button"
                className="h-[80px] w-[200px] bg-stone-300/80 dark:bg-slate-900/80 backdrop-blur rounded-md p-2 border-0 text-stone-600 dark:text-white font-semibold"
                onClick={() => {setIsGamePaused(!isGamePaused)}}
            >
                {isGamePaused ? "Resume" : "Pause"} Game
            </button>
    );
};

export default PauseTimerButton;
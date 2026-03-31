import React, {FC, useEffect, useRef, useState} from 'react';
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";

interface TimerProps {
    currentPlayer: Player | null;
    firstMove: boolean
    timerApi: {
        whiteTime: number;
        blackTime: number;
        setWhiteTime: React.Dispatch<React.SetStateAction<number>>;
        setBlackTime: React.Dispatch<React.SetStateAction<number>>;
        isGameEnded: boolean;
        isGamePaused: boolean;
    };
}

const Timer: FC<TimerProps> = ({currentPlayer, firstMove, timerApi}) => {
    const timerRef = useRef<null | ReturnType<typeof setInterval>>(null);
    const { whiteTime, blackTime, setWhiteTime, setBlackTime, isGameEnded, isGamePaused } = timerApi;

    useEffect(() => {
        if(!firstMove && !(isGameEnded || isGamePaused) && currentPlayer) {
            startTimer()
        } else {
            stopTimer()
        }
        return stopTimer;
    }, [firstMove, currentPlayer, isGameEnded, isGamePaused]);

    function startTimer() {
        if (timerRef.current ) {
            clearInterval(timerRef.current);
        }
        const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
        timerRef.current = setInterval(callback, 1000)
    }
    function stopTimer() {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }
    function decrementWhiteTimer() {
        setWhiteTime(prev => (prev > 0 ? prev - 1 : 0));
    }
    function decrementBlackTimer() {
        setBlackTime(prev => (prev > 0 ? prev - 1 : 0));
    }


    function formatTime(seconds: number): string {
        const MM = Math.floor(seconds / 60);
        const SS = seconds % 60;
        return `${MM}:${SS < 10 ? "0" : ""}${SS}`
    }
    return (
        <>
            <div className="flex flex-col h-fit w-[200px] bg-stone-300/80 dark:bg-slate-900/80 backdrop-blur rounded-md p-2 justify-center items-center">
                <h1 className="text-2xl text-stone-600 dark:text-white">{
                    formatTime(blackTime)}</h1>
                <h2 className="text-xl text-stone-600 dark:text-white">Black move</h2>
            </div>
            <div className="flex flex-col h-fit w-[200px] bg-stone-300/80 dark:bg-slate-900/80 backdrop-blur rounded-md p-2 justify-center items-center">
                <h1 className="text-2xl text-stone-600 dark:text-white">{
                    formatTime(whiteTime)}</h1>
                <h2 className="text-xl text-stone-600 dark:text-white">White move</h2>
            </div>
        </>
    );
};

export default Timer;
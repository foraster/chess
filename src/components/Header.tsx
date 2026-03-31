import React, {FC, useEffect, useState} from 'react';
import whiteLogo from "../assets/white-knight.png";
import {ReactComponent as SunIcon} from '../assets/icons/sun.svg'
import {ReactComponent as MoonIcon} from '../assets/icons/moon.svg'
import {Colors} from "../models/Colors";

interface HeaderProps {
    resetGame: () => void;
    onUndo: () => void;
    onRedo: () => void;
    currentTurn?: Colors;
    result: { winner: Colors | null; reason: "checkmate" | "stalemate" | "timeout" | null }
}

const Header: FC<HeaderProps> = ({resetGame, onUndo, onRedo, currentTurn, result}) => {
    const [dark, setDark] = useState(true);

    useEffect(() => {
        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [dark]);

    function handleRestart() {
        const confirmed = window.confirm("Are you sure you want to restart?");
        if (confirmed) {
            resetGame()
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-yellow-200/70 dark:border-teal-800/70 bg-stone-500/80 dark:bg-slate-900/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">

                {/* Left part: logo and title */}
                <div className="flex items-center gap-3">
                    <img className="w-8 h-8" src={whiteLogo} alt="white-knight" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-semibold text-gray-200">
                            TypeChess
                        </span>
                        <span className="text-xs text-stone-200 dark:text-gray-400 tracking-wide">
                          Rapid • 10+0
                        </span>
                    </div>
                </div>

                {/* Center part: control buttons */}
                <div className="ml-6 hidden items-center gap-2 sm:flex">
                    <button
                        onClick={onUndo}
                        className="rounded-md border border-stone-400 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-white/5"
                    >
                        Undo
                    </button>
                    <button
                        onClick={handleRestart}
                        className="rounded-md bg-stone-800 dark:bg-teal-800 px-3 py-1.5 text-sm font-medium text-gray-200 hover:opacity-90"
                    >
                        New game
                    </button>
                    <button
                        onClick={onRedo}
                        className="rounded-md border border-stone-400 dark:border-white/10 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-white/5"
                    >
                        Redo
                    </button>
                </div>

                {/* Right part: turn info and theme */}
                <div className="flex items-center gap-2">
                  <span
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-gray-200"
                      title="Side to move"
                  >
                    {!result.reason && <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            currentTurn === Colors.WHITE ? "bg-gray-200" : "bg-black"
                        }`}
                    />}
                      { result.reason ?
                          <p> {result.reason === "stalemate" ? "Draw!" : `Player ${result.winner} won!`}</p>
                          :
                          <p>{currentTurn === Colors.WHITE ? "White to move" : "Black to move"}</p>
                      }
                  </span>
                    <button
                        onClick={() => setDark((v) => !v)}
                        className="rounded-md border border-white/10 p-2 text-gray-200 hover:bg-white/5"
                        title="Toggle theme"
                        aria-label="Toggle theme"
                    >
                        {/* Change theme icon */}
                        {dark ? (
                            <SunIcon
                                className="h-5 w-5"/>
                        ) : (
                            <MoonIcon
                                className="h-5 w-5"

                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile controls */}
            <div className="sm:hidden border-t border-white/10">
                <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
                    <button
                        onClick={handleRestart}
                        className="flex-1 rounded-md bg-amber-800 dark:bg-teal-800 px-3 py-2 text-sm font-medium text-gray-200"
                    >
                        New
                    </button>
                    <button
                        onClick={onUndo}
                        className="flex-1 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-gray-200"
                    >
                        Undo
                    </button>
                    <button
                        onClick={onRedo}
                        className="flex-1 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-gray-200"
                    >
                        Redo
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
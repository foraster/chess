import React, {useEffect, useState} from 'react';
import './App.css';
import BoardComponent from "./components/BoardComponent";
import {Board} from "./models/Board";
import {Colors} from "./models/Colors";
import {Player} from "./models/Player";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import Header from "./components/Header";
import NotifyModal from "./components/NotifyModal";

function App() {
    const [board, setBoard] = useState(new Board());
    const [undoStack, setUndoStack] = useState<Board[]>([]);
    const [redoStack, setRedoStack] = useState<Board[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [result, setResult] = useState<{ winner: Colors | null; reason: "checkmate" | "stalemate" | "timeout" | null }>({ winner: null, reason: null });
    const [isGameEnded, setIsGameEnded] = useState(false);
    const [isGamePaused, setIsGamePaused] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [firstMove, setFirstMove] = useState(true);
    const [blackTime, setBlackTime] = useState(600);
    const [whiteTime, setWhiteTime] = useState(600);

    const whitePlayer= new Player(Colors.WHITE);
    const blackPlayer = new Player(Colors.BLACK);

    const timerApi = {
        whiteTime,
        blackTime,
        setWhiteTime,
        setBlackTime,
        isGameEnded,
        isGamePaused,
    };


    useEffect(() => {
        resetGame()
    }, [])

    useEffect(() => {
        if(isGameEnded) {
            endGame()
        }
    }, [isGameEnded])

    useEffect(() => {
        if (whiteTime === 0) {
            setResult({ winner: Colors.BLACK, reason: "timeout" });
            setIsGameEnded(true);
        } else if (blackTime === 0) {
            setResult({ winner: Colors.WHITE, reason: "timeout" });
            setIsGameEnded(true);
        }
    }, [whiteTime, blackTime])

    function resetGame() {
        // Create new board
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();

        // Set time - by default 10m
        setWhiteTime(600)
        setBlackTime(600)

        // Reset all flags
        setFirstMove(true);
        setIsGameEnded(false);
        setUndoStack([])
        setRedoStack([])
        setIsGameEnded(false);
        setResult({ winner: null, reason: null })

        // Set new player and board
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    function swapPlayer() {
        if(firstMove) setFirstMove(false);
        if(currentPlayer){
            setCurrentPlayer(currentPlayer.color === Colors.WHITE ? blackPlayer : whitePlayer);
        }
    }

    function endGame() {
        if (!result.reason) return;
        // Reset move's history
        setUndoStack([])
        setRedoStack([])

        if (result.reason === "checkmate") {
            setModalTitle("Checkmate")
            setModalMessage(`Player ${result.winner} won!`)
        } else if (result.reason === "stalemate") {
            setModalTitle("Stalemate");
            setModalMessage("No more moves left");
        } else if (result.reason === "timeout") {
            setModalTitle("Timeout!");
            setModalMessage(`Player ${result.winner} won!`)
        }
        setShowModal(true)
    }

    function undoMove() {
        if (undoStack.length > 0) {
            const newStack = [...undoStack]
            const current = board;
            const previous = newStack.pop()
            if (previous) {
                setUndoStack(newStack)
                setRedoStack(prev => [...prev, current])
                setBoard(previous)
                previous.highlightCells(null)
                swapPlayer()
            }
        }
    }

    function redoMove() {
        if (redoStack.length > 0) {
            const newStack = [...redoStack]
            const current = board;
            const next = newStack.pop()
            if (next) {
                setRedoStack(newStack)
                setUndoStack(prev => [...prev, current])
                setBoard(next)
                next.highlightCells(null)
                swapPlayer()
            }
        }

    }
  return (
      <div className="bg-amber-50 min-h-screen dark:bg-gray-800 text-gray-200">
          <NotifyModal isOpen={showModal} onClose={() => setShowModal(false)} title={modalTitle} message={modalMessage} />
          <Header
              currentTurn={currentPlayer?.color}
              result={result}
              resetGame={resetGame}
              onUndo={undoMove}
              onRedo={redoMove}
          />

          <main id="main" className="mx-auto max-w-6xl px-4 py-10 flex justify-center">
              <div className="grid gap-4 lg:grid-cols-[260px_544px_260px]">
                  <LeftPanel
                      lostBlackFigures={board.lostBlackFigures}
                      lostWhiteFigures={board.lostWhiteFigures}
                      isGamePaused={isGamePaused}
                      setIsGamePaused={setIsGamePaused}
                  />
                  <BoardComponent
                      board={board}
                      setBoard={setBoard}
                      currentPlayer={currentPlayer}
                      swapPlayer={swapPlayer}
                      setResult={setResult}
                      setIsGameEnded={setIsGameEnded}
                      isGameEnded={isGameEnded}
                      isGamePaused={isGamePaused}
                      setRedoStack={setRedoStack}
                      setUndoStack={setUndoStack}
                  />
                  <RightPanel
                      currentPlayer={currentPlayer}
                      whiteMoves={board.whiteMoves}
                      blackMoves={board.blackMoves}
                      timerApi={timerApi}
                  />
              </div>
          </main>
      </div>

);
}

export default App;

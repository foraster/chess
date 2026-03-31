import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Knight} from "./figures/Knight";
import {Bishop} from "./figures/Bishop";
import {Rook} from "./figures/Rook";
import {Figure, FigureNames} from "./figures/Figure";
import {Move} from "../types/move";


export class Board {
    cells: Cell[][] = []
    lostBlackFigures: Figure[] = []
    lostWhiteFigures: Figure[] = []
    blackMoves: Move[] = []
    whiteMoves: Move[] = []

    public initCells() {
        for (let i= 0; i < 8; i++) {
            const row: Cell[] = []
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 === 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null)) //black cells
                } else  {
                    row.push(new Cell(this, j, i, Colors.WHITE, null)) //white cells
                }
            }
            this.cells.push(row)
        }
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }
    private addPawns() {
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i,1), true, false)
            new Pawn(Colors.WHITE, this.getCell(i,6), true, false)
        }
    }
    private addKnights() {
        new Knight(Colors.BLACK, this.getCell(1,0))
        new Knight(Colors.BLACK, this.getCell(6,0))
        new Knight(Colors.WHITE, this.getCell(1,7))
        new Knight(Colors.WHITE, this.getCell(6,7))
    }
    private addBishops() {
        new Bishop(Colors.BLACK, this.getCell(2,0))
        new Bishop(Colors.BLACK, this.getCell(5,0))
        new Bishop(Colors.WHITE, this.getCell(2,7))
        new Bishop(Colors.WHITE, this.getCell(5 ,7))
    }
    private addKings() {
        new King(Colors.BLACK, this.getCell(4,0), true)
        new King(Colors.WHITE, this.getCell(4,7), true)
    }
    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(3,0))
        new Queen(Colors.WHITE, this.getCell(3,7))
    }
    private addRooks() {
        new Rook(Colors.BLACK, this.getCell(0,0), true)
        new Rook(Colors.BLACK, this.getCell(7,0), true)
        new Rook(Colors.WHITE, this.getCell(0,7), true)
        new Rook(Colors.WHITE, this.getCell(7,7), true)
    }
    public addFigures() {
        this.addPawns()
        this.addKnights()
        this.addBishops()
        this.addKings()
        this.addQueens()
        this.addRooks()
    }

    public addLostFigure(figure: Figure) {
        figure.color === Colors.BLACK
            ? this.lostBlackFigures.push(figure)
            : this.lostWhiteFigures.push(figure)
    }

    public getBoardCopy(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells.map(row => row.map(cell =>
            new Cell(newBoard, cell.x, cell.y, cell.color, null)
        ))

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells.length; j++) {
                const oldCell = this.cells[i][j]
                const newCell = newBoard.cells[i][j]

                if (oldCell.figure) {
                    const newFigure = oldCell.figure.clone(newCell);
                    newCell.figure = newFigure
                }
            }
        }

        newBoard.lostBlackFigures = [...this.lostBlackFigures];
        newBoard.lostWhiteFigures = [...this.lostWhiteFigures];
        newBoard.blackMoves = [...this.blackMoves];
        newBoard.whiteMoves = [...this.whiteMoves];

        return newBoard;
    }

    public getLegalMoves(from: Cell) {
        const movingFigure = from.figure
        if (!movingFigure) return;
        const color = movingFigure.color
        const legalMoves = [];

        for (let row of this.cells) {
            for (let cell of row) {
                if(!movingFigure.canMove(cell)) continue;
                else {
                    const simBoard = this.getBoardCopy()

                    const fromSim = simBoard.getCell(from.x, from.y)
                    const toSim = simBoard.getCell(cell.x, cell.y)

                    simBoard.simMoveFigure(fromSim, toSim)

                    if (!simBoard.isInCheck(color)) {
                        legalMoves.push(cell);
                    }
                }
            }
        }
        return legalMoves;
    }
    public hasAnyLegalMove(color: Colors): boolean {
        for (let row of this.cells) {
            for (let cell of row) {
                const figure = cell.figure
                if (figure && figure.color === color) {
                    const moves = this.getLegalMoves(cell) ?? []
                    if (moves && moves.length > 0) return true;
                }
            }
        }
        return false;
    }

    // Move on simulated board
    private simMoveFigure(from: Cell, to: Cell) {
        const movingFigure = from.figure
        if (!movingFigure) return;
        if (!movingFigure.canMove(to)) return;
        if(movingFigure instanceof Pawn && (to.y === 0 || to.y === 7)){
            to.figure = new Queen(movingFigure.color, to)
            to.setFigure(to.figure)
        } else {
            movingFigure.moveFigure(to)
        }
        from.figure = null;
    }

    public highlightCells(selectedCell: Cell | null) {
        if(selectedCell) {
            const legalMoves = this.getLegalMoves(selectedCell)
            if(legalMoves){
                legalMoves.forEach(cell => cell.available = true)
            }
        } else {
            for(let row of this.cells) {
                for(let cell of row) {
                    cell.available = false
                }
            }
        }
    }

    private findKingCell(color: Colors): Cell | null {
        for(let row of this.cells) {
            for(let cell of row) {
                if (cell.figure && cell.figure.name === FigureNames.KING && cell.figure.color === color) {
                    return cell;
                }
            }
        }
        return null;
    }

    public isInCheck(color: Colors): boolean {
        const kingCell = this.findKingCell(color);
        if (!kingCell) return false;

        for (let row of this.cells) {
            for (let cell of row) {
                const figure = cell.figure;
                if (figure && figure.color !== color) {
                    if (figure.canMove(kingCell)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    public isCheckmate(color: Colors): boolean {
        if (!this.isInCheck(color)) return false;
        for (let row of this.cells) {
            for (let cell of row) {
                const figure = cell.figure;
                if (figure && figure.color === color) {
                    const legalMoves = this.getLegalMoves(cell)
                    if (legalMoves && legalMoves.length > 0) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public moveFigure(from: Cell, to: Cell) {
        const movingFigure = from.figure

        if (!movingFigure) return;
        if (!movingFigure.canMove(to)) return;

        //Check for castling
        let castling: null | "O-O" | "O-O-O" = null;
        if (movingFigure instanceof King && from.y === to.y) {
            const dx = from.x - to.x;
            if (dx === -2) castling = "O-O"
            if (dx === 2) castling = "O-O-O"
        }

        // Check for capture
        let capturedFigure = "";
        if (!castling && to.figure) {
            this.addLostFigure(to.figure)
            capturedFigure = to.figure.name
        }

        // Promotion or regular move
        let promotedFigure = "";
        if(movingFigure instanceof Pawn && (to.y === 0 || to.y === 7)){
            to.figure = new Queen(movingFigure.color, to)
            promotedFigure = to.figure.name
            to.setFigure(to.figure)
        } else {
            movingFigure.moveFigure(to)
        }


        // Check for check and checkmate
        const opponentColor = movingFigure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
        const inCheck = this.isInCheck(opponentColor);
        const isCheckmate = this.isCheckmate(opponentColor);

        const move: Move = {from: from.getPositionNotation(),
            to: to.getPositionNotation(),
            figure: movingFigure.name,
            capture: capturedFigure,
            promotion: promotedFigure,
            castling: castling,
            isCheck: inCheck,
            isCheckmate: isCheckmate,
        }

        if (movingFigure.color === Colors.WHITE) {
            this.whiteMoves.push(move)
        } else {
            this.blackMoves.push(move)
        }


        // Reset Pawn's flags
        for (let row of this.cells) {
            for (let cell of row) {
                if(cell.figure && cell.figure instanceof Pawn && cell.figure !== movingFigure) {
                    cell.figure.hasMovedTwoCell = false
                }
            }
        }

        from.figure = null;

    }

    public getCheckedCell(color: Colors): Cell | null {
        return this.isInCheck(color) ? this.findKingCell(color) : null
    }
}

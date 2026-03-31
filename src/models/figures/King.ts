import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-king.png"
import whiteLogo from "../../assets/white-king.png"
import {Rook} from "./Rook";
import {start} from "node:repl";
import {Pawn} from "./Pawn";


export class King extends Figure {
    isFirstStep: boolean = true;

    constructor(color: Colors, cell: Cell, isFirstStep: boolean) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING
        this.isFirstStep = isFirstStep
    }

    private canCastleThrough(startY: number, path: number[]): boolean {
        if (this.cell.board.isInCheck(this.color)) return false;

        for (const x of path) {
            const simBoard = this.cell.board.getBoardCopy()

            const kingCell = simBoard.getCell(this.cell.x, this.cell.y)
            const targetCell = simBoard.getCell(x, startY)
            targetCell.figure = kingCell.figure;
            kingCell.figure = null;
            if (simBoard.isInCheck(this.color)) {
                return false;
            }
        }

        return true;
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target))
            return false;
        const absX = Math.abs(this.cell.x - target.x)
        const absY = Math.abs(this.cell.y - target.y)
        if (absX <= 1 && absY <= 1 && (absX !== 0 || absY !== 0))
            return true;



        //castling
        if (this.isFirstStep) {
            // start Y for black or white
            const startY = this.color === Colors.BLACK ? 0 : 7;

            //check if there rooks on their start positions and they haven't moved already

                // right castling
                const rightRook = this.cell.board.getCell(7, startY).figure
                if (rightRook instanceof Rook && rightRook.isFirstStep ) {
                    if (( this.cell.board.getCell(5, startY).isEmpty() &&
                        this.cell.board.getCell(6, startY).isEmpty()) &&
                        (target.x === 6 && target.y === startY)) {
                        if (this.canCastleThrough(startY, [5, 6])) {
                            return true;

                        }
                    }
                }


                // left castling
                const leftRook = this.cell.board.getCell(0, startY).figure

                if (leftRook instanceof Rook && leftRook.isFirstStep) {
                if ((this.cell.board.getCell(1, startY).isEmpty()
                    && this.cell.board.getCell(2, startY).isEmpty() &&
                    this.cell.board.getCell(3, startY).isEmpty()) &&
                    (target.x === 2 && target.y === startY)) {
                    if (this.canCastleThrough(startY, [2, 3])) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private castling(from: Cell, to: Cell) {
        const rook = from.figure
        if (from && rook && from.figure instanceof Rook && from.figure.isFirstStep) {
            rook.moveFigure(to)
            from.figure = null;
            if (to.figure instanceof Rook) {
                to.figure.isFirstStep = false;
            }
        }
    }

    moveFigure(target: Cell) {
        //castling

        // start Y for black or white
        const startY = this.color === Colors.BLACK ? 0 : 7;
        const dx = Math.abs(this.cell.x - target.x)

        // right castling
        if (target.x === 6 && dx === 2) {
            const rookFromCell = this.cell.board.getCell(7, startY)
            const rookToCell = this.cell.board.getCell(5, startY)
            this.castling(rookFromCell, rookToCell)
        }


        // left castling
        if (target.x === 2 && dx === 2) {
            const rookFromCell = this.cell.board.getCell(0, startY)
            const rookToCell = this.cell.board.getCell(3, startY)
            this.castling(rookFromCell, rookToCell)
        }

        super.moveFigure(target);
        this.isFirstStep = false;
    }

    public clone(cell: Cell): Figure {
        return new King(this.color, cell, this.isFirstStep)
    }
}
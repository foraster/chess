import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-pawn.png"
import whiteLogo from "../../assets/white-pawn.png"

export class Pawn extends Figure {
    isFirstStep: boolean = true;
    hasMovedTwoCell: boolean = false;

    constructor(color: Colors, cell: Cell, isFirstStep: boolean, hasMovedTwoCell: boolean) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.PAWN
        this.isFirstStep = isFirstStep
        this.hasMovedTwoCell = hasMovedTwoCell
    }
    canMove(target: Cell): boolean {
        if (!super.canMove(target))
            return false;
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
        const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

        if (((target.y === this.cell.y + direction || (this.isFirstStep &&
                target.y === this.cell.y + firstStepDirection))
            && target.x === this.cell.x && this.cell.board.getCell(target.x, target.y).isEmpty())

        ) {
            return true;
        }

        if(target.y === this.cell.y + direction && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) && this.cell.isEnemy(target)) {
            return true;
        }

        //en passant
        if ((target.y === this.cell.y + direction &&
            Math.abs(target.x - this.cell.x) === 1 && target.isEmpty()))
        {
            const enemyCell = this.cell.board.getCell(target.x, this.cell.y)
            if(enemyCell.figure instanceof Pawn
                && enemyCell.figure.color !== this.color
                && enemyCell.figure.hasMovedTwoCell) {
                return true;
           }
        }

    return false;

    }

    moveFigure(target: Cell) {
        const fromX = this.cell.x;
        const fromY = this.cell.y;

        if (Math.abs(target.x - fromX) === 1 && target.isEmpty())
        {
            const enemyCell = this.cell.board.getCell(target.x, fromY)
            console.log(
                "enemyCell:", enemyCell,
                "isPawn:", enemyCell.figure instanceof Pawn,
                "color check:", enemyCell.figure?.color !== this.color,
                "hasMovedTwoCell:", enemyCell.figure instanceof Pawn ? enemyCell.figure?.hasMovedTwoCell : "not pawn"
            );
            if(enemyCell.figure instanceof Pawn
                && enemyCell.figure.color !== this.color
                && enemyCell.figure.hasMovedTwoCell) {
                this.cell.board.addLostFigure(enemyCell.figure);
                enemyCell.figure = null;
            }
        }

        super.moveFigure(target);
        this.isFirstStep = false;
        this.hasMovedTwoCell = Math.abs(fromY - target.y) === 2;
    }

    public clone(cell: Cell): Figure {
        return new Pawn(this.color, cell, this.isFirstStep, this.hasMovedTwoCell);
    }
}
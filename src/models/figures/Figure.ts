import {Colors} from "../Colors";
import {Cell} from "../Cell";
import logo from "../../assets/black-king.png"

export enum FigureNames {
    FIGURE = "Figure",
    KING = "King",
    KNIGHT = "Knight",
    PAWN = "Pawn",
    QUEEN = "Queen",
    ROOK = "Rook",
    BISHOP = "Bishop",
}

export abstract class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id:number;


    protected constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
    }

    canMove(target: Cell) : boolean {
        if (target.figure?.color === this.color) {
            return false;
        }
        return true;
    }
    moveFigure(target: Cell) {
        this.cell = target;
        target.setFigure(this)
    }

    public abstract clone(cell: Cell): Figure
}
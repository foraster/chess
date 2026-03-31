import React, {FC} from 'react';
import {Cell} from "../models/Cell";
import {Colors} from "../models/Colors";

interface CellProps {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
    isChecked?: boolean;
}

const CellComponent: FC<CellProps> = ({cell, selected, click, isChecked}) => {
    return (
        <div
            className={
            ["w-[64px] h-[64px] flex justify-center items-center",
                cell.color === Colors.BLACK ? "bg-stone-500 dark:bg-teal-800" : "bg-amber-50 dark:bg-gray-200"
                , selected ? "!bg-amber-200 dark:!bg-teal-400" : "", cell.available &&
                cell.figure ? "!bg-red-500" : "",
                isChecked ? "!bg-rose-700" : ""
            ].join(" ")}
            onClick={() => click(cell)}
        >
            {cell.available && !cell.figure &&
                <div
                    className="w-[20px] h-[20px] rounded-full bg-amber-600 dark:bg-teal-500 bg-opacity-30"
                />
            }
            {cell.figure?.logo && <img className="w-[56px] h-[56px] relative" src={cell.figure.logo} alt={cell.figure.name} />}
        </div>
    );
};

export default CellComponent;
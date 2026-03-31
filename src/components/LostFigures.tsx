import React, {FC} from 'react';
import {Figure} from "../models/figures/Figure";

interface LostFiguresProps {
    title: string;
    figures: Figure[];
}

const LostFigures: FC<LostFiguresProps> = ({title, figures}) => {
    const figureOrder: Record<string, number> = {
        Pawn: 1,
        Knight: 3,
        Bishop: 3,
        Rook: 4,
        Queen: 6,
    }
    const score = figures.reduce((acc, fig) => {
        const value = figureOrder[fig.name];
        return acc + value;
    }, 0);

    const sortedFigures = [...figures].sort(
        (a, b) =>
            figureOrder[a.name] - figureOrder[b.name]
    );

    return (
        <div className="flex flex-col h-full w-[200px] bg-stone-300/80 dark:bg-slate-900/80 backdrop-blur rounded-md p-2">
            <h3 className="text-stone-600 dark:text-white font-semibold mb-2 text-center">{title}</h3>
                <div className="flex flex-wrap gap-2">{sortedFigures.map(figure => (
                    <div key={figure.id}>
                        {figure.logo &&
                            <div
                                 className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                                <img src={figure.logo} alt={figure.name} className="w-8 h-8 object-contain"/>
                            </div>
                        }
                    </div>)
                )}
                </div>
            <div className="mt-auto">
                {score > 0 && <span className="text-md text-gray-400">Score: {score}</span>}
            </div>
        </div>
    );
};

export default LostFigures;
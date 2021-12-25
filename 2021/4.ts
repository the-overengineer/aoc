import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { sum } from '@core/utilityBelt';


class BingoBoard extends Grid<number> {
    public static of(descriptor: String): BingoBoard {
        return new BingoBoard(
            descriptor.split('\n').map((row) =>
                row.trim().split(/\s+/).map(_ => _.toInt()),
            ),
        );
    }

    private readonly transposedGrid: Grid<number> = this.transposed();

    public getUnmarked(selected: Set<number>): Set<number> {
        return this.reduce((acc, cell) => selected.has(cell) ? acc : acc.with(cell), new Set<number>());
    }

    public isWin(selected: Set<number>): boolean {
        return this.hasRowWin(selected) || this.hasColumnWin(selected);
    }

    public getScore(selected: Set<number>, draw: number): number {
        return draw * sum(Array.from(this.getUnmarked(selected)));
    }

    private hasRowWin(selected: Set<number>): boolean {
        return this.data.some((row) => row.every((num) => selected.has(num)));
    }

    private hasColumnWin(selected: Set<number>): boolean {
        return this.transposedGrid.data.some((row) => row.every((num) => selected.has(num)));
    }
}

interface TaskInput {
    drawn: number[];
    boards: BingoBoard[];
}

function parseInput(text: string): TaskInput {
    const [drawnRow, ...boardDescriptors] = text.split('\n\n');
    const drawn = drawnRow.split(',').map(_ => _.toInt());
    const boards = boardDescriptors.map((desc) => BingoBoard.of(desc));
    return {
        drawn,
        boards,
    };
}

function task1(text: string): number | undefined {
    const input = parseInput(text);
    const drawnNumbers = new Set<number>();

    for (const draw of input.drawn) {
        drawnNumbers.add(draw);

        const winner = input.boards.find((board) => board.isWin(drawnNumbers));

        if (winner != null) {
            return winner.getScore(drawnNumbers, draw);
        }
    }
}

function task2(text: string): number | undefined {
    const input = parseInput(text);
    const drawnNumbers = new Set<number>();
    const boards = new Set(input.boards);

    for (const draw of input.drawn) {
        drawnNumbers.add(draw);

        const newestWinners = Array.from(boards).filter((board) => board.isWin(drawnNumbers));

        for (const winner of newestWinners) {
            if (winner != null) {
                boards.delete(winner);
    
                // If was last board to win
                if (boards.size === 0) {
                    return winner.getScore(drawnNumbers, draw);
                }
            }
        }
    }
}

export default Solution.raw({
    part1: task1,
    part2: task2,
});

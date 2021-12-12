import { read } from '@core/utilityBelt';

export function sum(nums: number[]): number {
    return nums.reduce((s, n) => s + n, 0);
}

export function transpose<T>(matrix: T[][]): T[][] {
    const result: T[][] = [];
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let col = 0; col < cols; col++) {
        result.push([]);
        for (let row = 0; row < rows; row++) {
        result[result.length - 1]!.push(matrix[row][col]);
        }
    }

    return result;
}

class BingoBoard {
    public static of(descriptor: String): BingoBoard {
        const grid = descriptor.split('\n').map((row) => {
            return row.trim().split(/\s+/).map((cell) => parseInt(cell.trim(), 10));
        });

        return new BingoBoard(grid);
    }

    private readonly transposedGrid: number[][];

    public constructor(
        public readonly grid: number[][],
    ) {
        this.transposedGrid = transpose(this.grid);
    }

    public getUnmarked(selected: Set<number>): Set<number> {
        const unmarked: Set<number> = new Set();

        this.grid.forEach((row) => {
            row.forEach((cell) => {
                if (!selected.has(cell)) {
                    unmarked.add(cell);
                }
            });
        });

        return unmarked;
    }

    public isWin(selected: Set<number>): boolean {
        return this.hasRowWin(selected) || this.hasColumnWin(selected);
    }

    public getScore(selected: Set<number>, draw: number): number {
        const unmarked = this.getUnmarked(selected);
        const score = draw * sum(Array.from(unmarked));
        return score;
    }

    private hasRowWin(selected: Set<number>): boolean {
        return this.grid.some((row) => row.every((num) => selected.has(num)));
    }

    private hasColumnWin(selected: Set<number>): boolean {
        return this.transposedGrid.some((row) => row.every((num) => selected.has(num)));
    }
}

interface TaskInput {
    drawn: number[];
    boards: BingoBoard[];
}

async function parseInput(path: string): Promise<TaskInput> {
    const [drawnRow, ...boardDescriptors] = await read(path).then((text) => text.split('\n\n'));
    const drawn = drawnRow.split(',').map((it) => parseInt(it, 10));
    const boards = boardDescriptors.map((desc) => BingoBoard.of(desc));
    return {
        drawn,
        boards,
    };
}

async function task1(): Promise<number | undefined> {
    const input = await parseInput('./4.txt');
    const drawnNumbers = new Set<number>();

    for (const draw of input.drawn) {
        drawnNumbers.add(draw);

        const winner = input.boards.find((board) => board.isWin(drawnNumbers));

        if (winner != null) {
            return winner.getScore(drawnNumbers, draw);
        }
    }
}

async function task2(): Promise<number | undefined> {
    const input = await parseInput('./4.txt');
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

// task1().then(console.log);
task2().then(console.log);

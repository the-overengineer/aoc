import '@core/polyfill';
import { ArraySet } from '@core/ArraySet';
import { Solution } from '@core/DaySolution';

type DotPaper = ArraySet<[number, number]>;

enum FoldDirection {
    Up = 'Up',
    Left = 'Left',
}

interface Fold {
    direction: FoldDirection;
    at: number;
}

interface TaskInput {
    dotPaper: DotPaper;
    folds: Fold[];
}

function parseInstructions(input: string): TaskInput {
    const [paper, instructionList] = input.split('\n\n');

    const dotPaper = new ArraySet<[number, number]>(
        paper.split('\n')
            .map((row) => row.split(',').map(_ => _.toInt())),
    );

    const folds = instructionList.split('\n').map((row) => {
        const [_, axis, numStr] = /^fold along ([xy])=(\d+)$/.exec(row)!;
        const direction = axis === 'x' ? FoldDirection.Left : FoldDirection.Up;
        const at = numStr.toInt();
        return {
            direction,
            at,
        };
    });

    return {
        dotPaper,
        folds,
    }
}


function foldAcross(coordinate: number, foldAxis: number): number {
    if (coordinate < foldAxis) {
        return coordinate;
    }

    const diff = coordinate - foldAxis;

    return foldAxis - diff;
}

function foldPaper(paper: DotPaper, fold: Fold): DotPaper {
    const foldedPaper: DotPaper = new ArraySet();

    for (const [x, y] of paper.toList()) {
        if (fold.direction === FoldDirection.Left && x !== fold.at) {
            foldedPaper.add([
                foldAcross(x, fold.at),
                y,
            ]);
        } else if (fold.direction === FoldDirection.Up && y !== fold.at) {
            foldedPaper.add([
                x,
                foldAcross(y, fold.at),
            ]);
        }
    }

    return foldedPaper;
}

function visualize(paper: DotPaper): string {
    const maxX = Math.max(...paper.toList().map((it) => it[0]));
    const maxY = Math.max(...paper.toList().map((it) => it[1]));

    let repr = '';

    for (let y = 0; y <= maxY; y++) {
        for (let x = 0; x <= maxX; x++) {
            repr += paper.has([x, y]) ? '#' : '.';
        }
        repr += '\n';
    }

    return repr;
}

function part1(input: string) {
    const { dotPaper, folds } = parseInstructions(input);
    const foldedPaper = foldPaper(dotPaper, folds[0]);
    return foldedPaper.size.toString();
}

function part2(input: string) {
    const { dotPaper, folds } = parseInstructions(input);
    let foldedPaper = dotPaper;

    for (const fold of folds) {
        foldedPaper = foldPaper(foldedPaper, fold);
    }
    return visualize(foldedPaper);
}

export default Solution.raw({
    part1,
    part2,
});

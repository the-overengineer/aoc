import { GenericSet } from '@core/GenericSet';
import { Grid } from '@core/Grid';
import { Solution } from '@core/DaySolution';

const MAX_GLOW = 9;

function readGrid(lines: string[]): Grid<number> {
    return new Grid(lines.map((line) => line.split('').map((it) => parseInt(it, 10))));
}

function uptickNeighbours(grid: Grid<number>, y: number, x: number): void {
    grid.getNeighbourIndices(y, x).forEach(([ny, nx]) => {
        grid.mutateAt(ny, nx, (it) => it + 1);
    });
}

function uptickGrid(grid: Grid<number>): Grid<number> {
    return grid.map((cell) => cell + 1);
}

function spreadGlow(grid: Grid<number>, flashed: GenericSet<[number, number]>): boolean {
    let changed: boolean = false;

    grid.forEach((cell, y, x) => {
        if (cell > MAX_GLOW && !flashed.has([y, x])) {
            changed = true;
            flashed.add([y, x]);
            grid.mutateAt(y, x, (it) => it + 1);
            uptickNeighbours(grid, y, x);
        }
    });

    return changed;
}

function levelOffGridAndCollectFlashes(grid: Grid<number>): number {
    let glowCounter = 0;

    grid.forEach((cell, y, x) => {
        if (cell > MAX_GLOW) {
            glowCounter++;
            grid.set(y, x, 0);
        }
    });

    return glowCounter;
}

export function octopusGlowStep(grid: Grid<number>): [Grid<number>, number] {
    const nextGrid = uptickGrid(grid);
    const flashed = new GenericSet<[number, number]>();

    let shouldPropagate = true;
    while (shouldPropagate) {
        shouldPropagate = spreadGlow(nextGrid, flashed);
    }

    const flashes = levelOffGridAndCollectFlashes(nextGrid);

    return [nextGrid, flashes];
}

function part1(lines: string[]) {
    let grid = readGrid(lines);
    let glowCounter = 0;

    for (let i = 1; i <= 100; i++) {
        const [nextGrid, glows] = octopusGlowStep(grid);
        glowCounter += glows;
        grid = nextGrid;
    }

    return glowCounter;
}

function part2(lines: string[]) {
    let grid = readGrid(lines);
    const allFlashCount = grid.width * grid.height;

    for (let i = 1 ;; i++) {
        const [nextGrid, glows] = octopusGlowStep(grid);
        grid = nextGrid;
        if (glows >= allFlashCount) {
            return i;
        }
    }
}

export default Solution.lines({
    part1,
    part2,
});

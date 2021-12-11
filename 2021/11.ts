import { ArraySet } from './ArraySet';
import { readLines } from './utilityBelt';

const MAX_GLOW = 9;

async function readGrid(path: string): Promise<number[][]> {
    const lines = await readLines(path);
    return lines.map((line) => line.split('').map((it) => parseInt(it, 10)));
}

function uptickNeighbours(grid: number[][], y: number, x: number): void {
    const offsets = [-1, 0, 1];

    for (const dy of offsets) {
        for (const dx of offsets) {
            if (dy === 0 && dx === 0) {
                continue;
            }

            if (y + dy < 0 || y + dy >= grid.length) {
                continue;
            }

            if (x + dx < 0 || x + dx >= grid[0].length) {
                continue;
            }

            grid[y + dy][x + dx] += 1;
        }
    }
}

function uptickGrid(grid: number[][]): number[][] {
    return grid.map((row) => row.map((cell) => cell + 1));
}

function spreadGlow(grid: number[][], flashed: ArraySet<[number, number]>): boolean {
    let changed: boolean = false;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] > MAX_GLOW && !flashed.has([y, x])) {
                changed = true;
                flashed.add([y, x]);
                grid[y][x] += 1;
                uptickNeighbours(grid, y, x);
            }
        }
    }

    return changed;
}

function levelOffGridAndCollectFlashes(grid: number[][]): number {
    let glowCounter = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] > MAX_GLOW) {
                glowCounter++;
                grid[y][x] = 0;
            }
        }
    }

    return glowCounter;
}

export function octopusGlowStep(grid: number[][]): [number[][], number] {
    const nextGrid = uptickGrid(grid);
    const flashed = new ArraySet<[number, number]>();

    let shouldPropagate = true;
    while (shouldPropagate) {
        shouldPropagate = spreadGlow(nextGrid, flashed);
    }

    const flashes = levelOffGridAndCollectFlashes(nextGrid);

    return [nextGrid, flashes];
}

async function part1() {
    let grid = await readGrid('./11.input');
    let glowCounter = 0;

    for (let i = 1; i <= 100; i++) {
        const [nextGrid, glows] = octopusGlowStep(grid);
        glowCounter += glows;
        grid = nextGrid;
    }

    return glowCounter;
}

async function part2() {
    let grid = await readGrid('./11.input');
    const allFlashCount = grid.length * grid[0].length;

    for (let i = 1 ;; i++) {
        const [nextGrid, glows] = octopusGlowStep(grid);
        grid = nextGrid;
        if (glows >= allFlashCount) {
            return i;
        }
    }
}

part2().then(console.log);

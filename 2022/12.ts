import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { bfs } from '@core/search';
import { isEqual, min } from '@core/utilityBelt';

function part1(input: string): number {
    const grid = parseMap(input);
    const startLocation = grid.findIndex((cell) => cell === 'S')!;
    const endLocation = grid.findIndex((cell) => cell === 'E')!;
    const [_, depth] = bfs(
        (loc) => getNeighbours(loc, grid),
        startLocation,
        (loc) => isEqual(loc, endLocation),
    )!;
    return depth;
}

function part2(input: string): number {
    const grid = parseMap(input);
    const startLocations = grid.filterIndices((cell) => cell === 'S' || cell === 'a')!;
    const endLocation = grid.findIndex((cell) => cell === 'E')!;
    const pathLengths = startLocations.map((startLocation) => {
        return bfs(
            (loc) => getNeighbours(loc, grid),
            startLocation,
            (loc) => isEqual(loc, endLocation),
        )?.[1];
    }).filter((it) => it != null);
    return min(pathLengths)!;
}

function parseMap(input: string): Grid<string> {
    return new Grid(input.split('\n').map((line) => line.split('')));
}

const MIN_HEIGHT = 'a'.charCodeAt(0);

function getHeight(cell: string): number {
    if (cell === 'S') {
        return getHeight('a');
    } else if (cell === 'E') {
        return getHeight('z');
    } else {
        return cell.charCodeAt(0) - MIN_HEIGHT;
    }
}

function getNeighbours([y, x]: [number, number], grid: Grid<string>): [number, number][] {
    const currHeight = getHeight(grid.get(y, x));
    return grid.getNeighbourIndices(y, x, false)
        .filter(([ny, nx]) => getHeight(grid.get(ny, nx)) - currHeight <= 1);
}

export default Solution.raw({
    part1,
    part2,
});

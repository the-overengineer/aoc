import { Solution } from '@core/DaySolution';
import { GenericSet } from '@core/GenericSet';
import '@core/polyfill';
import { isEqual, max, range, zip } from '@core/utilityBelt';

type PathGrid = GenericSet<[number, number]>;
const SimulationResult = {
    Settled: 'Settled',
    FellThrough: 'FellThrough',
    BlockedSource: 'BlockedSource',
} as const;
type SimulationResult = typeof SimulationResult[keyof typeof SimulationResult];

function part1(lines: string[]): number {
    const grid = parseInitialMap(lines);
    const lastRowIndex = max(grid.toList().map(([, y]) => y))!;

    let counter = 0;

    while (true) {
        const result = simulateGrainOfSand(grid, lastRowIndex);
        if (result === SimulationResult.FellThrough) {
            return counter;
        } else {
            counter++;
        }
    }
}

function part2(lines: string[]): number {
    const grid = parseInitialMap(lines);
    const lastRowIndex = max(grid.toList().map(([, y]) => y))!;
    let counter = 0;

    while (true) {
        const result = simulateGrainOfSand(grid, lastRowIndex, true);
        if (result === SimulationResult.BlockedSource) {
            return counter + 1;
        } else {
            counter++;
        }
    }
}

function parseInitialMap(lines: string[]): PathGrid {
    const grid: PathGrid = new GenericSet();
    for (const line of lines) {
        const points: [number, number][] = line.split(' -> ')
            .map((point) => point.split(',').map(_ => _.toInt()) as [number, number]);
        
        const segments = zip(points, points.slice(1));

        for (const [start, end] of segments) {
            getPoints(start, end).forEach((point) => {
                grid.add(point);
            });
        }
    }

    return grid;
}

function getPoints(start: [number, number], end: [number, number]): [number, number][] {
    const [x1, y1] = start;
    const [x2, y2] = end;

    if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return range(minY, maxY + 1).map((y) => [x1, y]);
    } else if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        return range(minX, maxX + 1).map((x) => [x, y1]);
    } else {
        throw new Error(`Not a straight line ${start} => ${end}`);
    }
}

function getNextStep(point: [number, number], map: PathGrid): [number, number] | null {
    const [x0, y0] = point;

    if (!map.has([x0, y0 + 1])) {
        return [x0, y0 + 1];
    } else if (!map.has([x0 - 1, y0 + 1])) {
        return [x0 - 1, y0 + 1];
    } else if (!map.has([x0 + 1, y0 + 1])) {
        return [x0 + 1, y0 + 1];
    } else {
        return null;
    }
}

function simulateGrainOfSand(
    map: PathGrid,
    lastRowIndex: number,
    hasFloor: boolean = false,
    startingPoint: [number, number] = [500, 0],
): SimulationResult {
    let point = startingPoint;
    while (true) {
        const nextPoint = getNextStep(point, map);
        if (nextPoint == null) { // nowhere to move
            if (isEqual(point, startingPoint)) {
                // blocked immediately
                return SimulationResult.BlockedSource;
            }
            map.add(point);
            return SimulationResult.Settled;
        } else if (nextPoint[1] > lastRowIndex && !hasFloor) {
            return SimulationResult.FellThrough;
        } else if (nextPoint[1] > lastRowIndex + 1 && hasFloor) {
            map.add(point);
            return SimulationResult.Settled;
        } else {
            point = nextPoint;
        }
    }
}

export default Solution.lines({
    part1,
    part2,
});

import { GenericSet } from '@core/GenericSet';
import { product } from '@core/utilityBelt';
import { Solution } from '@core/DaySolution';

function readMap(lines: string[]): number[][] {
    return lines.map((line) => line.split('').map((c) => parseInt(c, 10)));
}

function findNeighbours<T>(map: T[][], i: number, j: number): T[] {
    const coordinates: number[][] = [
        [i, j - 1],
        [i, j + 1],
        [i + 1, j],
        [i - 1, j],
    ].filter(([y, x]) => {
        return y >= 0 && y < map.length && x >= 0 && x < map[0].length;   
    });

    return coordinates.map(([y, x]) => map[y][x]);
}

function isLowPoint(map: number[][], i: number, j: number): boolean {
    const value = map[i][j];
    const neighbours = findNeighbours(map, i, j);
    return neighbours.every((n) => n > value);
}

function part1(lines: string[]) {
    const map = readMap(lines);
    let riskLevel = 0;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (isLowPoint(map, i, j)) {
                riskLevel += 1 + map[i][j];
            }
        }
    }

    return riskLevel;
}

type Basin = GenericSet<[number, number]>;

function flood(map: number[][], i: number, j: number, basin: Basin = new GenericSet<[number, number]>()): Basin {
    if (i < 0 || i >= map.length || j < 0 || j >= map[0].length) {
        return basin;
    }

    if (basin.has([i, j])) {
        return basin;
    }

    const value = map[i][j];

    if (value >= 9) {
        return basin;
    }

    basin.add([i, j]);

    [
        [i - 1, j],
        [i + 1, j],
        [i, j + 1],
        [i, j - 1],
    ].forEach(([y, x]) => {
        flood(map, y, x, basin);
    });

    return basin;
}

function part2(lines: string[]) {
    const map = readMap(lines);
    const basins: Array<Basin> = [];
    
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const value = map[i][j];

            if (value < 9) {
                const someBasinHasCoords = basins.some((b) => b.has([i, j]));

                if (!someBasinHasCoords) {
                    const newBasin = flood(map, i, j);

                    if (newBasin.size > 0) {
                        basins.push(newBasin);
                    }
                }
            }
        }
    }

    const biggestThreeBasinSizes = basins.map((b) => b.size).sort((a, b) => b - a).slice(0, 3);

    return product(biggestThreeBasinSizes);
}

export default Solution.lines({
    part1,
    part2,
});


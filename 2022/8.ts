import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { max, product, sum } from '@core/utilityBelt';

function part1(lines: string[]): number {
    const grid = lines.map((line) => line.split('').map(_ => _.toInt()));

    return sum(grid.map((row, x) => {
        return sum(row.map((cell, y) => isVisible(grid, [x, y], cell) ? 1 : 0));
    }));
}

function part2(lines: string[]): number {
    const grid = lines.map((line) => line.split('').map(_ => _.toInt()));

    return max(grid.map((row, x) => {
        return max(row.map((cell, y) => getScenicScore(grid, [x, y], cell))) ?? 0;
    }))!;
}

function getScenicScore(grid: number[][], startingPoint: [number, number], treeHeight: number): number {
    const directions: [number, number][] = [
        [1, 0],
        [0, -1],
        [-1, 0],
        [0, 1],
    ];

    return product(directions.map((direction) => {
        let i = 0;

        for (let point = add(startingPoint, direction); isWithin(point, grid); point = add(point, direction)) {
            const [x, y] = point;
            i++
            if (grid[x][y] >= treeHeight) {
                return i;
            }
        }

        return i;
    }));
}

function isVisible(grid: number[][], startingPoint: [number, number], treeHeight: number): boolean {
    const directions: [number, number][] = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ];

    return directions.some((direction) => {
        for (let point = add(startingPoint, direction); isWithin(point, grid); point = add(point, direction)) {
            const [x, y] = point;
            if (grid[x][y] >= treeHeight) {
                return false;
            }
        }

        return true;
    });
}

function add([x0, y0]: [number, number], [x1, y1]: [number, number]): [number, number] {
    return [x0 + x1, y0 + y1];
}

function isWithin([x, y]: [number, number], grid: number[][]) {
    const width = grid[0].length;
    const height = grid.length;

    return x >= 0 && x < width && y >= 0 && y < height;
}


export default Solution.lines({
    part1,
    part2,
});

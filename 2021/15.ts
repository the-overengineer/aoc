import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { ArrayMap } from '@core/ArrayMap';
import { ArraySet } from '@core/ArraySet';
import { argmin, isEqual, sum } from '@core/utilityBelt';

function parseGrid(rows: string[]): Grid<number> {
    return new Grid(rows.map(row => row.split('').map(it => it.toInt())));
}

function dijkstraSearch(
    graph: Grid<number>,
    source: [number, number],
    target: [number, number],
    diagonal: boolean,
): [number, number][] {
    const vertexSet: ArraySet<[number, number]> = new ArraySet();
    const closedSet: ArraySet<[number, number]> = new ArraySet();
    const dist = new ArrayMap<[number, number], number>();
    const prev = new ArrayMap<[number, number], [number, number]>();

    vertexSet.add(source);
    dist.set(source, 0);

    while (vertexSet.size > 0) {
        const vertex = argmin(vertexSet.toList(), (v) => dist.get(v));

        closedSet.add(vertex);
        vertexSet.delete(vertex);

        if (isEqual(vertex, target)) {
            const reversePath: [number, number][] = [];
            let current = target;

            while (current != null) {
                reversePath.push(current);
                current = prev.get(current)!;

                if (current == null || isEqual(current, source)) {
                    return reversePath.reverse();
                }
            }
        }

        const neighbours = graph
            .getNeighbourIndices(vertex[0], vertex[1], diagonal)
            .filter((n) => !closedSet.has(n));

        for (const neighbour of neighbours) {
            vertexSet.add(neighbour);

            const [ny, nx] = neighbour;
            const risk = graph.get(ny, nx);
            const cost = dist.get(vertex)! + risk;

            if (dist.get(neighbour) == null || cost < dist.get(neighbour)!) {
                dist.set(neighbour, cost);
                prev.set(neighbour, vertex);
            }

        }
    }

    throw new Error('Could not find shortest path!');
}


function part1(rows: string[]) {
    const grid = parseGrid(rows);
    const source: [number, number] = [0, 0];
    const target: [number, number] = [grid.data.length - 1, grid.data[0].length - 1];

    const path = dijkstraSearch(grid, source, target, false);

    return sum(path.map(([y, x]) => grid.get(y, x)));
}

function part2(rows: string[]) {
    const baseGrid = parseGrid(rows);
    let appendGrid = baseGrid;
    let grid = baseGrid.clone();

    // Construct the first row
    for (let i = 0; i < 4; i++) {
        appendGrid = appendGrid.map((cell) => cell >= 9 ? 1 : cell + 1);
        grid = grid.appendRight(appendGrid);
    }

    let appendRow = grid.clone();

    // Construct the other 4 rows
    for (let i = 0; i < 4; i++) {
        appendRow = appendRow.map((cell) => cell >= 9 ? 1 : cell + 1);
        grid = grid.appendBottom(appendRow);
    }

    const source: [number, number] = [0, 0];
    const target: [number, number] = [grid.data.length - 1, grid.data[0].length - 1];

    const path = dijkstraSearch(grid, source, target, false);

    return sum(path.map(([y, x]) => grid.get(y, x)));
}

export default Solution.lines({
    part1, // 739
    part2,
})
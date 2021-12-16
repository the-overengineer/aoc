import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { dijkstraSearch } from '@core/search';
import { sum } from '@core/utilityBelt';

function parseGrid(rows: string[]): Grid<number> {
    return new Grid(rows.map(row => row.split('').map(it => it.toInt())));
}

function part1(rows: string[]) {
    const grid = parseGrid(rows);
    const source: [number, number] = [0, 0];
    const target: [number, number] = [grid.data.length - 1, grid.data[0].length - 1];

    const path = dijkstraSearch(
        ([y, x]) => grid.getNeighbourIndices(y, x, false),
        ([y, x]) => grid.get(y, x),
        source,
        target,
    );

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

    const path = dijkstraSearch(
        ([y, x]) => grid.getNeighbourIndices(y, x, false),
        ([y, x]) => grid.get(y, x),
        source,
        target,
    );

    return sum(path.map(([y, x]) => grid.get(y, x)));
}

export default Solution.lines({
    part1, // 739
    part2,
})
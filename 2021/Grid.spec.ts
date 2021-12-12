import { deepStrictEqual as eq } from 'assert';

import { Grid } from './Grid';

describe('Grid utility', () => {
    describe('width', () => {
        it('should return 0 for empty grids', () => {
            const grid = new Grid([]);

            eq(grid.width, 0);
        });

        it('should equal the length of a row for non-empty grids', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);

            eq(grid.width, 2);
        });
    });

    describe('height', () => {
        it('should return 0 for empty grids', () => {
            const grid = new Grid([]);

            eq(grid.height, 0);
        });

        it('should equal the number of rows', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);

            eq(grid.height, 3);
        });
    });

    describe('get', () => {
        const grid = new Grid([[1, 2], [3, 4], [5, 6]]);

        it('should get the value at index', () => {
            const a = grid.get(0, 0);
            const b = grid.get(0, 1);
            const c = grid.get(1, 0);

            eq(a, 1);
            eq(b, 2);
            eq(c, 3);
        });
    });

    describe('set', () => {
        it('should update the value at position', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);

            grid.set(0, 0, 10);

            eq(grid.get(0, 0), 10);
        });
    });

    describe('mutateAt', () => {
        it('should apply the function to the value at the position', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);

            grid.mutateAt(0, 0, (it) => it * 2 + 1);

            eq(grid.get(0, 0), 3);
        });
    });

    describe('transposed', () => {
        it('should transpose the grid', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);
            const expected = [[1, 3, 5], [2, 4, 6]];

            const transposedGrid = grid.transposed();

            eq(transposedGrid.data, expected);
        });

        it('should not mutate the original', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);
            const expected = [[1, 2], [3, 4], [5, 6]];

            grid.transposed();

            eq(grid.data, expected);
        });
    });

    describe('slice', () => {
        it('should return a sub-grid for given parameters', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);
            const expected = [[4], [6]];

            const slice = grid.slice(1, 1, 2, 1);

            eq(slice.data, expected);
        });
    });

    describe('map', () => {
        it('should create a new grid with the function applied', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);
            const expected = [[2, 3], [4, 5], [6, 7]];

            const mapped = grid.map((cell) => cell + 1);
            
            eq(mapped.data, expected);
        });

        it('should get the correct indices', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);
            const expected = [[0, 1], [1, 2], [2, 3]];

            const mapped = grid.map((_cell, y, x) => y + x);

            eq(mapped.data, expected);
        });

        it('should not mutate the original', () => {
            const grid = new Grid([[1, 2], [3, 4], [5, 6]]);
            const expected = [[1, 2], [3, 4], [5, 6]];

            grid.map((cell) => cell + 1);

            eq(grid.data, expected);
        });
    });

    describe('getNeighbourIndices', () => {
        const data = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];
        const grid = new Grid(data);

        it('should return all neighbour indices, including diagonal, by default', () => {
            const expected = [
                [0, 0],
                [0, 1],
                [0, 2],
                [1, 0],
                [1, 2],
                [2, 0],
                [2, 1],
                [2, 2],
            ];

            const indices = grid.getNeighbourIndices(1, 1);

            eq(indices, expected);
        });

        it('should only return non-diagonal neighbour indices if not using diagonals', () => {
            const expected = [
                [0, 1],
                [1, 0],
                [1, 2],
                [2, 1],
            ];

            const indices = grid.getNeighbourIndices(1, 1, false);

            eq(indices, expected);
        });

        it('should not return indices under 0', () => {
            const expected = [
                [0, 1],
                [1, 0],
                [1, 1],
            ];

            const indices = grid.getNeighbourIndices(0, 0);

            eq(indices, expected);
        });

        it('should not return indices over max', () => {
            const expected = [
                [1, 1],
                [1, 2],
                [2, 1],
            ];

            const indices = grid.getNeighbourIndices(2, 2);

            eq(indices, expected);
        });
    });

    describe('getNeighbours', () => {
        const data = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];
        const grid = new Grid(data);

        it('should return all neighbour indices, including diagonal, by default', () => {
            const expected = [1, 2, 3, 4, 6, 7, 8, 9];

            const neighbours = grid.getNeighbours(1, 1);

            eq(neighbours, expected);
        });

        it('should only return non-diagonal neighbour indices if not using diagonals', () => {
            const expected = [2, 4, 6, 8];

            const neighbours = grid.getNeighbours(1, 1, false);

            eq(neighbours, expected);
        });

        it('should not return values under 0', () => {
            const expected = [2, 4, 5];

            const neighbours = grid.getNeighbours(0, 0);

            eq(neighbours, expected);
        });

        it('should not return indices over max', () => {
            const expected = [5, 6, 8];

            const neighbours = grid.getNeighbours(2, 2);

            eq(neighbours, expected);
        });
    });
});
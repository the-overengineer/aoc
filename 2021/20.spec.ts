import { deepStrictEqual as eq } from 'assert';
import { Algorithm, LightGrid } from './20';

describe.only('day 20', () => {
    describe('LightGrid', () => {
        const algorithm = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##
#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###
.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.
.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....
.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..
...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....
..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#`.split('\n').join('').split('') as Algorithm;
            const data = `#..#.
#....
##..#
..#..
..###`;

        describe('enhanceIndex', () => {
            it('should get the correct index', () => {
                const grid = LightGrid.read(data, algorithm);
                const expected = 34;

                const result = grid.enhanceIndex(2, 2);

                eq(result, expected);
                eq(algorithm[result], '#');
            });

            it('should work for the edges', () => {
                const grid = LightGrid.read(data, algorithm);
                const expected = 18;

                const result = grid.enhanceIndex(0, 0);

                eq(result, expected);
                eq(algorithm[result], '.');
            });
        });
    });
});
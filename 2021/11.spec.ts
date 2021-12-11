import { deepStrictEqual as eq } from 'assert';

import { octopusGlowStep } from './11';

function parseGrid(grid: string): number[][] {
    return grid.split('\n').map((line) => {
        return line.trim().split('').map((c) => parseInt(c, 10));
    });
}

function stringifyGrid(grid: number[][]): string {
    return grid.map((r) => r.join('')).join('\n');
}

function expectNextStep(curr: string, next: string): void {
    const currGrid = parseGrid(curr);
    const expectedGrid = parseGrid(next);

    const [nextGrid] = octopusGlowStep(currGrid);

    eq(stringifyGrid(nextGrid), stringifyGrid(expectedGrid));
}

function expectFlashes(curr: string, expected: number): void {
    const currGrid = parseGrid(curr);
    const [_, flashes] = octopusGlowStep(currGrid);

    eq(flashes, expected);
}

describe.only('day 11, 2021', () => {
    describe('octopusGlowStep', () => {
        describe('small examples', () => {
            const grid1 = `11111
            19991
            19191
            19991
            11111`;
            const grid2 = `34543
            40004
            50005
            40004
            34543`;
            const grid3 = `45654
            51115
            61116
            51115
            45654`;


            it('should match test case 1', () => {
                expectNextStep(grid1, grid2);
            });

            it('should match test case 2', () => {
                expectNextStep(grid2, grid3);
            });

            it('should flash 9 times in first step', () => {
                expectFlashes(grid1, 9);
            });
        });
    });
});

import { Solution } from '@core/DaySolution';
import '@core/polyfill';

function part1(input: string): number {
    const characters = input.split('');
    return findStreamStart(characters, 4);
}

function part2(input: string): number {
    const characters = input.split('');
    return findStreamStart(characters, 14);
}

function findStreamStart(characters: string[], checkLength: number): number {
    for (let i = checkLength; i <= characters.length; i++) {
        if (characters.slice(i - checkLength, i).toSet().size === checkLength) {
            return i;
        }
    }

    return -1;
}

export default Solution.raw({
    part1,
    part2,
});
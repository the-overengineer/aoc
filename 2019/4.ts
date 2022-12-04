import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { range, zip } from '@core/utilityBelt';

function part1(input: string): number {
    const [min, max] = getRange(input);
    const matches = range(min, max + 1).filter(satisfiesCriteria);
    return matches.length;
}

function part2(input: string): number {
    const [min, max] = getRange(input);
    const matches = range(min, max + 1).filter(satisfiesAdvancedCriteria);
    return matches.length;
}

function satisfiesCriteria(n: number): boolean {
    const digits = String(n).split('').map(_ => _.toInt());
    const pairs = zip(digits, digits.slice(1));
    const isAscending = pairs.every(([curr, next]) => next >= curr);
    const hasDouble = pairs.some(([curr, next]) => curr === next);
    return digits.length === 6 && isAscending && hasDouble;
}

function satisfiesAdvancedCriteria(n: number): boolean {
    const digits = String(n).split('').map(_ => _.toInt());
    const pairs = zip(digits, digits.slice(1));
    const isAscending = pairs.every(([curr, next]) => next >= curr);
    const hasAcceptableDouble = pairs.some(([curr, next], index) => {
        return curr === next
            && digits[index - 1] !== curr
            && digits[index + 2] !== curr;
    });
    return digits.length === 6 && isAscending && hasAcceptableDouble;
}

function getRange(input: string): [number, number] {
    return input.split('-').map(_ => _.toInt()) as [number, number];
}

export default Solution.raw({
    part1,
    part2,
});
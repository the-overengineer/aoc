import { Solution } from '@core/DaySolution';
import { sum } from '@core/utilityBelt';

function accumulateNumbers(
    struct: any,
    ignoreRed: boolean = false,
    acc: number[] = [],
): number[] {
    if (Array.isArray(struct)) {
        for (const el of struct) {
            accumulateNumbers(el, ignoreRed, acc);
        }
    } else if (typeof struct === 'object') {
        const values = Object.values(struct);

        if (ignoreRed && values.some((v) => v === 'red')) {
            return acc;
        }

        values.forEach((val) => {
            accumulateNumbers(val, ignoreRed, acc);
        });
    } else if (typeof struct === 'number') {
        acc.push(struct);
    }

    return acc;
}

function part1(raw: string): number {
    const numbers = accumulateNumbers(JSON.parse(raw));
    return sum(numbers);
}

function part2(raw: string): number {
    const numbers = accumulateNumbers(JSON.parse(raw), true);
    return sum(numbers);
}

export default Solution.raw({
    part1,
    part2,
})
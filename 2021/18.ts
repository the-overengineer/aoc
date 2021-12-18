import { Solution } from '@core/DaySolution';

export type SnailFishNum = number | [SnailFishNum, SnailFishNum];

type ReturnActionType =
    | 'Explode'
    | 'Split'
    | 'Keep'
    ;

interface ReturnActionBase {
    type: ReturnActionType;
    number: SnailFishNum;
}

interface Explode extends ReturnActionBase {
    type: 'Explode';
    left: number;
    right: number;
}

interface Split extends ReturnActionBase {
    type: 'Split';
}

interface Keep extends ReturnActionBase {
    type: 'Keep';
}

function explode(n: [number, number]): Explode {
    return {
        type: 'Explode',
        number: 0,
        left: n[0],
        right: n[1],
    };
}

function split(n: number): Split {
    return {
        type: 'Split',
        number: [
            Math.floor(n / 2),
            Math.ceil(n / 2),
        ],
    };
}

function keep(n: SnailFishNum): Keep {
    return {
        type: 'Keep',
        number: n,
    };
}

type ReturnAction =
    | Explode
    | Split
    | Keep
    ;

function isRegular(n: SnailFishNum): n is number {
    return typeof n === 'number';
}

function isExplosive(n: SnailFishNum): n is [number, number] {
    return Array.isArray(n) && n.every((sn) => isRegular(sn));
}

function shouldSplit(n: number): boolean {
    return n >= 10;
}

function shouldExplode(n: SnailFishNum, depth: number): boolean {
    return depth >= 4 && isExplosive(n);
}

export function explodeAddLeft(n: SnailFishNum, amount: number): SnailFishNum {
    if (isRegular(n)) {
        return n + amount;
    }

    const [ln, rn] = n;

    return [
        explodeAddLeft(ln, amount),
        rn,
    ];
}

export function explodeAddRight(n: SnailFishNum, amount: number): SnailFishNum {
    if (isRegular(n)) {
        return n + amount;
    }

    const [ln, rn] = n;

    return [
        ln,
        explodeAddRight(rn, amount),
    ];
}

export function reduceExplode(n: SnailFishNum, depth: number = 0): ReturnAction {
    // Case where it's a regular number, we're only testing for explosiveness here
    if (isRegular(n)) {
        return keep(n);
    }

    // We got a pair of regulars
    if (isExplosive(n)) {
        // If nested deep enough, explode, otherwise it's two regular numbers,
        // give it up
        if (shouldExplode(n, depth)) {
            return explode(n);
        } else {
            return keep(n);
        }
    }

    // Finally, we're dealing with more complex numbers, which could have exploded
    // internally
    const [ln, rn] = n;

    const leftResult = reduceExplode(ln, depth + 1);

    if (leftResult.type === 'Explode') {
        return {
            type: 'Explode',
            left: leftResult.left,
            right: 0,
            number: [leftResult.number, explodeAddLeft(rn, leftResult.right)],
        };
    }

    const righResult = reduceExplode(rn, depth + 1);

    if (righResult.type === 'Explode') {
        return {
            type: 'Explode',
            left: 0,
            right: righResult.right,
            number: [explodeAddRight(ln, righResult.left), righResult.number],
        };
    }

    return keep(n);
}

function reduceSplit(n: SnailFishNum): ReturnAction {
    if (isRegular(n)) {
        if (shouldSplit(n)) {
            return split(n);
        } else {
            return keep(n);
        }
    }

    const [ln, rn] = n;
    const leftResult = reduceSplit(ln);

    if (leftResult.type === 'Split') {
        return {
            type: 'Split',
            number: [leftResult.number, rn],
        };
    }

    const rightResult = reduceSplit(rn);

    if (rightResult.type === 'Split') {
        return {
            type: 'Split',
            number: [ln, rightResult.number],
        };
    }

    return keep(n);
}

export function reduce(n: SnailFishNum): SnailFishNum {
    let num = n;

    while (true) {
        const explodeResult = reduceExplode(num);

        if (explodeResult.type === 'Explode') {
            num = explodeResult.number;
            continue;
        }

        const splitResult = reduceSplit(num);

        if (splitResult.type === 'Split') {
            num = splitResult.number;
            continue;
        }

        return num;
    }
}

export function add(a: SnailFishNum, b: SnailFishNum): SnailFishNum {
    const baseSum: SnailFishNum = [a, b];
    return reduce(baseSum);
}

export function addAll(ns: SnailFishNum[]): SnailFishNum {
    let num = ns[0];
    let rest = ns.slice(1);

    for (const b of rest) {
        num = add(num, b);
    }

    return num;
}

export function magnitude(n: SnailFishNum): number {
    if (isRegular(n)) {
        return n;
    }

    const [ln, rn] = n;

    return 3 * magnitude(ln) + 2 * magnitude(rn);
}

function part1(input: string[]) {
    const numbers: SnailFishNum[] = input.map((row) => JSON.parse(row) as SnailFishNum);
    const sum = addAll(numbers);
    return magnitude(sum);
}

function part2(input: string[]) {
    const numbers: SnailFishNum[] = input.map((row) => JSON.parse(row) as SnailFishNum);
    let max = 0;

    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (i !== j) {
                const a = numbers[i];
                const b = numbers[j];
                const mag = magnitude(add(a, b));
                if (mag > max) {
                    max = mag;
                }
            }
        }
    }

    return max;
}

export default Solution.lines({
    part1,
    part2,
});
import { Solution } from '@core/DaySolution';
import { intersect, isEqual, min, range, sum } from '@core/utilityBelt';
import '@core/polyfill';

function part1(lines: string[]): number {
    const origin: Point = [0, 0];
    const instructions = lines.map(parseInstructions);
    const wires = instructions.map((instructions) => getWire(origin, instructions));
    const stringyWires = wires.map((wire) => wire.map((point) => point.toString()).toSet());
    const stringyIntersections = intersect(...stringyWires);
    const intersections = Array.from(stringyIntersections)
        .filter((it) => it !== '0,0')
        .map((intStr) => intStr.split(',').map(_ => _.toInt())) as Point[];
    const score = min(
        intersections.map((nums: Point): number => sum(nums.map(_ => Math.abs(_)))),
    )!;
    return score;
}

function part2(lines: string[]): number {
    const origin: Point = [0, 0];
    const instructions = lines.map(parseInstructions);
    const wires = instructions.map((instructions) => getWire(origin, instructions));
    const stringyWires = wires.map((wire) => wire.map((point) => point.toString()).toSet());
    const stringyIntersections = intersect(...stringyWires);
    const intersections = Array.from(stringyIntersections)
        .filter((it) => it !== '0,0')
        .map((intStr) => intStr.split(',').map(_ => _.toInt())) as Point[];
    const score = min(
        intersections.map((intersection: Point): number => {
            return sum(
                wires.map((wire) => {
                    return wire.findIndex((pt) => isEqual(pt, intersection));
                })
            );
        }),
    )!;
    return score;
}

function getWire(start: Point, instructions: Instruction[]): Point[] {
    const points = [start];
    let current = start;

    function append(diff: Point): void {
        current = add(current, diff);
        points.push(current);
    }

    for (const instruction of instructions) {
        const diff = diffs[instruction[0]];

        range(0, instruction[1]).forEach(() => {
            append(diff);
        });
    }

    return points;
}

function add(a: Point, b: Point): Point {
    return [
        a[0] + b[0],
        a[1] + b[1],
    ];
}

function getInstruction(raw: string): Instruction {
    return [
        raw.charAt(0) as Direction,
        raw.slice(1).toInt(),
    ];
}

function parseInstructions(raw: string): Instruction[] {
    return raw.split(',').map(getInstruction);
}

const diffs: Record<Direction, Point> = {
    'R': [0, 1],
    'D': [-1, 0],
    'L': [0, -1],
    'U': [1, 0],
};

type Y = number;
type X = number;
type Point = [Y, X];
type Direction = 'R' | 'D' | 'U' | 'L';
type Instruction = [Direction, number];

export default Solution.lines({
    part1,
    part2,
});

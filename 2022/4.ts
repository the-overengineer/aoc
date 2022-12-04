import { Solution } from '@core/DaySolution';
import '@core/polyfill';

type Range = [number, number];
type Assignment = [Range, Range];
const format = /^(\d+)-(\d+),(\d+)-(\d+)$/

function parseAssignment(line: string): Assignment {
    const [_, aFrom, aTo, bFrom, bTo] = format.exec(line)!;
    return [
        [aFrom.toInt(), aTo.toInt()],
        [bFrom.toInt(), bTo.toInt()],
    ];
}

function containsOther(range: Range, other: Range): boolean {
    const [r1, r2] = range;
    const [o1, o2] = other;
    return r1 <= o1 && r2 >= o2;
}

function overlapsOther(range: Range, other: Range): boolean {
    const [r1, r2] = range;
    const [o1, o2] = other;
    return r1 <= o1 && r2 >= o1
        || r1 <= o2 && r2 >= o2;
}

function oneIncludesAnother(a: Range, b: Range): boolean {
    return containsOther(a, b) || containsOther(b, a);
}

function oneOverlapsAnother(a: Range, b: Range): boolean {
    return overlapsOther(a, b) || overlapsOther(b, a);
}

function part1(lines: string[]): number {
    const assignments = lines.map(parseAssignment);
    const overlapping = assignments.filter(([a, b]) => oneIncludesAnother(a, b));
    return overlapping.length;
}

function part2(lines: string[]): number {
    const assignments = lines.map(parseAssignment);
    const overlapping = assignments.filter(([a, b]) => oneOverlapsAnother(a, b));
    return overlapping.length;
}

export default Solution.lines({
    part1,
    part2,
});

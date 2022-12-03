import { Solution } from '@core/DaySolution';
import { groupIntoChunks, intersect, sum } from '@core/utilityBelt';

function part1(lines: string[]): number {
    return sum(lines.map(findCommon).map(getValue));
}

function part2(lines: string[]): number {
    const chunks = groupIntoChunks(lines, 3);
    const badgeScores = chunks.map((chunk) => {
        const commonSet = intersect(...chunk.map(backpack => new Set(backpack)));
        console.assert(commonSet.size === 1, `Common set in chunk has wrong size ${Array.from(commonSet)}`);
        const commonBadge = Array.from(commonSet)[0];
        return getValue(commonBadge);
    });
    return sum(badgeScores);
}

const upperACode = 'A'.charCodeAt(0);
const lowerACode = 'a'.charCodeAt(0);

function getValue(char: string) {
    if (char.toUpperCase() === char) {
        return char.charCodeAt(0) - upperACode + 27;
    } else {
        return char.charCodeAt(0)- lowerACode + 1;
    }
}

function findCommon(line: string): string {
    const halfPoint = line.length / 2;
    const firstHalf = new Set(line.slice(0, halfPoint));
    const secondHalf = new Set(line.slice(halfPoint));
    const duplicateSet = intersect(firstHalf, secondHalf);
    console.assert(duplicateSet.size === 1, `There is more than 1 duplicate: ${duplicateSet}`);
    return Array.from(duplicateSet)[0];
}

export default Solution.lines({
    part1,
    part2,
});

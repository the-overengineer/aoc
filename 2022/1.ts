import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { sum } from '@core/utilityBelt';

type ElfCalories = number[];

function part1(lines: string[]) {
    const elves = parseInput(lines);
    return elves.reduce((max, elf) => {
        const sumCalories = sum(elf);
        return Math.max(max, sumCalories);
    }, 0);
}

function part2(lines: string[]) {
    const elves = parseInput(lines);
    const sortedElves = elves.sort((a, b) => {
        return sum(b) - sum(a);
    });

    return sum(
        sortedElves.slice(0, 3).map((items) => sum(items)),
    );
}

function parseInput(lines: string[]): ElfCalories[] {
    const elves: ElfCalories[] = [];

    let buff: ElfCalories = [];
    for (const line of lines) {
        if (line === '') {
            elves.push(buff);
            buff = [];
        } else {
            buff.push(line.toInt());
        }
    }

    elves.push(buff);
    return elves;
}

export default Solution.lines({
  part1,
  part2,
});

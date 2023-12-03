import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { sum } from '@core/utilityBelt';

function part1(lines: string[]) {
    const numbers = lines.map((line) => getNumbers(line));
    return sum(numbers);
}

function part2(lines: string[]) {
    const numbers = lines.map((line) => getNumbersOrWordNumbers(line));
    return sum(numbers);
}

function getNumbers(line: string) {
    const numbers = line.match(/\d/g)!.map(Number);
    return parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`, 10);
}

function getNumbersOrWordNumbers(line: string) {
    const numbers = [];
    let characters = Array.from(line);

    while (characters.length > 0) {
        const match = characters.join('').match(/^(?:\d|one|two|three|four|five|six|seven|eight|nine)/);

        if (match != null) {
            numbers.push(getNumberFromExpr(match[0]));
        }

        characters = characters.slice(1);
    }

    return parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`, 10);
}

function getNumberFromExpr(group: string): number {
    switch (group) {
        case 'one': return 1;
        case 'two': return 2;
        case 'three': return 3;
        case 'four': return 4;
        case 'five': return 5;
        case 'six': return 6;
        case 'seven': return 7;
        case 'eight': return 8;
        case 'nine': return 9;
        default: return parseInt(group, 10);
    }
}

export default Solution.lines({
  part1,
  part2,
});

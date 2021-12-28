import { Solution } from '@core/DaySolution';
import { sum } from '@core/utilityBelt';

function part1(lines: string[]) {
    const inputs = lines.map((line) => line.slice(1, line.length - 1));
    const representationLength = sum(lines.map((line) => line.length));
    const actualLength = sum(inputs.map(
        (input) => input.replace(/\\"/g, '"').replace(/\\x[\da-f]{2}/g, '?').replace(/\\\\/g, '\\').length,
    ));
    return representationLength - actualLength;
}

function part2(lines: string[]) {
    const representationLength = sum(lines.map((line) => line.length));
    const doubleRepresentationLength = sum(lines.map((line) => {
        return `"${line.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`.length;
    }));

    return doubleRepresentationLength - representationLength;
}

export default Solution.lines({
    part1,
    part2,
})
import '@core/polyfill';
import { Solution } from '@core/DaySolution';

interface Sue {
    index: number;
    known: Record<string, number>;
}

const facts: Record<string, number> = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
};

function parseSue(line: string): Sue {
    const [_, idxString, pairs] = /^Sue (\d+): (.+)$/.exec(line)!;
    const known = Object.fromEntries(pairs.split(', ').map((e: string) => {
        const [key, value] = e.split(': ');
        return [key.trim(), value.toInt()];
    }));
    return {
        index: idxString.toInt(),
        known,
    };
}

function part1(lines: string[]) {
    const sues = lines.map(parseSue);
    const candidates = sues.filter((sue) => Object.keys(sue.known).every((k) => sue.known[k] === facts[k]));
    return candidates[0]?.index;
}

function part2(lines: string[]) {
    const sues = lines.map(parseSue);
    const candidates = sues.filter((sue) => Object.keys(sue.known).every((k) => {
        if (k === 'cats' || k === 'trees') {
            return sue.known[k] > facts[k];
        } else if (k === 'pomeranians' || k === 'goldfish') {
            return sue.known[k] < facts[k];
        } else {
            return sue.known[k] === facts[k];
        }
    }));
    return candidates[0]?.index;
}

export default Solution.lines({
    part1,
    part2,
});

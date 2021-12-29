import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { bfs } from '@core/search';
import { findIndices, fst, init, last, replaceAtIndex, snd } from '@core/utilityBelt';

interface Problem {
    mappings: [string, string][];
    input: string;
}

function parse(lines: string[]): Problem {
    const mappings = lines.map((line) => line.split(' => ')).filter((it) => it.length === 2) as [string, string][];
    const input = last(lines);

    return {
        mappings,
        input,
    };
}

function variants(problem: Problem): Set<string> {
    const mapped = new Set<string>();

    for (const [source, target] of problem.mappings) {
        const indices = findIndices(problem.input, source);
        for (const idx of indices) {
            mapped.add(replaceAtIndex(problem.input, idx, source, target));
        }
    }

    return mapped;
}

function reduce(input: string, mappings: [string, string][]): number {
    let current = input.reverse();
    let counter = 0;
    const lookup: Record<string, string> = mappings
        .map(([a, b]) => [b.reverse(), a.reverse()])
        .reduce((acc, [a, b]) => ({ ...acc, [a]: b }), {});
    
    const replacement = new RegExp(
        Object.keys(lookup).join('|'),
        // 'g',
    );

    while (current !== 'e') {
        console.log(current);
        const prev = current;
        current = current.replace(replacement, (substr) => lookup[substr]!);
        if (current === prev) {
            throw new Error('boo!')
        }
        counter++;
    }

    return counter;
}

export function findTarget(problem: Problem) {
    const mappings = problem.mappings;
    return bfs(
        (input: string) => Array.from(variants({ input, mappings })).filter((n) => n.length <= problem.input.length),
        'e',
        (it) => it === problem.input,
    );
}

function part1(lines: string[]) {
    const problem = parse(lines);
    const mappings = variants(problem);
    return mappings.size;
}

function part2(lines: string[]) {
    const problem = parse(lines);
    return reduce(problem.input, problem.mappings);
}

export default Solution.lines({
    part1,
    part2,
});

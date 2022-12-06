import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { groupIntoChunks } from '@core/utilityBelt';

type Stacks = string[][];
type Command = {
    fromIndex: number;
    toIndex: number;
    quantity: number;
};
type Problem = {
    stacks: Stacks;
    commands: Command[];
}

function part1(lines: string[]): string {
    const problem = parse(lines);

    for (const command of problem.commands) {
        for (let i = 0; i < command.quantity; i++) {
            problem.stacks[command.toIndex].push(problem.stacks[command.fromIndex].pop()!);
        }
    }

    return problem.stacks.map((stack) => stack.peek()).join('');
}

function part2(lines: string[]): string {
    const problem = parse(lines);

    for (const { quantity, fromIndex, toIndex } of problem.commands) {
        const fromStack = problem.stacks[fromIndex];
        const toStack = problem.stacks[toIndex];
        const removed = fromStack.splice(fromStack.length - quantity, quantity);
        toStack.push(...removed);
    }

    return problem.stacks.map((stack) => stack.peek()).join('');
}

const commandMatcher = /^move (\d+) from (\d+) to (\d+)$/;

function parse(lines: string[]): Problem {
    const emptyLineIndex = lines.findIndex((line) => line === '');
    const config = lines.slice(0, emptyLineIndex - 1); // drop the numbers
    const commandLines = lines.slice(emptyLineIndex + 1);

    const crateLines = config.map(
        (line) => groupIntoChunks(line.split(''), 4).map((parts) => parts[1]),
    ).reverse();

    const stacks = Array.from({ length: crateLines[0].length}, () => []) as Stacks;

    for (const crateLine of crateLines) {
        crateLine.forEach((crate, index) => {
            if (crate.trim()) {
                stacks[index].push(crate);
            }
        })
    }

    const commands = commandLines.map((line) => {
        const [_, quantity, fromIndex, toIndex] = commandMatcher.exec(line)!;
        return {
            quantity: quantity.toInt(),
            fromIndex: fromIndex.toInt() - 1,
            toIndex: toIndex.toInt() - 1,
        };
    });

    return {
        stacks,
        commands,
    };
}

export default Solution.lines({
    part1,
    part2,
});
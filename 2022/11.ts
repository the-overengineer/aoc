import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { lcmAll, product } from '@core/utilityBelt';

type Item = number;
type Operand = Item | 'old';
const Operation = {
    Plus: '+',
    Mult: '*',
} as const;
type Operation = typeof Operation[keyof typeof Operation];
type Equation = {
    operation: Operation;
    operands: [Operand, Operand];
};
type Monkey = {
    num: number;
    worries: Item[];
    equation: Equation;
    testDivisibleBy: number;
    throwOnTrue: number;
    throwOnFalse: number;
    inspectionCounter: number;
};

function part1(input: string): number {
    const monkeys = parseMonkeys(input);

    for (let i = 0; i < 20; i++) {
        runRound(monkeys, 3);
    }

    const [a, b] = monkeys.map(_ => _.inspectionCounter)
        .sort((a, b) => b - a);

    return a * b;
}

function part2(input: string): number {
    const monkeys = parseMonkeys(input);
    const roundedAt = product(monkeys.map((m) => m.testDivisibleBy));

    for (let i = 0; i < 10_000; i++) {
        runRound(monkeys, roundedAt, false);
    }

    console.log(monkeys.map(_ => _.inspectionCounter));

    const [a, b] = monkeys.map(_ => _.inspectionCounter)
        .sort((a, b) => b - a);

    return a * b;
}


function runRound(monkeys: Monkey[], roundedAt: number, divide: boolean = true): void {
    for (const monkey of monkeys) {
        const worries = [...monkey.worries];
        monkey.worries = [];

        for (const worry of worries) {
            const updated = divide
                ? Math.floor(runEquation(worry, monkey.equation) / roundedAt)
                : runEquation(worry, monkey.equation) % roundedAt;
            const targetMonkeyNumber = updated % monkey.testDivisibleBy === 0
                ? monkey.throwOnTrue
                : monkey.throwOnFalse;
            const targetMonkey = monkeys.find((m) => m.num === targetMonkeyNumber);
            targetMonkey?.worries.push(updated);
            monkey.inspectionCounter++;
        }
    }
}

function runEquation(worry: Item, equation: Equation): Item {
    const [a, b] = equation.operands.map((o) => o === 'old' ? worry : o) as [number, number];
    return equation.operation === Operation.Mult
        ? a * b
        : a + b;
}

function parseMonkey(text: string): Monkey {
    const lines = text.split('\n');
    const num = /^Monkey (\d+):$/.exec(lines[0])![1]!.toInt();
    const worries = lines[1].split(': ')[1]!.split(', ').map(_ => _.toInt());
    const operationParts = lines[2].split(' = ')[1].split(' ');
    const operation = operationParts[1] === '*' ? Operation.Mult : Operation.Plus;
    const operands = [
        operationParts[0],
        operationParts[2],
    ].map((part) => part === 'old' ? 'old' : part.toInt()) as [Operand, Operand];
    const equation = {
        operation,
        operands,
    };
    const testDivisibleBy = lines[3].trim().split(' ').peek().toInt();
    const throwOnTrue = lines[4].trim().split(' ').peek().toInt();
    const throwOnFalse = lines[5].trim().split(' ').peek().toInt();

    return {
        num,
        worries,
        equation,
        testDivisibleBy,
        throwOnTrue,
        throwOnFalse,
        inspectionCounter: 0,
    };
}

function parseMonkeys(input: string): Monkey[] {
    return input.split('\n\n').map(parseMonkey);
}

export default Solution.raw({
    part1,
    part2,
});
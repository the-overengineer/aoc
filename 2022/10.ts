import { Solution } from '@core/DaySolution';
import '@core/polyfill';

type Command = {
    ticksToExec: number;
    addValue: number;
};

function part1(lines: string[]): number {
    const commands = lines.map(parse).reverse();

    let registerV: number = 1;
    let cycle: number = 1;
    let totalSum: number = 0;
    let activeCommand: Command | null = null;
    const specialNumbers = [20, 60, 100, 140, 180, 220];

    while (true) {
        if (specialNumbers.includes(cycle)) {
            totalSum += registerV * cycle;
        }
        
        if (activeCommand == null) {
            if (commands.length === 0) {
                break;
            } else {
                activeCommand = commands.pop()!;
            }
        }

        activeCommand.ticksToExec--;
        if (activeCommand.ticksToExec === 0) {
            registerV += activeCommand.addValue;
            activeCommand = null;
        }

        cycle++;
    }

    return totalSum;
}

function part2(lines: string[]): number {
    const commands = lines.map(parse).reverse();

    let registerV: number = 1;
    let cycle: number = 1;
    let activeCommand: Command | null = null;
    let buf: string = '';

    while (true) {
        if (activeCommand == null) {
            if (commands.length === 0) {
                break;
            } else {
                activeCommand = commands.pop()!;
            }
        }

        activeCommand.ticksToExec--;
        if (activeCommand.ticksToExec === 0) {
            registerV += activeCommand.addValue;
            activeCommand = null;
        }

        if (Math.abs(registerV - (cycle % 40)) <= 1) {
            buf += '#';
        } else {
            buf += '.';
        }

        if (cycle % 40 === 0) {
            buf += '\n';
        }

        cycle++;
    }

    console.log(buf);

    return 0;
}

function parse(line: string): Command {
    if (line.trim() === 'noop') {
        return {
            ticksToExec: 1,
            addValue: 0,
        };
    } else {
        const [_, addValue] = line.split(' ');
        return {
            ticksToExec: 2,
            addValue: addValue.toInt(),
        };
    }
}

export default Solution.lines({
    part1,
    part2,
});

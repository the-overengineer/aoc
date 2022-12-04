import { Solution } from '@core/DaySolution';
import { IntCodeComputer } from './IntCodeComputer';

function part1(input: string): unknown {
    const computer = IntCodeComputer.fromString(input);
    return computer.run([1]);
}

function part2(input: string): unknown {
    const computer = IntCodeComputer.fromString(input);
    return computer.run([2]);
}

export default Solution.raw({
    part1,
    part2,
});

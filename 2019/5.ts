import { Solution } from '@core/DaySolution';
import { IntCodeComputer } from './IntCodeComputer';

function part1(input: string) {
    const computer = IntCodeComputer.fromString(input);
    const inputs = [1];
    const outputs = computer.run(inputs).output;
    console.log(outputs);
    return outputs[outputs.length - 1];
}

function part2(input: string) {
    const computer = IntCodeComputer.fromString(input);
    const inputs = [5];
    const outputs = computer.run(inputs).output;
    console.log(outputs);
    return outputs[outputs.length - 1];
}

export default Solution.raw({
    part1,
    part2,
});
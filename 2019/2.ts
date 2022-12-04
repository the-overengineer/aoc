import { Solution } from '@core/DaySolution';
import { range } from '@core/utilityBelt';
import { IntCodeComputer } from './IntCodeComputer';

function part1(input: string): number {
    const computer = IntCodeComputer.fromString(input);
    computer.writeAt(1, 12);
    computer.writeAt(2, 2);
    computer.run();
    return computer.readAt(0);
}

function part2(input: string): number {
    for (const noun of range(0, 100)) {
        for (const verb of range(0, 100)) {
            const computer = IntCodeComputer.fromString(input);
            computer.writeAt(1, noun);
            computer.writeAt(2, verb);
            computer.run();
            const result = computer.readAt(0);

            if (result === 19690720) {
                return 100 * noun + verb;
            }
        }
    }

    return -1;
}

export default Solution.raw({
    part1,
    part2,
});


import { Solution } from '@core/DaySolution';
import { max, permutations } from '@core/utilityBelt';
import { IntCodeComputer, MachineState } from './IntCodeComputer';

function part1(code: string): number {
    const possibleOutputs = permutations([0, 1, 2, 3, 4])
        .map((phases) => {
            return phases.reduce((input, phase) => {
                const output = IntCodeComputer.fromString(code).run([phase, input]).output;
                console.assert(output.length === 1, `Output of wrong length ${output}`);
                return output[0]!;
            }, 0);
        });

    return max(possibleOutputs)!;
}

function part2(code: string): number {
    const possibleOutputs = permutations([5, 6, 7, 8, 9])
        .map((phases) => {
            let amplification = 0;
            const computers = phases.map((phase) => {
                const computer = IntCodeComputer.fromString(code);
                // Note: This works "by accident", since we know it will ask for input before it produces output
                computer.run([phase]);
                return computer;
            }, phases.length);

            while (true) {
                if (computers.some((c) => c.state === MachineState.Halted)) {
                    return amplification;
                }

                amplification = computers.reduce((input, computer) => {
                    const result = computer.run([input], { pauseOnOutput: true });

                    if (result.state === MachineState.OutOfBounds) {
                        throw new Error('Code went out of bounds somehow');
                    }

                    if (result.state === MachineState.Halted) {
                        return input;
                    }

                    console.assert(result.output.length === 1, `Output of wrong length ${JSON.stringify(result)}`);

                    return result.output[0];
                }, amplification);
            }
        });

    return max(possibleOutputs)!;
}

export default Solution.raw({
    part1,
    part2,
});

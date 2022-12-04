import '@core/polyfill';
import { leftPad, range } from '@core/utilityBelt';

const CommandType = {
    Add: 1,
    Multiply: 2,
    Input: 3,
    Output: 4,
    JumpIfTrue: 5,
    JumpIfFalse: 6,
    LessThan: 7,
    Equals: 8,
    AdjustRelativeBase: 9,
    Halt: 99,
} as const;
type CommandType = typeof CommandType[keyof typeof CommandType];

const ParameterMode = {
    Position: 0,
    Immediate: 1,
    Relative: 2,
} as const;
type ParameterMode = typeof ParameterMode[keyof typeof ParameterMode];

export const MachineState = {
    Halted: 'Halted',
    AwaitingInput: 'AwaitingInput',
    Running: 'Running',
    OutOfBounds: 'OutOfBounds',
    Paused: 'Paused',
} as const;
export type MachineState = typeof MachineState[keyof typeof MachineState];

export type ExecutionResult = {
    output: number[];
    state: MachineState;
}

type RunOptions = {
    pauseOnOutput?: boolean;
};

type Memory = number[];

export class IntCodeComputer {
    public static init(memory: Memory): IntCodeComputer {
        return new IntCodeComputer(memory);
    }

    public static fromString(text: string): IntCodeComputer {
        const inputs = text.split(',').map(_ => _.toInt());
        return IntCodeComputer.init(inputs);
    }

    private currentPosition: number = 0;
    private relativeBase: number = 0;
    public state: MachineState = MachineState.Running;

    private constructor(public readonly memory: Memory) {}

    public get halted() {
        return this.state === MachineState.Halted;
    }

    private getArgs(count: number): number[] {
        return range(1, count + 1).map((offset) => this.readAt(this.currentPosition + offset));
    }

    public readAt(index: number): number {
        if (index < 0) {
            throw new Error('Out out bounds');
        }

        return this.memory[index] ?? 0;
    }

    public writeAt(index: number, value: number): void {
        if (index < 0) {
            throw new Error('Out out bounds');
        }

        this.memory[index] = value;
    }

    public getValueWithMode(input: number, mode: ParameterMode): number {
        if (mode === ParameterMode.Immediate) {
            return input;
        } else if (mode === ParameterMode.Position) {
            return this.readAt(input);
        } else if (mode === ParameterMode.Relative) {
            return this.readAt(input + this.relativeBase);
        } else {
            throw new Error(`Invalid read parameter mode ${mode}`);
        }
    }

    public setValueWithMode(input: number, value: number, mode: ParameterMode): void {
        if (mode === ParameterMode.Position) {
            this.writeAt(input, value);
        } else if (mode === ParameterMode.Relative) {
            this.writeAt(input + this.relativeBase, value);
        } else {
            throw new Error(`Invalid write parameter mode ${mode}`);
        }
    }

    private add(modes: ParameterMode[]) {
        const [fromA, fromB, toC] = this.getArgs(3);
        const [modeA, modeB, modeC] = modes;
        const result = this.getValueWithMode(fromA, modeA) + this.getValueWithMode(fromB, modeB);
        this.setValueWithMode(toC, result, modeC);
        this.currentPosition += 4;
    }

    private mult(modes: ParameterMode[]) {
        const [fromA, fromB, toC] = this.getArgs(3);
        const [modeA, modeB, modeC] = modes;
        const result = this.getValueWithMode(fromA, modeA) * this.getValueWithMode(fromB, modeB);
        this.setValueWithMode(toC, result, modeC);
        this.currentPosition += 4;
    }

    private inputInto(data: number, modes: ParameterMode[]): void {
        const [address] = this.getArgs(1);
        const [mode] = modes;
        this.setValueWithMode(address, data, mode);
        this.currentPosition += 2;
    }

    private readFrom(modes: ParameterMode[]): number {
        const [address] = this.getArgs(1);
        const [mode] = modes;
        const data = this.getValueWithMode(address, mode);
        this.currentPosition += 2;
        return data;
    }

    private jumpIfTrue(modes: ParameterMode[]) {
        const [cond, jumpTo] = this.getArgs(2)
        const [condMode, jumpToMode] = modes;
        const condValue = this.getValueWithMode(cond, condMode);

        if (condValue !== 0) {
            this.currentPosition = this.getValueWithMode(jumpTo, jumpToMode);
        } else {
            this.currentPosition += 3;
        }
    }

    private jumpIfFalse(modes: ParameterMode[]) {
        const [cond, jumpTo] = this.getArgs(2)
        const [condMode, jumpToMode] = modes;
        const condValue = this.getValueWithMode(cond, condMode);

        if (condValue === 0) {
            this.currentPosition = this.getValueWithMode(jumpTo, jumpToMode);
        } else {
            this.currentPosition += 3;
        }
    }

    private lt(modes: ParameterMode[]) {
        const [fromA, fromB, toC] = this.getArgs(3);
        const [modeA, modeB, modeC] = modes;
        const result = this.getValueWithMode(fromA, modeA) < this.getValueWithMode(fromB, modeB)
            ? 1
            : 0;
        this.setValueWithMode(toC, result, modeC);
        this.currentPosition += 4;
    }

    private eq(modes: ParameterMode[]) {
        const [fromA, fromB, toC] = this.getArgs(3);
        const [modeA, modeB, modeC] = modes;
        const result = this.getValueWithMode(fromA, modeA) === this.getValueWithMode(fromB, modeB)
            ? 1
            : 0;
        this.setValueWithMode(toC, result, modeC);
        this.currentPosition += 4;
    }

    private adjustRelativeBase(modes: ParameterMode[]) {
        const [value] = this.getArgs(1); 
        const [mode] = modes;
        const offset = this.getValueWithMode(value, mode);
        this.relativeBase += offset;
        this.currentPosition += 2;
    }

    public run(input: number[] = [], options?: RunOptions): ExecutionResult {
        const outputs: number[] = [];
        let inputIndex = 0;

        function getInput(): number | undefined {
            if (inputIndex >= input.length) {
                return;
            }

            return input[inputIndex++];
        }

        const endInState = (state: MachineState): ExecutionResult => {
            this.state = state;
            return {
                output: outputs,
                state,
            };
        }

        this.state = MachineState.Running;

        while (this.currentPosition < this.memory.length) {
            const opcode = this.memory[this.currentPosition];
            const { command, modes } = this.parseOperation(opcode);

            switch (command) {
                case CommandType.Halt:
                    return endInState(MachineState.Halted);

                case CommandType.Add:
                    this.add(modes);
                    break;

                case CommandType.Multiply:
                    this.mult(modes);
                    break;

                case CommandType.Input:
                    const input = getInput();
                    if (input == null) {
                        return endInState(MachineState.AwaitingInput);
                    } else {
                        this.inputInto(input, modes);
                    }
                    break;

                case CommandType.Output:
                    const output = this.readFrom(modes);
                    outputs.push(output);

                    if (options?.pauseOnOutput) {
                        return endInState(MachineState.Paused);
                    }

                    break;

                case CommandType.JumpIfTrue:
                    this.jumpIfTrue(modes);
                    break;

                case CommandType.JumpIfFalse:
                    this.jumpIfFalse(modes);
                    break;

                case CommandType.LessThan:
                    this.lt(modes);
                    break;

                case CommandType.Equals:
                    this.eq(modes);
                    break;

                case CommandType.AdjustRelativeBase:
                    this.adjustRelativeBase(modes);
                    break;
                
                default:
                    throw new Error(`Unknown opcode ${command}`);
            }
        }

        return endInState(MachineState.OutOfBounds);
    }

    private parseOperation(opcode: number): { modes: ParameterMode[], command: CommandType } {
        const fullCode = leftPad(
            String(opcode),
            5,
            '0',
        );

        const modes = fullCode.slice(0, 3).reverse().split('').map(_ => _.toInt() as ParameterMode);
        const command = fullCode.slice(3).toInt() as CommandType;

        return {
            modes,
            command,
        };
    }
}

import '@core/polyfill';
import { isEqual, sum } from '@core/utilityBelt';

type Register = 'x' | 'y' | 'z' | 'w';

const isRegister = (it: string): it is Register => /^[xzyw]$/.test(it);

type Sym = string;

type Registers = Record<Register, SymbolExpression>;

type Constraints = Record<Sym, Set<number>>;

type State = [Registers, Constraints];

function showRegisters(registers: Registers): string {
    return Object.keys(registers).map((k) => `${k} = ${registers[k as Register].toString()}`).join('\n');
}

function constrain(constraints: Constraints, symbol: Sym, values: Set<number>): Constraints {
    return mergeConstraints(constraints, { [symbol]: values });
}

function mergeConstraints(a: Constraints, b: Constraints): Constraints {
    const syms = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
    const constraints: Constraints = {};

    syms.forEach((s) => {
        if (a[s] != null && b[s] != null) {
            constraints[s] = a[s].intersect(b[s]);
        } else {
            constraints[s] = a[s] ?? b[s] ?? new Set();
        }
    });

    return constraints;
}

function makeState(z: SymbolExpression, constraints: Constraints, idx: number): State {
    return [
        {
            x: SymbolExpression.constant(0),
            y: SymbolExpression.constant(0),
            w: SymbolExpression.symbol(`x_${idx}`),
            z,
        },
        constraints,
    ];
}

function isImpossible(state: State): boolean {
    return Object.values(state[1]).some(_ => _.size === 0);
}

type CmdType = 'add' | 'mul' | 'div' | 'mod' | 'eql';

interface BinaryCmd {
    type: CmdType;
    a: Register;
    b: Register | number;
}

function parseCmds(lines: string[]): BinaryCmd[][] {
    const commands: BinaryCmd[][] = [];

    lines.forEach((line: string) => {
        const parts = line.split(' ');
        if (parts.length === 2) {
           commands.push([]);
        } else {
            const type = parts[0] as CmdType;
            const a = parts[1] as Register;
            const b = isRegister(parts[2]) ? parts[2] : parts[2]!.toInt();

            commands.peek().push({
                type,
                a,
                b,
            });
        }
    });

    return commands;
}

class SymbolExpression {
    public static constant(constant: number) {
        return new SymbolExpression(constant, {});
    }

    public static symbol(sym: Sym) {
        return new SymbolExpression(0, { [sym]: 1 });
    }

    public constructor(
        public readonly constant: number,
        public readonly symbolic: Record<Sym, number>,
    ) {}

    public get isConstant(): boolean {
        return this.symbolSet.size === 0;
    }

    public get symbolSet(): Set<Sym> {
        return new Set(Object.keys(this.symbolic));
    }

    public add(o: SymbolExpression | number): SymbolExpression {
        const other = typeof o === 'number' ? SymbolExpression.constant(o) : o;
        const unifiedSet = this.symbolSet.union(other.symbolSet);
        const syms: Record<Sym, number> = {};

        Array.from(unifiedSet).forEach((sym) => {
            syms[sym] = (this.symbolic[sym] ?? 0) + (other.symbolic[sym] ?? 0);
        });

        return new SymbolExpression(
            this.constant + other.constant,
            SymbolExpression.withoutZeroes(syms),
        );
    }

    public multiplyBy(x: number) {
        const syms: Record<Sym, number> = {};

        Array.from(this.symbolSet).forEach((sym) => {
            syms[sym] = this.symbolic[sym] * x;
        });

        return new SymbolExpression(
            this.constant * x,
            SymbolExpression.withoutZeroes(syms),
        );
    }

    public divideBy(x: number) {
        const syms: Record<Sym, number> = {};

        Array.from(this.symbolSet).forEach((sym) => {
            syms[sym] = Math.floor(this.symbolic[sym] / x);
        });

        return new SymbolExpression(
            Math.floor(this.constant / x),
            SymbolExpression.withoutZeroes(syms),
        );
    }

    public evaluate(symbolValues: Record<Sym, number>) {
        return this.constant + sum(Object.keys(this.symbolic).map((sym) => this.symbolic[sym] * symbolValues[sym]));
    }

    public equals(other: SymbolExpression) {
        return this.constant === other.constant && isEqual(this.symbolic, other.symbolic);
    }

    public toString(): string {
        const constantPart = this.constant === 0 ? '' : String(this.constant);
        const polyPart = Object.keys(this.symbolic).map((sym) => this.symbolic[sym] !== 1 ? `${this.symbolic[sym]}${sym}` : sym).join(' + ');
        return [constantPart + polyPart].filter((it) => it).join(' + ') || '0';
    }

    private static withoutZeroes(syms: Record<Sym, number>): Record<Sym, number> {
        const updated: Record<Sym, number> = {};

        Object.keys(syms).forEach((sym) => {
            if (syms[sym] !== 0) {
                updated[sym] = syms[sym];
            }
        });

        return updated;
    }
}
import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { flatten, isEqual, memoized, sum } from '@core/utilityBelt';

type Register = 'x' | 'y' | 'z' | 'w';

const isRegister = (it: string): it is Register =>
    /^[xzyw]$/.test(it);

type Registers = Record<Register, SymbolExpression>;

const emptyRegisters = (): Registers => {
    return {
        x: SymbolExpression.constant(0),
        y: SymbolExpression.constant(0),
        z: SymbolExpression.constant(0),
        w: SymbolExpression.constant(0),
    };
}

function showRegisters(registers: Registers): string {
    return Object.keys(registers).map((k) => `${k} = ${registers[k as Register].toString()}`).join('\n');
}

type CmdType = 'inp' | 'add' | 'mul' | 'div' | 'mod' | 'eql';

interface CmdShape {
    type: CmdType;
}

interface Inp extends CmdShape {
    type: 'inp';
    value: Register;
}

interface BinaryCmd extends CmdShape {
    type: Exclude<CmdType, 'inp'>;
    a: Register;
    b: Register | number;
}

type Cmd = Inp | BinaryCmd;

function parseCmds(lines: string[]): Cmd[] {
    return lines.map((line: string): Cmd => {
        const parts = line.split(' ');
        if (parts.length === 2) {
            return {
                type: 'inp',
                value: parts[1] as Register,
            };
        } else {
            const type = parts[0] as Exclude<CmdType, 'inp'>;
            const a = parts[1] as Register;
            const b = isRegister(parts[2]) ? parts[2] : parts[2]!.toInt();

            return {
                type,
                a,
                b,
            };
        }
    })
}

function toSequences(cmds: Cmd[]): BinaryCmd[][] {
    const sequences: BinaryCmd[][] = [];
    let buf: BinaryCmd[] = [];

    for (const cmd of cmds) {
        if (cmd.type === 'inp') {
            if (buf.length > 0) {
                sequences.push(buf);
                buf = [];
            }
        } else {
            buf.push(cmd);
        }
    }

    if (buf.length > 0) {
        sequences.push(buf);
    }

    return sequences;
}

type Sym = string;

export class SymbolExpression {
    public static constant(constant: number) {
        return new SymbolExpression(constant, {});
    }

    public static symbol(sym: Sym) {
        return new SymbolExpression(0, { [sym]: 1 });
    }

    public constructor(
        public readonly constant: number,
        public readonly symbolic: Record<Sym, number>,
        public readonly constraints: Record<Sym, Set<number>> = {},
    ) {}

    public get isConstant(): boolean {
        return this.symbolSet.size === 0;
    }

    public get symbolSet(): Set<Sym> {
        return new Set(Object.keys(this.symbolic));
    }

    public get isImpossible(): boolean {
        return Object.values(this.constraints).some((c) => c.size === 0);
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
            SymbolExpression.mergeConstraints(this.constraints, other.constraints),
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
            this.constraints,
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
            this.constraints,
        );
    }

    public modulo(x: number): SymbolExpression[] {
        const syms: Record<Sym, number> = {};

        const remainingSymbols = Array.from(this.symbolSet).filter((sym) => this.symbolic[sym] % x !== 0);

        if (remainingSymbols.length === 0) {
            return [new SymbolExpression(this.constant % x, {}, this.constraints)];
        } else {
            const symMap: Record<Sym, number> = remainingSymbols.reduce((acc, sym) => ({ ...acc, [sym]: this.symbolic[sym] }), {});
            const reducedExpr = new SymbolExpression(this.constant, symMap, this.constraints);
            const combos = valueCombinations(remainingSymbols).filter((vc) => reducedExpr.constraintsMatch(vc));
            const values: Map<number, Record<Sym, Set<number>>> = new Map();

            combos.forEach((symVals) => {
                const value = reducedExpr.evaluate(symVals) % x;

                if (values.has(value)) {
                    Object.keys(symVals).forEach((sv) => {
                        if (values.get(value)![sv] == null) {
                            values.get(value)![sv] = new Set();
                        }

                        values.get(value)![sv]!.add(symVals[sv]);

                        console.log('old', values.get(value)!);
                    });
                } else {
                    const constrs: Record<Sym, Set<number>> = {};
                    Object.keys(symVals).forEach((sv) => {
                        constrs[sv] = new Set([symVals[sv]]);
                    });

                    values.set(value, constrs);
                }
            });

            return Array.from(values.entries()).map(([actualValue, constrs]) => {
                return new SymbolExpression(actualValue, {}, constrs);
            });
        }
    }

    public constraintsMatch(symbolValues: Record<Sym, number>) {
        return Object.keys(symbolValues).every((sym) => this.constraints[sym] == null || this.constraints[sym].has(symbolValues[sym]));
    }

    public evaluate(symbolValues: Record<Sym, number>) {
        return this.constant + sum(Object.keys(this.symbolic).map((sym) => this.symbolic[sym] * symbolValues[sym]));
    }

    public equals(other: SymbolExpression) {
        return this.constant === other.constant && isEqual(this.symbolic, other.symbolic) && isEqual(this.constraints, other.constraints);
    }

    public toString(): string {
        const constantPart = this.constant === 0 ? '' : String(this.constant);
        const polyPart = Object.keys(this.symbolic).map((sym) => this.symbolic[sym] !== 1 ? `${this.symbolic[sym]}${sym}` : sym).join(' + ');
        const expression = [constantPart + polyPart].filter((it) => it).join(' + ') || '0';
        const constraintsPart = Object.keys(this.constraints).length > 0
            ? `, given ${Object.keys(this.constraints).map((varName) => `${varName} = {${Array.from(this.constraints[varName]).join(', ')}}`).join(' and ')}`
            : '';

        return expression + constraintsPart;
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

    public static mergeConstraints(a: Record<Sym, Set<number>>, b: Record<Sym, Set<number>>) {
        const syms = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
        const constraints: Record<Sym, Set<number>> = {};

        syms.forEach((s) => {
            if (a[s] != null && b[s] != null) {
                constraints[s] = a[s].intersect(b[s]);
            } else {
                constraints[s] = a[s] ?? b[s] ?? new Set();
            }
        });

        return constraints;
    }
}

export function valueCombinations(symbols: Sym[], records: Array<Record<Sym, number>> = [{}]): Array<Record<Sym, number>> {
    if (symbols.length === 0) {
        return records;
    }

    const [sym, ...rest] = symbols;

    const nextRecords = [];

    for (const record of records) {
        for (let i = 1; i <= 9; i++) {
            nextRecords.push({
                ...record,
                [sym]: i,
            });
        }
    }

    return valueCombinations(rest, nextRecords);
}

// Branch reality depending on what combinations of equality these two produce
function branchEquality(a: SymbolExpression, b: SymbolExpression): SymbolExpression[] {
    const symbols = Array.from(a.symbolSet.union(b.symbolSet));
    const symbolValueSets = valueCombinations(symbols);
    const solutions: SymbolExpression[] = [];

    for (const values of symbolValueSets) {
        if (!a.constraintsMatch(values) || !b.constraintsMatch(values)) {
            console.log('impossible');
            continue;
        }

        const constValue = a.evaluate(values) === b.evaluate(values) ? 1 : 0;
        const sol = new SymbolExpression(constValue, {}, SymbolExpression.mergeConstraints(a.constraints, b.constraints));

        if (!sol.isImpossible) {
            solutions.push(sol);
        }
    }

    return solutions;
}

function findPossibleResults(initialRegisters: Registers, sequence: BinaryCmd[]): SymbolExpression[] {
    const registers = { ...initialRegisters };
    let i = 0;

    console.log(showRegisters(registers));
    console.log();

    for (const cmd of sequence) {
        i++;
        switch (cmd.type) {
            case 'add': {
                const a = registers[cmd.a];
                const b = typeof cmd.b === 'number' ? cmd.b : registers[cmd.b];
                registers[cmd.a] = a.add(b);
                break;
            }
            case 'mul': {
                const a = registers[cmd.a];
                const b = typeof cmd.b === 'number' ? cmd.b : registers[cmd.b].constant;
                registers[cmd.a] = a.multiplyBy(b);
                break;
            }
            case 'div': {
                const a = registers[cmd.a];
                const b = typeof cmd.b === 'number' ? cmd.b : registers[cmd.b].constant;
                registers[cmd.a] = a.divideBy(b);
                break;
            } 
            case 'mod': {
                const a = registers[cmd.a];
                const b = typeof cmd.b === 'number' ? cmd.b : registers[cmd.b].constant;
                const moduloVariants = a.modulo(b);
                return flatten(moduloVariants.map((poly) => {
                    if (poly.isImpossible) {
                        return [];
                    }

                    console.log(poly.toString());

                    return findPossibleResults(
                        { ...registers, [cmd.a]: poly },
                        sequence.slice(i),
                    );
                }));
            }
            case 'eql': {
                const a = registers[cmd.a];
                const b = typeof cmd.b === 'number' ? SymbolExpression.constant(cmd.b) : registers[cmd.b];

                if (b.isConstant) {
                    if (!a.isConstant) {
                        throw new Error('Comparing expression to constant, not expected by author!');
                    }

                    registers[cmd.a] = new SymbolExpression(a.constant === b.constant ? 1 : 0, {}, a.constraints);
                } else {
                    return flatten(branchEquality(a, b).map((poly) => {
                        if (poly.isImpossible) {
                            return [];
                        }

                        return findPossibleResults({ ...registers, [cmd.a]: poly }, sequence.slice(i));
                    }));
                }
            }
        }
    }

    return [registers.z];
}

function findPossibleExpressions(
    possibleZs: SymbolExpression[],
    sequences: BinaryCmd[][],
    index: number = 0,
): SymbolExpression[] {
    if (sequences.length === 0) {
        return possibleZs;
    }

    const nextPossibleZs: SymbolExpression[] = [];

    const [cmds, ...rest] = sequences;

    for (const z of possibleZs) {
        const registers = {
            ...emptyRegisters(),
            z,
            w: SymbolExpression.symbol(`x_${index}`),
        };

        const results = findPossibleResults(registers, cmds);

        for (const result of results) {
            if (!nextPossibleZs.some(_ => _.equals(result))) {
                nextPossibleZs.push(result);
            }
        }
    }

    return findPossibleExpressions(nextPossibleZs, rest, index + 1);
}

function part1(lines: string[]) {
    const cmds = parseCmds(lines);
    const sequences = toSequences(cmds);

    const expressions = findPossibleExpressions([SymbolExpression.constant(0)], sequences.slice(0, 2));
    console.log(expressions.map(_ => _.toString()));
    const pureSymbolicExpressions = expressions.filter((ex) => ex.constant === 0);

    for (const expr of pureSymbolicExpressions) {
        console.log(expr.toString());
    }
}

export default Solution.lines({
    part1, // 51983999947999
    // part2 // 11211791111365
});

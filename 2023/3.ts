import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { Grid } from '@core/Grid';
import { isNumber, sum } from '@core/utilityBelt';

type NumberRange = {
    number: number;
    row: number;
    startColumn: number;
    endColumn: number;
}

function part1(text: string) {
    const schematic = Schematic.fromString(text);
    const ranges = schematic.getNumberRanges();
    const partNumberRanges = ranges.filter((range) => schematic.neighboursASymbol(range));
    return sum(partNumberRanges.map((range) => range.number));
}

function part2(text: string) {
    const schematic = Schematic.fromString(text);
    const ranges = schematic.getNumberRanges();
    const gearAdjacentRanges = schematic.getGearNeighbourNumberRanges(ranges);
    const validRanges = gearAdjacentRanges.filter((ranges) => ranges.length === 2);
    const gearRatios = validRanges.map(([range1, range2]) => {
        return range1.number * range2.number;
    });

    return sum(gearRatios);
}

class Schematic extends Grid<string> {
    public static fromString(str: string): Schematic {
        const data = str.split('\n').map((line) => Array.from(line));
        return new Schematic(data);
    }

    public getGearIndices(): [number, number][] {
        return this.filterIndices((cell) => cell === '*');
    }

    public getNumberRanges(): NumberRange[] {
        const ranges: NumberRange[] = [];

        this.rows.forEach((row, y) => {
            let startColumn: number | null = null;
            let endColumn: number | null = null;
            let currentStr: string = '';

            row.forEach((cell, x) => {
                if (isNumber(cell)) {
                    if (startColumn == null) {
                        startColumn = x;
                        endColumn = x;
                    } else {
                        endColumn = x;
                    }
                    currentStr += cell;
                } else if (!!currentStr) {
                    ranges.push({
                        number: parseInt(currentStr, 10),
                        row: y,
                        startColumn: startColumn!,
                        endColumn: endColumn!,
                    });

                    startColumn = null;
                    endColumn = null;
                    currentStr = '';
                }
            });

            if (currentStr) {
                ranges.push({
                    number: parseInt(currentStr, 10),
                    row: y,
                    startColumn: startColumn!,
                    endColumn: endColumn!,
                });

                startColumn = null;
                endColumn = null;
                currentStr = '';
            }
        });

        return ranges;
    }

    public getGearNeighbourNumberRanges(ranges: NumberRange[]): NumberRange[][] {
        const gearIndices = this.getGearIndices();
        const rangesWithNeighbourIndices = ranges.map((range) => ({
            range,
            neighbourIndices: this.getRangeNeighbourIndices(range),
        }));

        return gearIndices.map(([y, x]) => {
            return rangesWithNeighbourIndices.filter(({ neighbourIndices }) => {
                return neighbourIndices.some(([ny, nx]) => ny === y && nx === x);
            }).map(({ range }) => range);
        });
    }

    public getRangeNeighbourIndices(range: NumberRange): [number, number][] {
        const { row, startColumn, endColumn } = range;
        const indices: [number, number][] = [];

        for (let x = startColumn; x <= endColumn; x++) {
            indices.push(...this.getNeighbourIndices(row, x));
        }

        return indices;
    }

    public neighboursASymbol(range: NumberRange): boolean {
        const { row, startColumn, endColumn } = range;

        for (let x = startColumn; x <= endColumn; x++) {
            const neighbourIndices = this.getNeighbourIndices(row, x, true);
            if (neighbourIndices.some(([y, x]) => this.isSymbolAt(y, x))) {
                return true;
            }
        }
        
        return false;
    }

    private isSymbolAt(y: number, x: number): boolean {
        const cell = this.get(y, x);
        return cell !== '.' && !isNumber(cell);
    }
}

export default Solution.raw({
    part1,
    part2,
});

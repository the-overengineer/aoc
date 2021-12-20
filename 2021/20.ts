import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { repeat } from '@core/utilityBelt';

export type Algorithm = Array<'#' | '.'>;

class PaddableGrid<T> extends Grid<T> {
    public static ofGrid<T>(grid: Grid<T>): PaddableGrid<T> {
        return new PaddableGrid<T>(grid.data);
    }

    public pad(padding: T): PaddableGrid<T> {
        const width = this.width + 2;
        const fillerRow = repeat(padding, width);
        const padded = [
            [...fillerRow],
            ...this.data.map((row) => [padding, ...row, padding]),
            [...fillerRow],
        ];

        return new PaddableGrid(padded);
    }
}

export class LightGrid extends PaddableGrid<'#' | '.'> {
    public static read(input: string, algorithm: Algorithm) {
        return new LightGrid(
            input.split('\n').map((row) => row.split('')) as Array<Array<'#' | '.'>>,
            algorithm,
        );
    }

    public constructor(
        data: Array<Array<'#' | '.'>>,
        private readonly algorithm: Algorithm,
        private padding: '#' | '.' = '.',
    ) {
        super(data);
    }

    public next(): LightGrid {
        const padded = new LightGrid(this.pad(this.padding).data, this.algorithm);
        const enhanced = padded.map((_, y, x) => {
            const index = padded.enhanceIndex(y, x);
            return this.algorithm[index];
        });

        const nextPadding = this.padding === '.'
            ? this.algorithm[0]
            : this.algorithm[this.algorithm.length - 1];

        return new LightGrid(enhanced.data, this.algorithm, nextPadding);
    }

    public enhanceIndex(y: number, x: number): number {
        let bitStr: string = '';

        for (let dy of [-1, 0, 1]) {
            for (let dx of [-1, 0, 1]) {
                bitStr += this.getOrDefault(y + dy, x + dx, this.padding) === '#' ? '1' : '0';
            }
        }

        return parseInt(bitStr, 2);
    }
}

function parse(input: string): LightGrid {
    const [algorithm, lines] = input.split('\n\n');
    return LightGrid.read(lines, algorithm.split('') as Algorithm);
}

function part1(input: string) {
    const grid = parse(input);
    
    const litPixels = grid.next().next().filter((p) => p === '#').length;

    return litPixels;
}

export default Solution.raw({
    part1,
})
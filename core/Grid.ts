import { transpose } from '@core/utilityBelt';

type GridCallback<T, R> = (cell: T, row: number, column: number, grid: T[][]) => R;
type ReduceGridCallback<T, R> = (acc: R, cell: T, row: number, column: number, grid: T[][]) => R;

export class Grid<T> {
    public constructor(
        public readonly data: T[][],
    ) {}

    public get width() {
        return this.data?.[0]?.length ?? 0;
    }

    public get height() {
        return this.data?.length ?? 0;
    }

    public get(y: number, x: number): T {
        return this.data[y][x];
    }

    public set(y: number, x: number, value: T): void {
        this.data[y][x] = value;
    }

    public mutateAt(y: number, x: number, fn: (value: T, y: number, x: number) => T): void {
        this.set(y, x, fn(this.get(y, x), y, x));
    }

    public transposed(): Grid<T> {
        return new Grid(transpose(this.data));
    }

    public slice(fromY: number, fromX: number, height: number, width: number): Grid<T> {
        const slicedData: T[][] = [];
        for (let y = fromY; y < fromY + height; y++) {
            const row: T[] = [];

            for (let x = fromX; x < fromX + width; x++) {
                row.push(this.data[y][x]);
            }

            slicedData.push(row);
        }

        return new Grid(slicedData);
    }

    public map<R>(fn: GridCallback<T, R>): Grid<R> {
        return new Grid(
            this.data.map((row, i) => {
                return row.map((cell, j) => fn(cell, i, j, this.data));
            }),
        );
    }

    public forEach(fn: GridCallback<T, void>): void {
        this.data.forEach((row, i) => {
            row.forEach((cell, j) => {
                fn(cell, i, j, this.data);
            });
        });
    }

    public filterIndices(fn: GridCallback<T, boolean>): [number, number][] {
        const indices: [number, number][] = [];

        this.forEach((cell, y, x, data) => {
            if (fn(cell, y, x, data)) {
                indices.push([y, x]);
            }
        });

        return indices;
    }

    public filter(fn: GridCallback<T, boolean>): T[] {
        const matches: T[] = [];

        this.forEach((cell, y, x, data) => {
            if (fn(cell, y, x, data)) {
                matches.push(cell);
            }
        });

        return matches;
    }

    public reduce<R>(fn: ReduceGridCallback<T, R>, initial: R): R {
        let acc = initial;

        this.forEach((cell, y, x, data) => {
            acc = fn(acc, cell, y, x, data);
        });

        return acc;
    }

    public getNeighbourIndices(y: number, x: number, diagonal: boolean = true): [number, number][] {
        const offsets = [-1, 0, 1];
        const indices: [number, number][] = [];

        for (const dy of offsets) {
            for (const dx of offsets) {
                if (dy == 0 && dx === 0) {
                    continue;
                }

                if (!diagonal && dx !== 0 && dy !== 0) {
                    continue;
                }

                const ny = y + dy;
                const nx = x + dx;

                if (ny < 0 || ny >= this.height) {
                    continue;
                }

                if (nx < 0 || nx >= this.width) {
                    continue;
                }

                indices.push([ny, nx]);
            }
        }

        return indices;
    }

    public getNeighbours(y: number, x: number, diagonal: boolean = true): T[] {
        const indices = this.getNeighbourIndices(y, x, diagonal);
        return indices.map(([ny, nx]) => this.data[ny][nx]);
    }

    public appendRight(other: Grid<T>): Grid<T> {
        if (this.height !== other.height) {
            throw new Error('Cannot append grid of differing height!');
        }

        const data: T[][] = [];

        for (let i = 0; i < this.height; i++) {
            const row: T[] = [];

            for (let j = 0; j < this.width; j++) {
                row.push(this.get(i, j));
            }

            for (let j = 0; j < other.width; j++) {
                row.push(other.get(i, j));
            }

            data.push(row);
        }

        return new Grid(data);
    }

    public appendLeft(other: Grid<T>): Grid<T> {
        return other.appendRight(this);
    }

    public appendBottom(other: Grid<T>): Grid<T> {
        if (this.width !== other.width) {
            throw new Error('Cannot append grid of differing width!');
        }

        const data: T[][] = [];

        for (let i = 0; i < this.height; i++) {
            data.push([...this.data[i]]);
        }

        for (let i = 0; i < other.height; i++) {
            data.push([...other.data[i]]);
        }

        return new Grid(data);
    }

    public appendTop(other: Grid<T>): Grid<T> {
        return other.appendBottom(this);
    }

    public clone(): Grid<T> {
        const data: T[][] = [];

        for (let y = 0; y < this.height; y++) {
            data.push([...this.data[y]]);
        }

        return new Grid(data);
    }

    public toString(): string {
        return this.data.map((row) => row.map((c) => String(c)).join(' ')).join('\n');
    }
}
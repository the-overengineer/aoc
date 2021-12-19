import { Grid } from '@core/Grid';

export class Vector<T extends number[]> {
    public constructor(
        public readonly data: T,
    ) {}

    public get size(): number {
        return this.data.length;
    }

    public at(i: number): number {
        return this.data[i];
    }

    public add(other: Vector<T>): Vector<T> {
        return new Vector(
            this.data.map((x, i) => x + other.at(i)) as T,
        );
    }

    public subtract(other: Vector<T>): Vector<T> {
        return new Vector(
            this.data.map((x, i) => x - other.at(i)) as T,
        );
    }

    public dotProduct(other: Vector<T>): Vector<T> {
        return new Vector(
            this.data.map((x, i) => x * other.at(i)) as T,
        );
    }

    public timesMatrix(matrix: Matrix): Vector<T> {
        return matrix.multiply(this.toMatrix()).toVector();
    }

    public toMatrix(): Matrix {
        return new Matrix(this.data.map((e) => [e]));
    }
}

export class Vector2D extends Vector<[number, number]> {}

export class Vector3D extends Vector<[number, number, number]> {
    public crossProduct(other: Vector3D): Vector3D {
        const x = this.at(1) * other.at(2) - this.at(2) * other.at(1);
        const y = this.at(2) * other.at(0) - this.at(0) * other.at(2);
        const z = this.at(0) * this.at(1) - this.at(1) * other.at(0);

        return new Vector3D([x, y, z]);
    }
}

export class Matrix extends Grid<number> {
    public add(other: Matrix): Matrix {
        if (this.width !== other.width || this.height !== other.height) {
            throw new Error('Incompatible dimensions');
        }

        return new Matrix(this.map((val, y, x) => val + other.get(y, x)).data);
    }

    public subtract(other: Matrix): Matrix {
        if (this.width !== other.width || this.height !== other.height) {
            throw new Error('Incompatible dimensions');
        }

        return new Matrix(this.map((val, y, x) => val - other.get(y, x)).data);
    }

    public multiply(other: Matrix): Matrix {
        if (this.width !== other.height) {
            throw new Error('Incompatible dimensions');
        }

        const data: number[][] = [];

        for (let y = 0; y < this.height; y++) {
            const row: number[] = [];
            for (let x = 0; x < other.width; x++) {
                let value = 0;

                for (let i = 0; i < this.width; i++) {
                    value += this.get(y, i) * other.get(i, x);
                }

                row.push(value);
            }
            data.push(row);
        }

        return new Matrix(data);
    }

    public toVector<V extends number[]>(): Vector<V> {
        if (this.width !== 1) {
            throw new Error('Only width-1 matrix can be downcast into a vector!');
        }

        return new Vector<V>(this.column(0) as V);
    }
}
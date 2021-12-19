import { deepStrictEqual as eq } from 'assert';
import {
    Matrix,
    Vector,
    Vector2D,
    Vector3D,
} from './Linear';

describe('Linear algebra helpers', () => {
    describe('Matrix', () => {
        it('multiplies correctly', () => {
            const a = new Matrix([[1, 2, 3], [4, 5, 6]]);
            const b = new Matrix([[7, 8], [9, 10], [11, 12]]);
            const expected = new Matrix([[58, 64], [139, 154]]);

            const result = a.multiply(b);

            eq(result, expected);
        });
    });

    describe('Vector', () => {
        it('multiplies with matrix correctly', () => {
            const vector = new Vector3D([2, 1, 3]);
            const matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
            const expected = new Vector3D([13, 31, 49]);

            const result = vector.timesMatrix(matrix);

            eq(result.data, expected.data);
        });
    });
});
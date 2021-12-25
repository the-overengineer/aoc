import { deepStrictEqual as eq } from 'assert';
import { SymbolExpression } from './24.old';

describe.only('day 24', () => {
    describe('symbolic expressions', () => {
        describe('add', () => {
            it('should add constants', () => {
                const a = SymbolExpression.constant(1);
                const b = SymbolExpression.constant(2);
                const expected = SymbolExpression.constant(3);

                const result = a.add(b);

                eq(result, expected);
            });

            it('should add constant to symbol', () => {
                const a = SymbolExpression.symbol('x');
                const b = SymbolExpression.constant(2);
                const expected = new SymbolExpression(2, { 'x': 1 });

                const result = a.add(b);

                eq(result, expected);
            });

            it('should add symbol to constant', () => {
                const a = SymbolExpression.constant(2);
                const b = SymbolExpression.symbol('x');
                const expected = new SymbolExpression(2, { 'x': 1 });

                const result = a.add(b);

                eq(result, expected);
            });

            it('should add symbol to symbol', () => {
                const a = new SymbolExpression(1, { x: 1, y: 2 });
                const b = new SymbolExpression(1, { x: 4, z: 1 });
                const expected = new SymbolExpression(2, { x: 5, y: 2, z: 1 });

                const result = a.add(b);

                eq(result, expected);
            });
        });

        describe('multiplying', () => {
            it('should multiply constant with constant', () => {
                const a = SymbolExpression.constant(2);
                const b = 3
                const expected = SymbolExpression.constant(6);

                const result = a.multiplyBy(b);

                eq(result, expected);
            });

            it('should multiply symbol to constant', () => {
                const a = SymbolExpression.symbol('x');
                const b = 3
                const expected = new SymbolExpression(0, { x: 3 })

                const result = a.multiplyBy(b);

                eq(result, expected);
            });

            it('should multiply mixed to constant', () => {
                const a = new SymbolExpression(2, { y: 3, x: 1 })
                const b = 3
                const expected = new SymbolExpression(6, { x: 3, y: 9 })

                const result = a.multiplyBy(b);

                eq(result, expected);
            });
        });
    });
});
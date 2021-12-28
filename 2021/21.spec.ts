import { deepStrictEqual as eq } from 'assert';
import {
    getDeterministicDie,
    move,
} from './21';

describe('day 21', () => {
    describe('deterministic dice', () => {
        it('should increment by one every roll', () => {
            const dice = getDeterministicDie();

            for (let i = 1; i < 10; i++) {
                eq(dice.next().value, i);
            }
        });

        it('should wrap at 1 after 100', () => {
            const dice = getDeterministicDie();

            for (let i = 0; i < 100; i++) {
                dice.next();
            }

            eq(dice.next().value, 1);
        });
    });

    describe('move', () => {
        it('should increment the position', () => {
            eq(move(3, 2), 5);
        });

        it('should wrap at 10 -> 1', () => {
            eq(move(10, 2), 2);
        });

        it('should match the examples', () => {
            eq(move(4, 1 + 2 + 3), 10);
            eq(move(8, 4 + 5 + 6), 3);
            eq(move(10, 7 + 8 + 9), 4);
            eq(move(3, 10 + 11 + 12), 6);
        });
    });
});
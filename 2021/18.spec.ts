import { deepStrictEqual as eq } from 'assert';
import {
    add,
    addAll,
    magnitude,
    reduceExplode,
    SnailFishNum,
} from './18';

describe('day 18', () => {
    describe('reduceExplode', () => {
        it('should match example one', () => {
            const input: SnailFishNum = [[[[[9,8],1],2],3],4];
            const expected = [[[[0,9],2],3],4];

            const result = reduceExplode(input);

            eq(result.type, 'Explode');
            eq(result.number, expected);
        });

        it('should match example two', () => {
            const input: SnailFishNum = [7,[6,[5,[4,[3,2]]]]];
            const expected = [7,[6,[5,[7,0]]]];

            const result = reduceExplode(input);

            eq(result.type, 'Explode');
            eq(result.number, expected);
        });

        it('should match example three', () => {
            const input: SnailFishNum = [[6,[5,[4,[3,2]]]],1];
            const expected = [[6,[5,[7,0]]],3];

            const result = reduceExplode(input);

            eq(result.type, 'Explode');
            eq(result.number, expected);
        });

        it('should match example four', () => {
            const input: SnailFishNum = [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]];
            const expected = [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]];

            const result = reduceExplode(input);

            eq(result.type, 'Explode');
            eq(JSON.stringify(result.number), JSON.stringify(expected));
        });

        it('should match example five', () => {
            const input: SnailFishNum = [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]];
            const expected = [[3,[2,[8,0]]],[9,[5,[7,0]]]];

            const result = reduceExplode(input);

            eq(result.type, 'Explode');
            eq(JSON.stringify(result.number), JSON.stringify(expected));
        });
    });

    describe('add', () => {
        it('should match the first example', () => {
            const a: SnailFishNum = [[[[4,3],4],4],[7,[[8,4],9]]];
            const b: SnailFishNum = [1,1];
            const expected = [[[[0,7],4],[[7,8],[6,0]]],[8,1]];

            const result = add(a, b);
            
            eq(result, expected);
        });
    });

    describe('addAll', () => {
        it('should match the first example', () => {
            const nums: SnailFishNum[] = [
                [1,1],
                [2,2],
                [3,3],
                [4,4],
            ];
            const expected = [[[[1,1],[2,2]],[3,3]],[4,4]];

            const result = addAll(nums);

            eq(result, expected);
        });

        it('should match the second example', () => {
            const nums: SnailFishNum[] = [
                [1,1],
                [2,2],
                [3,3],
                [4,4],
                [5,5],
            ];
            const expected = [[[[3,0],[5,3]],[4,4]],[5,5]];

            const result = addAll(nums);

            eq(result, expected);
        });

        it('should match the third example', () => {
            const nums: SnailFishNum[] = [
                [1,1],
                [2,2],
                [3,3],
                [4,4],
                [5,5],
                [6,6],
            ];
            const expected = [[[[5,0],[7,4]],[5,5]],[6,6]];

            const result = addAll(nums);

            eq(result, expected);
        });

        it('should match the big example', () => {
            const nums: SnailFishNum[] = [
                [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
                [7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
                [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
                [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
                [7,[5,[[3,8],[1,4]]]],
                [[2,[2,2]],[8,[8,1]]],
                [2,9],
                [1,[[[9,3],9],[[9,0],[0,7]]]],
                [[[5,[7,4]],7],1],
                [[[[4,2],2],6],[8,7]],
            ];
            const expected = [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]];

            const result = addAll(nums);

            eq(result, expected);
        });
    });

    describe('magnitude', () => {
        it('should match the first example', () => {
            const num: SnailFishNum = [[1,2],[[3,4],5]];
            const expected = 143;

            const result = magnitude(num);

            eq(result, expected);
        });

        it('should match the second example', () => {
            const num: SnailFishNum = [[[[0,7],4],[[7,8],[6,0]]],[8,1]];
            const expected = 1384;

            const result = magnitude(num);

            eq(result, expected);
        });

        it('should match the third example', () => {
            const num: SnailFishNum = [[[[1,1],[2,2]],[3,3]],[4,4]];
            const expected = 445;

            const result = magnitude(num);

            eq(result, expected);
        });

        it('should match the fourth example', () => {
            const num: SnailFishNum = [[[[3,0],[5,3]],[4,4]],[5,5]];
            const expected = 791;

            const result = magnitude(num);

            eq(result, expected);
        });

        it('should match the fifth example', () => {
            const num: SnailFishNum = [[[[5,0],[7,4]],[5,5]],[6,6]];
            const expected = 1137;

            const result = magnitude(num);

            eq(result, expected);
        });

        it('should match the sixth example', () => {
            const num: SnailFishNum = [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]];
            const expected = 3488;

            const result = magnitude(num);

            eq(result, expected);
        });
    });
});
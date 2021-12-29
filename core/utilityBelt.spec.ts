import { deepStrictEqual as eq } from 'assert';
import { findIndices, replaceAtIndex } from './utilityBelt';

describe('utilityBelt', () => {
    describe('findIndices', () => {
        it('finds a single index', () => {
            eq(findIndices('abc', 'b'), [1]);
        });

        it('returns empty for no matches', () => {
            eq(findIndices('abc', 'd'), []);
        });

        it('finds longer substrings', () => {
            eq(findIndices('abc', 'bc'), [1]);
        });

        it('finds multiple matches', () => {
            eq(findIndices('abca', 'a'), [0, 3]);
        });

        it('finds overlapping matches', () => {
            eq(findIndices('aaaa', 'aa'), [0, 1, 2]);
        });
    });

    describe('replaceAtIndex', () => {
        it('replaces equal length', () => {
            eq(replaceAtIndex('baba', 1, 'ab', 'cc'), 'bcca');
        });

        it('replaces longer with shorter', () => {
            eq(replaceAtIndex('baba', 1, 'ab', 'c'), 'bca');
        });

        it('replaces shorter with longer', () => {
            eq(replaceAtIndex('baba', 1, 'a', 'cc'), 'bccba');
        });

        it('works at the start', () => {
            eq(replaceAtIndex('baba', 0, 'b', 'cc'), 'ccaba');
        });

        it('works at the end', () => {
            eq(replaceAtIndex('baba', 3, 'a', 'cc'), 'babcc');
        });

        it('does not modify the original', () => {
            const original = 'baba';

            replaceAtIndex('baba', 3, 'a', 'cc');

            eq(original, 'baba');
        });
    });
});
import { deepStrictEqual as eq } from 'assert';
import {
    emptyFishCounter,
    getNextGeneration,
} from './6';

describe('day 6', () => {
    describe('getNextGeneration', () => {
        it('should reduce the day counters', () => {
            const ctr = {
                ...emptyFishCounter,
                5: 3,
                3: 4,
            };
            const expected = {
                ...emptyFishCounter,
                4: 3,
                2: 4,
            };

            const result = getNextGeneration(ctr);

            eq(result, expected);
        });

        it('should roll over from 0 to 6', () => {
            const ctr = { ...emptyFishCounter, 0: 3 };
            
            const result = getNextGeneration(ctr);

            eq(result['0'], 0);
            eq(result['6'], 3);
        });

        it('should spawn equal number of fish in general 8 for 0', () => {
            const ctr = { ...emptyFishCounter, 0: 3 };
            const expected = { ...emptyFishCounter, 6: 3, 8: 3 };
            
            const result = getNextGeneration(ctr);

            eq(result, expected);
        });

        it('should merge reducing and reproduction correctly', () => {
            const ctr = { ...emptyFishCounter, 7: 1, 0: 3 };
            const expected = { ...emptyFishCounter, 6: 4, 8: 3 };

            const result = getNextGeneration(ctr);

            eq(result, expected);
        });
    });
});
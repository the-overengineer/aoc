import { Solution } from '@core/DaySolution';
import { slidingWindow } from '@core/utilityBelt';

type Inserters = Record<string, string>;

interface InitalState {
    initialState: string
    inserters: Inserters;
}

function parseInitialState(input: string) {
    const [initialState, rows] = input.split('\n\n');
    const inserters: Inserters = {};

    for (const row of rows.split('\n')) {
        const [pair, mapsTo] = row.split(' -> ');
        inserters[pair] = mapsTo;
    }

    return {
        initialState,
        inserters,
    };
}

function countPairs(input: string, inserters: Inserters, steps: number): Record<string, number> {
    const emptyCounter: Record<string, number> = Object.keys(inserters).reduce((cnt, pair) => ({ ...cnt, [pair]: 0 }), {});
    let pairFrequencies = slidingWindow(input.split(''), 2).reduce((cnt, pair) => {
        const pairStr = pair.join('');
        return {
            ...cnt,
            [pairStr]: cnt[pairStr] + 1, 
        };
    }, emptyCounter);

    for (let step = 0; step < steps; step++) {
        const nextFrequencies = { ...emptyCounter };
        
        for (const [pair, produces] of Object.entries(inserters)) {
            const [a, b] = pair.split('');
            const pairCount = pairFrequencies[pair];

            nextFrequencies[`${a}${produces}`] += pairCount;
            nextFrequencies[`${produces}${b}`] += pairCount;
        }

        pairFrequencies = nextFrequencies;
    }

    const counts = Object.entries(pairFrequencies).reduce((cnt, [pair, freq]) => {
        const [a, b] = pair.split('');
        cnt[a] = (cnt[a] ?? 0) + freq;
        return cnt;
    }, {} as Record<string, number>);
    
    // We forgot to count the last on there!
    counts[input[input.length - 1]] += 1;

    return counts;
}

function part1(input: string) {
    const { initialState, inserters } = parseInitialState(input);
    const counts = countPairs(initialState, inserters, 10);

    const maxSeen = Math.max(...Object.values(counts));
    const minSeen = Math.min(...Object.values(counts));

    return maxSeen - minSeen;
}

function part2(input: string) {
    const { initialState, inserters } = parseInitialState(input);
    const counts = countPairs(initialState, inserters, 40);

    const maxSeen = Math.max(...Object.values(counts));
    const minSeen = Math.min(...Object.values(counts));

    return maxSeen - minSeen;
}

export default Solution.raw({
    part1,
    part2,
});
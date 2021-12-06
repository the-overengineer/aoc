import {
    read,
    sum,
 } from './utilityBelt';

export type FishAge = 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0;
export type FishCounter = Record<FishAge, number>;
export const emptyFishCounter: FishCounter = {
    8: 0,
    7: 0,
    6: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
    0: 0,
};

async function getFish(path: string): Promise<number[]> {
    return read(path).then((row) => row.split(',').map((f) => parseInt(f, 10)));
}

function getFishCounter(fish: number[]): FishCounter {
    const counter: FishCounter = {...emptyFishCounter};
    
    for (const f of fish) {
        counter[f as FishAge]++;
    }
    
    return counter;
}

export function getNextGeneration(fishCounter: FishCounter): FishCounter {
    const nextCounter = { ...emptyFishCounter };

    Object.keys(fishCounter).forEach((ageStr) => {
        const age = parseInt(ageStr, 10) as FishAge;
        const value = fishCounter[age];
        
        if (value === 0) {
            return;
        }

        if (age === 0) {
            nextCounter[6] += value;
            nextCounter[8] += value;
        } else {
            nextCounter[age - 1 as FishAge] += value;
        }
    });

    return nextCounter;
}

function countFish(counter: FishCounter): number {
    return sum(Object.values(counter));
}

async function part1() {
    const fish = await getFish('./6.input');
    let counter = getFishCounter(fish);

    for (let i = 0; i < 80; i++) {
        counter = getNextGeneration({ ...counter });
    }

    return countFish(counter);
}

async function part2() {
    const fish = await getFish('./6.input');
    let counter = getFishCounter(fish);

    for (let i = 0; i < 256; i++) {
        counter = getNextGeneration({ ...counter });
    }

    return countFish(counter);
}

// part1().then(console.log);
part2().then(console.log);

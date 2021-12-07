import {
    read,
    sum,
} from './utilityBelt';

async function getCrabPositions(path: string): Promise<number[]> {
    return read(path)
        .then((line) => line.split(',').map((it) => parseInt(it, 10)));
}

function mean(xs: number[]): number {
    return sum(xs) / xs.length;
}

function median(xs: number[]): number {
    const sorted = xs.sort((a, b) => a - b);
    if (xs.length % 2 === 1) {
        return sorted[Math.floor(xs.length / 2)];
    } else {
        return (sorted[xs.length / 2 - 1] + sorted[xs.length / 2]) / 2;
    }
}

function scaledCost(distance: number): number {
    let sum = 0;
    for (let i = distance; i > 0; i--) {
        sum += i;
    }
    return sum;
}

async function part1() {
    const crabs = await getCrabPositions('./7.input');
    const crabMedian = median(crabs);
    const diffs = crabs.map((c) => Math.abs(crabMedian - c));
    return sum(diffs);
}

// I should probably have used Gauss' formula here
function cost(crabs: number[], position: number): number {
    return sum(crabs.map((c) => scaledCost(Math.abs(position - c))));
}

function _greedySmallestCost(sortedCrabs: number[], currentPosition: number, costAtPosition: number): [number, number] {
    const costAtLeft = currentPosition > 0
        ? cost(sortedCrabs, currentPosition - 1)
        : undefined;
    const costAtRight = currentPosition < sortedCrabs.length
        ? cost(sortedCrabs, currentPosition + 1)
        : undefined;

    if (costAtLeft != null && costAtLeft < costAtPosition) {
        return _greedySmallestCost(sortedCrabs, currentPosition - 1, costAtLeft);
    } else if (costAtRight != null && costAtRight < costAtPosition) {
        return _greedySmallestCost(sortedCrabs, currentPosition + 1, costAtRight);
    } else {
        return [currentPosition, costAtPosition];
    }
}

function greedySmallestCost(crabs: number[]): [number, number] {
    const sortedCrabs = crabs.sort((a, b) => a - b);
    const currentPosition = Math.round(mean(sortedCrabs));
    const currentCost = cost(sortedCrabs, currentPosition);
    return _greedySmallestCost(sortedCrabs, currentPosition, currentCost);
}

// Mean is off by one, though I thought it would work :thinking_face:
// Probably need to check both floor and ceil, or something.
async function part2() {
    const crabs = await getCrabPositions('./7.input');
    return greedySmallestCost(crabs);

}

// part1().then(console.log);
part2().then(console.log);

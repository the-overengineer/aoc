import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { sum } from '@core/utilityBelt';

function collect(
    containers: number[],
    target: number,
    startingIndex: number = 0,
    usedIndices: Set<number> = new Set(),
): number[][] {
    const usedContainers = Array.from(usedIndices).map((idx) => containers[idx]);
    const weight = sum(usedContainers);
    let collectedCombinations: number[][] = [];

    if (weight === target) {
        return [Array.from(usedContainers)];
    } else if (weight > target) {
        return [];
    }

    const leftoverIndices = containers.map((_, idx) => idx)
        .filter((idx) => idx >= startingIndex)
        .filter((idx) => !usedIndices.has(idx));
    for (const idx of leftoverIndices) {
        collectedCombinations.push(...collect(containers, target, idx, usedIndices.with(idx)));
    }

    return collectedCombinations;
}

function part1(lines: string[]) {
    const containers = lines.map(_ => _.toInt()).sort((a, b) => b - a);
    return collect(containers, 150).length;
}

function part2(lines: string[]) {
    const containers = lines.map(_ => _.toInt()).sort((a, b) => b - a);
    const containerUsagesCounts = collect(containers, 150).map(_ => _.length);
    const minContainerCount = Math.min(...containerUsagesCounts);
    return containerUsagesCounts.filter((it) => it === minContainerCount).length;
}

export default Solution.lines({
    part1,
    part2,
});

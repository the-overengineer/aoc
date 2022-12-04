import { Solution } from '@core/DaySolution';
import { sum } from '@core/utilityBelt';

function part1(lines: string[]): number {
    const orbitMap = getOrbitMap(lines);
    const objects = [...orbitMap.keys()];
    return sum(objects.map((body) => getOrbitScore(body, orbitMap)))
}

function part2(lines: string[]): number {
    const orbitMap = getOrbitMap(lines);
    const myChain = getOrbitChain('YOU', orbitMap);
    const santaChain = getOrbitChain('SAN', orbitMap);
    const myCommonIndex = myChain.findIndex((val) => santaChain.includes(val));
    const santasCommonIndex = santaChain.indexOf(myChain[myCommonIndex]);
    return myCommonIndex + santasCommonIndex - 2;
}

function getDirectOrbit(line: string): [string, string] {
    const [orbited, orbits] = line.split(')');
    return [orbits, orbited];
}

function getOrbitMap(lines: string[]): Map<string, string> {
    return new Map(lines.map(getDirectOrbit));
}

function getOrbitScore(body: string, orbitMap: Map<string, string>): number {
    if (orbitMap.has(body)) {
        return 1 + getOrbitScore(orbitMap.get(body)!, orbitMap);
    } else {
        return 0;
    }
}

function getOrbitChain(body: string, orbitMap: Map<string, string>, acc: string[] = []): string[] {
    if (orbitMap.has(body)) {
        return getOrbitChain(orbitMap.get(body)!, orbitMap, [
            ...acc,
            body,
        ]);
    } else {
        return [...acc, body];
    }
}

export default Solution.lines({
    part1,
    part2,
});

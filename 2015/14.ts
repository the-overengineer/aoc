import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { fst, zip } from '@core/utilityBelt';

interface Reindeer {
    name: string;
    speed: number;
    stamina: number;
    restPeriod: number;
}

function parseReindeer(line: string): Reindeer {
    const [_, name, speedstr, staminastr, restPeriodstr] =
        /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/.exec(line)!;
    
    return {
        name,
        speed: speedstr.toInt(),
        stamina: staminastr.toInt(),
        restPeriod: restPeriodstr.toInt(),
    };
}

function distanceAt(reindeer: Reindeer, time: number): number {
    const cycles = Math.floor(time / (reindeer.stamina + reindeer.restPeriod));
    const leftoverTime = time % (reindeer.stamina + reindeer.restPeriod);
    const cycleDistance = cycles * reindeer.speed * reindeer.stamina;
    const partwayDistance = Math.min(leftoverTime, reindeer.stamina) * reindeer.speed;
    return cycleDistance + partwayDistance ;
}

function part1(lines: string[]) {
    const reindeer = lines.map(parseReindeer);
    const distances = reindeer.map((r) => distanceAt(r, 2503));
    return Math.max(...distances);
}

function part2(lines: string[]) {
    const reindeer = lines.map(parseReindeer);
    const score = new Map<string, number>(reindeer.map((r) => [r.name, 0]));
    for (let i = 1; i <= 2503; i++) {
        const distances = reindeer.map((r) => distanceAt(r, i));
        const max = Math.max(...distances);
        const winners = zip(reindeer, distances).filter(([_, dist]) => dist === max).map(fst);
        winners.forEach((r) => {
            score.set(r.name, score.get(r.name)! + 1);
        });
    }

    return Math.max(...score.values());
}

export default Solution.lines({
    part1,
    part2,
});

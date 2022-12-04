import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { sum } from '@core/utilityBelt';

function part1(lines: string[]): number {
    const masses = lines.map(_ => _.toInt());
    const fuelRequirements = masses.map(getFuelRequirements);
    return sum(fuelRequirements);
}

function part2(lines: string[]): number {
    const masses = lines.map(_ => _.toInt());
    const fuelRequirements = masses.map(getFuelRequirementsTotal);
    return sum(fuelRequirements);
}

function getFuelRequirements(mass: number) {
    return Math.floor(mass / 3) - 2;
}

function getFuelRequirementsTotal(mass: number): number {
    let requirements = getFuelRequirements(mass);
    let total = requirements;

    while(true) {
        requirements = getFuelRequirements(requirements);
        if (requirements <= 0) {
            return total;
        } else {
            total += requirements;
        }
    }
}

export default Solution.lines({
    part1,
    part2,
});

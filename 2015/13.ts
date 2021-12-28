import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { permutations } from '@core/utilityBelt';

function getHappinessMappings(lines: string[]): Map<string, Map<string, number>> {
    const happiness = new Map<string, Map<string, number>>();

    for (const line of lines) {
        const [_, personA, modifier, numStr, personB] =
            /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)./.exec(line)!;
        const num = (modifier === 'gain' ? 1 : -1) * numStr.toInt();

        if (!happiness.has(personA)) {
            happiness.set(personA, new Map<string, number>());
        }

        happiness.get(personA)!.set(personB, num);
    }

    return happiness;
}

function countHappiness(seatings: string[], mappings: Map<string, Map<string, number>>): number {
    let happiness: number = 0;

    seatings.forEach((person, i) => {
        const left = seatings[i === 0 ? seatings.length - 1 : i - 1];
        const right = seatings[i === seatings.length - 1 ? 0 : i + 1];
        happiness += mappings.get(person)!.get(left)!;
        happiness += mappings.get(person)!.get(right)!;
    });

    return happiness;
}

function appendAmbivalentPerson(mappings: Map<string, Map<string, number>>, person: string): void {
    const persons = Array.from(mappings.keys());
    mappings.set(person, new Map());

    for (const key of persons) {
        mappings.get(key)!.set(person, 0);
        mappings.get(person)!.set(key, 0);
    }
}

function part1(lines: string[]) {
    const mappings = getHappinessMappings(lines);
    const persons = Array.from(mappings.keys());
    const seatingPermutations = permutations(persons);
    return Math.max(...seatingPermutations.map((seatings) => countHappiness(seatings, mappings)));
}

function part2(lines: string[]) {
    const mappings = getHappinessMappings(lines);
    appendAmbivalentPerson(mappings, 'Luka');
    const persons = Array.from(mappings.keys());
    const seatingPermutations = permutations(persons);
    const happinesses = seatingPermutations.map((seatings) => countHappiness(seatings, mappings));
    let max = 0;

    for (const happiness of happinesses) {
        if (happiness > max) {
            max = happiness;
        }
    }

    return max;
}

export default Solution.lines({
    part1,
    part2,
});

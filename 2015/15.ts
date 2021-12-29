import '@core/polyfill';
import { Solution } from '@core/DaySolution';

interface Ingredient {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
}

function parseIngredient(line: string): Ingredient {
    const [name, features] = line.split(': ');
    const featureLookup: Record<string, number> = features
        .split(', ')
        .map((feature) => feature.split(' '))
        .reduce((acc, [name, value]) => ({ ...acc, [name]: value.toInt() }), {});
    
    return {
        name,
        ...featureLookup,
    } as Ingredient;
}

function part1(lines: string[]) {

}

export default Solution.lines({
    part1,
});

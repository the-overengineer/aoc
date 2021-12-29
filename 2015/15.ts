import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { Counter } from '@core/Counter';
import { flatten, fst, product, range, sum, zip } from '@core/utilityBelt';
import { GenericSet } from '@core/GenericSet';

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

interface IngredientCount {
    ingredient: Ingredient;
    count: number;
}

function redistributeFirst(xs: number[]): number[][] {
    if (xs[0] === 0) {
        return [xs];
    }

    return range(1, xs.length).map((i) => {
        const copy = [...xs];
        copy[0]--;
        copy[i]++;
        return copy;
    });
}

function getDistributions(ofNumber: number, size: number): number[][] {
    const initialDistribution = [ofNumber, ...[0].repeat(size - 1)];
    const distributions: GenericSet<number[]> = new GenericSet([initialDistribution]);
    let pool: GenericSet<number[]> = new GenericSet([initialDistribution]);

    for (let i = 0; i < ofNumber; i++) {
        pool = new GenericSet<number[]>(flatten(pool.toList().map(redistributeFirst)));
        pool.toList().forEach((v) => {
            distributions.add(v);
        });
    }

    return distributions.toList();
}

function scoreWithCalories(counts: IngredientCount[]): [number, number] {
    let capacity = 0;
    let durability = 0;
    let flavor = 0;
    let texture = 0;
    let calories = 0;

    counts.forEach(({ ingredient, count }) => {
        capacity += ingredient.capacity * count;
        durability += ingredient.durability * count;
        flavor += ingredient.flavor * count;
        texture += ingredient.texture * count;
        calories += ingredient.calories * count;
    });

    const score = capacity <= 0 || durability <= 0 || flavor <= 0 || texture <= 0
        ? 0
        : product([capacity, durability, flavor, texture]);

    return [score, calories];
}

function part1(lines: string[]) {
    const ingredients = lines.map(parseIngredient);
    const combinations = getDistributions(100, ingredients.length).map((dist) => zip(ingredients, dist));
    const scoresWithCalories = combinations.map((pairs) => {
        const nicePairs = pairs.map(([ingredient, count]) => ({ ingredient, count }));
        return scoreWithCalories(nicePairs);
    });
    let max = 0;
    for (const [score] of scoresWithCalories) {
        if (score > max) {
            max = score;
        }
    }
    return max;
}

function part2(lines: string[]) {
    const ingredients = lines.map(parseIngredient);
    const combinations = getDistributions(100, ingredients.length).map((dist) => zip(ingredients, dist));
    const scoresWithCalories = combinations.map((pairs) => {
        const nicePairs = pairs.map(([ingredient, count]) => ({ ingredient, count }));
        return scoreWithCalories(nicePairs);
    });
    let max = 0;
    for (const [score, calories] of scoresWithCalories) {
        if (calories === 500 && score > max) {
            max = score;
        }
    }
    return max;
}

export default Solution.lines({
    part1,
    part2,
});

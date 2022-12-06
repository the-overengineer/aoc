import { Solution } from '@core/DaySolution';

type Resource = string;
type Recipe = {
    producedAmount: number;
    ingredients: {
        resource: Resource;
        count: number; 
    }[];
};
type ReactsFromLookup = Map<Resource, Recipe>;
type ProductionResult = {
    cost: number;
    leftovers: Record<Resource, number>;
};

function part1(lines: string[]): number {
    const res = productionCost()
}

function productionCost(
    lookup: ReactsFromLookup,
    resource: Resource,
    requiredCount: number,
    leftovers: Record<Resource, number>,
): ProductionResult {
    if (!lookup.has(resource)) {
        return {
            cost: 1,
            leftovers,
        };
    }

    const nextLeftovers = { ...leftovers };
    const recipe = lookup.get(resource)!;
    const alreadyExisting = leftovers[resource] ?? 0;
    nextLeftovers[resource] -= Math.min(requiredCount, alreadyExisting);
    const requiredProduction = requiredCount - alreadyExisting;

    if (requiredProduction <= 0) {
        return {
            cost: 0,
            leftovers: nextLeftovers,
        };
    }

    const iterations = Math.floor(recipe.producedAmount / requiredCount);
    const leftoverAmount = recipe.producedAmount % requiredCount;

    nextLeftovers[resource] = (nextLeftovers[resource] ?? 0) + leftoverAmount;

    const { cost, leftovers: producedLeftovers } = recipe.ingredients.reduce((state, ingredient) => {
        const res = productionCost(lookup, ingredient.resource, ingredient.count, state.leftovers);

        return {
            leftovers: res.leftovers,
            cost: res.cost + state.cost,
        };
    }, { cost: 0, leftovers: nextLeftovers });

    return {
        cost: cost * iterations,
        leftovers: producedLeftovers,
    };
}

export default Solution.lines({
    part1,
});

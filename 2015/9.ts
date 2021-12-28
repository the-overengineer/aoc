import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { genericDijkstraSearch } from '@core/search';
import { sum, zip } from '@core/utilityBelt';

function createConnections(inputs: string[]): Map<string, [string, number][]> {
    const connections = new Map<string, [string, number][]>();
    function add(a: string, b: string, cost: number) {
        if (!connections.has(a)) {
            connections.set(a, []);
        }

        connections.get(a)!.push([b, cost]);
    }

    inputs.forEach((input) => {
        const [_, start, end, costStr] = /^(\w+) to (\w+) = (\d+)$/.exec(input)!;
        const cost = costStr.toInt();
        add(start, end, cost);
        add(end, start, cost);
    });

    return connections;
}

function visitAll(
    current: string,
    connections: Map<string, [string, number][]>,
    minimise: boolean = true,
    visited: Set<string> = new Set([current]),
    cost: number = 0,
): number {
    if (visited.size === connections.size) {
        return cost;
    }

    const neighbours = connections.get(current)!.filter(([n]) => !visited.has(n));

    if (neighbours.length === 0) {
        return Infinity;
    }

    const aggregator = minimise ? Math.min : Math.max;

    return aggregator(...neighbours.map(([n, distance]) => {
        return visitAll(
            n,
            connections,
            minimise,
            visited.with(n),
            cost + distance,
        )
    }));
}

function part1(inputs: string[]) {
    const connections = createConnections(inputs);
    const cities = Array.from(connections.keys());
    const distances = cities.map((city) => visitAll(city, connections));
    return Math.min(...distances);
}

function part2(inputs: string[]) {
    const connections = createConnections(inputs);
    const cities = Array.from(connections.keys());
    const distances = cities.map((city) => visitAll(city, connections, false));
    return Math.max(...distances);
}

export default Solution.lines({
    part1,
    part2,
});

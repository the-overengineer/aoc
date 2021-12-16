import { ArrayMap } from './ArrayMap';
import { ArraySet } from './ArraySet';
import { argmin, isEqual } from './utilityBelt';

export function dijkstraSearch<T extends any[]>(
    getNeighbours: (member: T) => T[],
    getCost: (member: T) => number,
    source: T,
    target: T,
): T[] {
    const vertexSet: ArraySet<T> = new ArraySet();
    const closedSet: ArraySet<T> = new ArraySet();
    const dist = new ArrayMap<T, number>();
    const prev = new ArrayMap<T, T>();

    vertexSet.add(source);
    dist.set(source, 0);

    while (vertexSet.size > 0) {
        const vertex = argmin(vertexSet.toList(), (v) => dist.get(v));

        closedSet.add(vertex);
        vertexSet.delete(vertex);

        if (isEqual(vertex, target)) {
            const reversePath: T[] = [];
            let current = target;

            while (current != null) {
                reversePath.push(current);
                current = prev.get(current)!;

                if (current == null || isEqual(current, source)) {
                    return reversePath.reverse();
                }
            }
        }

        const neighbours = getNeighbours(vertex)
            .filter((n) => !closedSet.has(n));

        for (const neighbour of neighbours) {
            vertexSet.add(neighbour);

            const risk = getCost(neighbour);
            const cost = dist.get(vertex)! + risk;

            if (dist.get(neighbour) == null || cost < dist.get(neighbour)!) {
                dist.set(neighbour, cost);
                prev.set(neighbour, vertex);
            }

        }
    }

    throw new Error('Could not find shortest path!');
}
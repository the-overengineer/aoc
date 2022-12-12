import { GenericMap } from './GenericMap';
import { GenericSet } from './GenericSet';
import { argmin, isEqual } from './utilityBelt';

type Depth = number

export function bfs<T>(
    getNeighbours: (member: T) => T[],
    start: T,
    isTarget: (it: T) => boolean,
): [T, Depth] | undefined {
    const open: [T, Depth][] = [];
    const visited: GenericSet<T> = new GenericSet();

    visited.add(start);
    open.push([start, 0]);

    while (open.length > 0) {
        const [vertex, depth] = open.shift()!;

        if (isTarget(vertex)) {
            return [vertex, depth];
        }

        getNeighbours(vertex)
            .filter((n) => !visited.has(n))
            .forEach((n) => {
                visited.add(n);
                open.push([n, depth + 1]);
            });
    }
}

export function dijkstraSearch<T extends any[]>(
    getNeighbours: (member: T) => T[],
    getCost: (member: T) => number,
    source: T,
    target: T,
): T[] {
    const vertexSet: GenericSet<T> = new GenericSet();
    const closedSet: GenericSet<T> = new GenericSet();
    const dist = new GenericMap<T, number>();
    const prev = new GenericMap<T, T>();

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

type Cost = number;

export function genericDijkstraSearch<T>(
    getNeighbours: (member: T) => [T, Cost][],
    source: T,
    isDone: (it: T, visited: Set<T>) => boolean,
): T[] {
    const vertexSet: GenericSet<T> = new GenericSet();
    const closedSet: GenericSet<T> = new GenericSet();
    const dist = new GenericMap<T, number>();
    const prev = new GenericMap<T, T>();

    vertexSet.add(source);
    dist.set(source, 0);

    while (vertexSet.size > 0) {
        const vertex = argmin(vertexSet.toList(), (v) => dist.get(v));

        closedSet.add(vertex);
        vertexSet.delete(vertex);

        if (isDone(vertex, closedSet)) {
            const reversePath: T[] = [];
            let current = vertex;

            while (current != null) {
                reversePath.push(current);
                current = prev.get(current)!;

                if (current == null) {
                    return reversePath.reverse();
                }
            }
        }

        const neighbours = getNeighbours(vertex)
            .filter(([n]) => !closedSet.has(n));

        for (const [neighbour, cost] of neighbours) {
            vertexSet.add(neighbour);

            if (dist.get(neighbour) == null || cost < dist.get(neighbour)!) {
                dist.set(neighbour, cost);
                prev.set(neighbour, vertex);
            }

        }
    }

    throw new Error('Could not find shortest path!');
}

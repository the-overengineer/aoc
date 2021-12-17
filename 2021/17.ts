import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { gaussSum, isEqual } from '@core/utilityBelt';
import { ArraySet } from '@core/ArraySet';

interface Area {
    x: [number, number];
    y: [number, number];
}

type Path = [number, number][];

function parseArea(line: string): Area {
    const [_, xmin, xmax, ymin, ymax] = /^target area: x=([\d\-]+)..([\d\-]+), y=([\d\-]+)..([\d\-]+)$/.exec(line)!;
    return {
        x: [xmin.toInt(), xmax.toInt()],
        y: [ymin.toInt(), ymax.toInt()],
    };
}

function withinArea(point: [number, number], area: Area) {
    const [x, y] = point;
    const [xmin, xmax] = area.x;
    const [ymin, ymax] = area.y;

    return x >= xmin && x <= xmax && y >= ymin && y <= ymax;
}

enum ResultType {
    TooClose = 'TooClose',
    TooFar = 'TooFar',
    TooLow = 'TooLow',
    Hit = 'Hit',
}

function fire(
    current: [number, number],
    velocity: [number, number],
    targetArea: Area,
): ResultType {
    if (withinArea(current, targetArea)) {
        return ResultType.Hit;
    } else if (velocity[0] === 0 && current[0] < targetArea.x[0]) {
        return ResultType.TooClose;
    } else if (current[0] > targetArea.x[1]) {
        return ResultType.TooFar;
    } else if (current[1] < targetArea.y[0]) {
        return ResultType.TooLow;
    }

    const nextPoint: [number, number] = [
        current[0] + velocity[0],
        current[1] + velocity[1],
    ];
    const nextVelocity: [number, number] = [
        Math.max(0, velocity[0] - 1),
        velocity[1] - 1,
    ];

    return fire(nextPoint, nextVelocity, targetArea);
}

function part1(input: string) {
    const area = parseArea(input);
    const smallerYBound = Math.max(Math.abs(area.y[0]), Math.abs(area.y[1]));
    
    return gaussSum(smallerYBound - 1);
}

function part2(input: string) {
    const area = parseArea(input);
    const visited = new ArraySet<[number, number]>();
    const candidates: [number, number][] = [[0, 0]];
    let hitCount = 0;

    const add = (c: [number, number]) => {
        if (visited.has(c)) {
            return;
        }

        if (c.some((e) => Math.abs(e) > 500)) {
            return;
        }

        candidates.push(c);
    }

    while (candidates.length) {
        const candidate = candidates.pop()!;

        if (visited.has(candidate)) {
            continue;
        }

        visited.add(candidate);

        const [vx, vy] = candidate;
        const result = fire([0, 0], candidate, area);

        switch (result) {
            case ResultType.TooClose: {
                add([vx + 1, vy]);
                continue;
            }
            case ResultType.TooFar: {
                add([vx - 1, vy]);
                add([vx, vy - 1]);
                continue;
            }
            case ResultType.TooLow: {
                add([vx + 1, vy + 1]);
                add([vx, vy + 1]);
                continue;
            }
            case ResultType.Hit: {
                hitCount++;
                add([vx - 1, vy]);
                add([vx + 1, vy]);
                add([vx, vy - 1]);
                add([vx, vy + 1]);
                continue;
            }
        }
    }

    return hitCount;
}

export default Solution.raw({
    part1,
    part2,
})
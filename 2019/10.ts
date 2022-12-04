import { Solution } from '@core/DaySolution';
import { GenericSet } from '@core/GenericSet';
import { argmax, count, isEqual } from '@core/utilityBelt';
import { EOL } from 'os';

type X = number;
type Y = number;
type Point = [X, Y];

function part1(input: string): unknown {
    const asteroids = getAsteroidMap(input);
    const bestPoint = argmax(asteroids, (location) => countVisible(asteroids, location));
    console.log(bestPoint);
    return countVisible(asteroids, bestPoint);
}

function getAsteroidMap(input: string): Point[] {
    const asteroids: Point[] = [];

    input.split(EOL).forEach((row, y) => {
        row.split('').forEach((cell, x) => {
            if (cell === '#') {
                asteroids.push([x, y]);
            }
        });
    });

    return asteroids;
}

function countVisible(asteroids: Point[], source: Point): number {
    const others = asteroids.filter((asteroid) => !isEqual(asteroid, source));
    return count(
        others,
        (target) => isVisible(asteroids, source, target), 
    );
}

function isVisible(asteroids: Point[], source: Point, target: Point): boolean {
    return !asteroids.some((asteroid) => obscuresView(asteroid, source, target));
}

function obscuresView(point: Point, source: Point, target: Point): boolean {
    if (isEqual(point, source) || isEqual(point, target)) {
        return false;
    }

    const slope = (target[1] - source[1]) / (target[0] - source[0]);
    const offset = target[1] - slope * target[0];
    const isOnLine = target[0] === source[0]
        ? point[0] === target[0]
        : point[0] * slope + offset === point[1];

    if (!isOnLine) {
        return false;
    }

    const minX = Math.min(source[0], target[0]);
    const maxX = Math.max(source[0], target[0]);
    const minY = Math.min(source[1], target[1]);
    const maxY = Math.max(source[1], target[1]);
    const [x, y] = point;

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

export default Solution.raw({
    part1,
});

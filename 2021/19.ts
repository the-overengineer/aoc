import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { ArraySet } from '@core/ArraySet';
import { isEqual, pairings, sum } from '@core/utilityBelt';

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface Scanner {
    id: number;
    scans: Point3D[];
}

interface PositionedScanner extends Scanner {
    position: Point3D;
}

export function getScanners(input: string): Scanner[] {
    const blocks = input.split('\n\n');
    const scanners: Scanner[] = [];

    for (const block of blocks) {
        const [header, ...scanInputs] = block.split('\n');
        const id = /^--- scanner (\d+) ---$/.exec(header)![1]!.toInt();
        const scans: Point3D[] = [];

        for (const scan of scanInputs) {
            const [x, y, z] = scan.split(',');
            scans.push({
                x: x.toInt(),
                y: y.toInt(),
                z: z.toInt(),
            });
        }

        scanners.push({
            id,
            scans,
        });
    }

    return scanners;
}

export function point(x: number, y: number, z: number): Point3D {
    return { x, y, z };
}

export function unpack(point: Point3D): [number, number, number] {
    return [point.x, point.y, point.z];
}

export function mult(a: Point3D, b: Point3D): Point3D {
    return {
        x: a.x * b.x,
        y: a.y * b.y,
        z: a.z * b.z,
    };
}

export function add(a: Point3D, b: Point3D): Point3D {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z,
    };
}

export function sub(a: Point3D, b: Point3D): Point3D {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
    };
}

function manhattanDistance(a: Point3D, b: Point3D): number {
    return sum(unpack(sub(a, b)).map(it => Math.abs(it)));
}

// This should have been rotation matrices, but my brain is melty today
const rotators: Array<(p: Point3D) => Point3D> = [
    ({ x, y, z }: Point3D) => point(x, y, z),
    ({ x, y, z }: Point3D) => point(x, z, y),
    ({ x, y, z }: Point3D) => point(y, x, z),
    ({ x, y, z }: Point3D) => point(y, z, x),
    ({ x, y, z }: Point3D) => point(z, x, y),
    ({ x, y, z }: Point3D) => point(z, y, x),
];

export function rotations(scanner: Scanner): Scanner[] {
    const scanners: Scanner[] = [];
    const { id, scans } = scanner;
    const seen = new ArraySet<[number, number, number]>();
    const goodSample = scans.find((s) => Math.abs(s.x) !== Math.abs(s.y) && Math.abs(s.x) !== Math.abs(s.z))!;
    
    for (const mx of [-1, 1]) {
        for (const my of [-1, 1]) {
            for (const mz of [-1, 1]) {
                const mp = point(mx, my, mz);
                for (const rotate of rotators) {
                    const sample = mult(rotate(goodSample), mp);

                    if (seen.has(unpack(sample))) {
                        continue;
                    }

                    seen.add(unpack(sample));

                    scanners.push({
                        id,
                        scans: scans.map((scan) => mult(rotate(scan), mp)),
                    });

                }
            }
        }
    }

    return scanners;
}

function resolveTo(fixed: PositionedScanner, scanner: Scanner): PositionedScanner | undefined {
    for (const fixedPoint of fixed.scans) {
        for (const point of scanner.scans) {
            const offset = sub(point, fixedPoint);
            const remappedPoints = fixed.scans.map((fs) => add(fs, offset));
            const matchedPoints = remappedPoints.filter((rmp) => scanner.scans.some((p) => isEqual(p, rmp)));

            if (matchedPoints.length >= 12) {
                return {
                    ...scanner,
                    position: add(fixed.position, offset),
                };
            }
        }
    }
}

function position(
    positioned: PositionedScanner[],
    scanner: Scanner,
    lookup: Map<number, Scanner[]>,
): PositionedScanner | undefined {
    const combinations = lookup.get(scanner.id)!;
    for (const combination of combinations) {
        for (const fixed of positioned) {
            const resolvedScanner = resolveTo(fixed, combination);

            if (resolvedScanner != null) {
                return resolvedScanner;
            }
        }
    }
}

function resolveScannerPositions(scanners: Scanner[]): PositionedScanner[] {
    const resolved: PositionedScanner[] = [
        {
            ...scanners[0],
            position: point(0, 0, 0),
        },
    ];
    const rotationLookup = new Map<number, Scanner[]>();
    const queue = scanners.slice(1);
    let misses = 0;

    for (const el of queue) {
        rotationLookup.set(el.id, rotations(el));
    }

    while (queue.length > 0 && misses < queue.length) {
        const scanner = queue.pop()!;
        const positioned = position(resolved, scanner, rotationLookup);

        if (positioned != null) {
            misses = 0;
            console.log(`Found one, ${queue.length} remaining`);
            resolved.push(positioned);
        } else {
            // Insert back for later, we did not find anything
            queue.splice(0, 0, scanner);
            misses++;
        }
    }

    return resolved;
}

function part1(input: string) {
    const scanners = getScanners(input);
    const positioned = resolveScannerPositions(scanners);
    const beacons = new ArraySet<[number, number, number]>();

    positioned.forEach((scanner) => {
        scanner.scans.forEach((scan) => {
            const movedPoint = sub(scan, scanner.position);
            beacons.add(unpack(movedPoint));
        })
    });

    return beacons.size;
}

function part2(input: string) {
    const scanners = getScanners(input);
    const positioned = resolveScannerPositions(scanners);
    let maxDistance = 0;

    pairings(positioned).forEach(([a, b]) => {
        const distance = manhattanDistance(a.position, b.position);

        if (distance > maxDistance) {
            maxDistance = distance;
        }
    });
    for (let i = 0; i < positioned.length; i++) {
        for (let j = i + 1; j < positioned.length; j++) {
            const distance = manhattanDistance(positioned[i].position, positioned[j].position);

            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }
    }

    return maxDistance;
}

export default Solution.raw({
    part1,
    part2,
})
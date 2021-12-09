import {
    count,
    flatten,
    intersect,
    union,
    readLines,
    setEquals,
    difference,
} from "./utilityBelt";

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
enum Segment {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F',
    G = 'G',
}

const allSegments = Array.from(new Set(Object.keys(Segment))) as Segment[];

const correctDisplay: Record<Digit, Set<Segment>> = {
    '0': new Set([Segment.A, Segment.B, Segment.C, Segment.E, Segment.F, Segment.G]),
    '1': new Set([Segment.C, Segment.F]),
    '2': new Set([Segment.A, Segment.C, Segment.D, Segment.E, Segment.G]),
    '3': new Set([Segment.A, Segment.C, Segment.D, Segment.F, Segment.G]),
    '4': new Set([Segment.B, Segment.C, Segment.D, Segment.F]),
    '5': new Set([Segment.A, Segment.B, Segment.D, Segment.F, Segment.G]),
    '6': new Set([Segment.A, Segment.B, Segment.D, Segment.E, Segment.F, Segment.G]),
    '7': new Set([Segment.A, Segment.C, Segment.F]),
    '8': new Set([Segment.A, Segment.B, Segment.C, Segment.D, Segment.E, Segment.F, Segment.G]),
    '9': new Set([Segment.A, Segment.B, Segment.C, Segment.D, Segment.F, Segment.G]),
};

function possibleCombinations(
    mappings: Record<Segment, Set<Segment>>,
    accumulated: Array<Partial<Record<Segment, Segment>>> = [],
    toVisit: Segment[] = [...allSegments],
): Array<Record<Segment, Segment>> {
    if (toVisit.length === 0) {
        return accumulated as Array<Record<Segment, Segment>>;
    }

    const isFirstIteration = accumulated.length === 0;
    const next: Array<Partial<Record<Segment, Segment>>> = [];
    const visited = toVisit.pop()!;

    Array.from(mappings[visited]).forEach((realCandidate) => {
        if (isFirstIteration) {
            next.push({
                [visited]: realCandidate,
            });
        } else {
            accumulated.forEach((record) => {
                next.push({
                    ...record,
                    [visited]: realCandidate,
                });
            })
        }
    });

    return possibleCombinations(mappings, next, toVisit);
}

function findMapping(uniqueSegments: string[]): Record<Segment, Segment> {
    const potentialMappings: Record<Segment, Set<Segment>> = {} as any;
    const valueList = Object.values(correctDisplay);

    for (const segment of uniqueSegments) {
        const potentialValues = valueList.filter((s) => s.size === segment.length);
        const potentialSegmentValues = union(...potentialValues);
        const connectedSegments = segment.split('').map((sym) => sym.toLocaleUpperCase() as Segment);
        for (const connectedSegment of connectedSegments) {
            if (potentialMappings[connectedSegment] == null) {
                potentialMappings[connectedSegment] = potentialSegmentValues;
            } else {
                potentialMappings[connectedSegment] = intersect(
                    potentialMappings[connectedSegment],
                    potentialSegmentValues,
                );
            }
        }
    }

    // Okay, if we know it must be a thing for the shorter ones, we must remove it from the longer
    // ones, that's how the segmented display works, and only that way. That should give us some
    // useful information. The 3 is arbitrary, should really be while true, break when no change
    for (let i = 0; i < 3; i++) {
        Object.values(potentialMappings).sort((a, b) => a.size - b.size).forEach((segments) => {
            Object.keys(potentialMappings).forEach((k) => {
                if (potentialMappings[k as Segment].size > segments.size) {
                    potentialMappings[k as Segment] = difference(
                        potentialMappings[k as Segment],
                        segments,
                    );
                }
            });
        });
    }

    const mappingsToReal = possibleCombinations(potentialMappings);

    const validMappings = mappingsToReal.filter((mapping) => {
        const uniqueRhs = new Set(Object.values(mapping));

        if (uniqueRhs.size < allSegments.length) {
            return false;
        }

        return uniqueSegments.every((segment) => {
            const represents = new Set(
                segment
                    .split('')
                    .map((it) => it.toLocaleUpperCase() as Segment)
                    .map((s) => mapping[s]),
            );

            return valueList.some((digit) => setEquals(digit, represents));
        })
    });

    if (validMappings.length !== 1) {
        throw new Error('Found multiple possible valid mappings: ' + validMappings.length);
    }

    return validMappings[0];
}

async function part1() {
    const uniqueSizes = new Set([
        correctDisplay['1'].size,
        correctDisplay['4'].size,
        correctDisplay['7'].size,
        correctDisplay['8'].size,
    ]);
    const lines = await readLines('./8.input');
    const outputRows = lines.map((line) => line.split(' | ')[1].split(' '));
    const outputs = flatten(outputRows);
    const uniquesCount = count(outputs, (o) => uniqueSizes.has(o.length));
    return uniquesCount;
}

async function part2() {
    const lines = await readLines('./8.input');
    let digitSum = 0;
    for (const line of lines) {
        const [uniquePart, digitPart] = line.split(' | ');
        const uniqueSegments = uniquePart.split(' ').sort((a, b) => a.length - b.length);
        const inputs = digitPart.split(' ').map((input) => {
            return input.split('').map((c) => c.toLocaleUpperCase() as Segment);
        });
        
        const mapping = findMapping(uniqueSegments);

        const remappedInputs = inputs.map((input) => {
            return new Set(input.map((c) => mapping[c]));
        });

        const digits = remappedInputs.map((i) => Object.keys(correctDisplay).find((k) => {
            return setEquals(correctDisplay[k as Digit], i);
        }));

        const resolvedNumber = parseInt(digits.join(''), 10);

        digitSum += resolvedNumber;
    }

    return digitSum;
}

// part1().then(console.log);
part2().then(console.log);
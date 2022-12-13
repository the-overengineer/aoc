import { Solution } from '@core/DaySolution';
import { enumerate, flatten, isEqual, snd, sum } from '@core/utilityBelt';

type Signal = number | Signal[];
type Packet = Signal[];
type PacketPair = [Packet, Packet];
const Ordering = {
    Correct: -1,
    Incorrect: 1,
    Unknown: 0,
} as const;
type Ordering = typeof Ordering[keyof typeof Ordering];

function part1(input: string): number {
    const pairs = parse(input);
    const enumerated = enumerate(pairs);
    const ordered = enumerated.filter(([x]) => getPacketOrdering(...x) === Ordering.Correct);
    const orderedIndices = ordered.map(snd).map(_ => _ + 1);
    return sum(orderedIndices);
}

function part2(input: string): number {
    const divider1 = [[2]];
    const divider2 = [[6]];
    const pairs: Packet[] = [...flatten(parse(input)), divider1, divider2];
    const sorted = pairs.sort((a, b) => getPacketOrdering(a, b));
    const dividerIndex1 = 1 + sorted.findIndex(_ => isEqual(_, divider1));
    const dividerIndex2 = 1 + sorted.findIndex(_ => isEqual(_, divider2));

    return dividerIndex1 * dividerIndex2;
}

function getPacketOrdering(a: Packet, b: Packet): Ordering {
    const len = Math.max(a.length, b.length);

    for (let i = 0; i < len; i++) {
        if (i >= a.length) {
            return Ordering.Correct;
        } else if (i >= b.length) {
            return Ordering.Incorrect;
        }

        const va = a[i];
        const vb = b[i];

        if (Array.isArray(va) && Array.isArray(vb)) {
            const subordering = getPacketOrdering(va, vb);
            if (subordering !== Ordering.Unknown) {
                return subordering;
            }
        } else if (typeof va === 'number' && typeof vb === 'number') {
            if (va < vb) {
                return Ordering.Correct;
            } else if (va > vb) {
                return Ordering.Incorrect;
            }
        } else if (typeof va === 'number' && Array.isArray(vb)) {
            const subordering = getPacketOrdering([va], vb);
            if (subordering !== Ordering.Unknown) {
                return subordering;
            }
        } else if (Array.isArray(va) && typeof vb === 'number') {
            const subordering = getPacketOrdering(va, [vb]);
            if (subordering !== Ordering.Unknown) {
                return subordering;
            }
        } else {
            throw new Error(`Wut: ${va} | ${vb}`);
        }
    }

    return Ordering.Unknown;
}

function parse(input: string): PacketPair[] {
    return input.split('\n\n').map((group) => {
        const [packet1, packet2] = group.split('\n');
        return [
            eval(packet1) as Packet,
            eval(packet2) as Packet,
        ];
    });
}

export default Solution.raw({
    part1,
    part2,
});

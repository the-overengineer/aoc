import '@core/polyfill';
import { Solution } from '@core/DaySolution';
import { ArrayMap } from '@core/ArrayMap';
import { sum } from '@core/utilityBelt';

type Range = [number, number];

interface Instruction {
    sign: -1 | 1;
    x: Range;
    y: Range;
    z: Range;
}

class Counter extends ArrayMap<[Range, Range, Range], number> {
    public update(key: [Range, Range, Range], by: number) {
        if (this.has(key)) {
            this.set(key, this.get(key)! + by);
        } else {
            this.set(key, by);
        }
    }
}

function parse(line: string): Instruction {
    const [_, toggle, xrange, yrange, zrange] =
        /^(on|off) x=([\-\.\d]+),y=([\-\.\d]+),z=([\-\.\d]+)$/.exec(line)!;

    return {
        sign: toggle === 'on' ? 1 : -1,
        x: xrange.split('..').map(_ => _.toInt()) as [number, number],
        y: yrange.split('..').map(_ => _.toInt()) as [number, number],
        z: zrange.split('..').map(_ => _.toInt()) as [number, number],
    }
}

function fallsOutOf(point: [number, number], bounds: [number, number]): boolean {
    return point[0] < bounds[0] && point[1] < bounds[0]
        || point[0] > bounds[1] && point[1] > bounds[1];
}

function keepWithin(instructions: Instruction[], bounds: [number, number]): Instruction[] {
    const filtered: Instruction[] = [];

    for (const ins of instructions) {
        if (fallsOutOf(ins.x, bounds) || fallsOutOf(ins.y, bounds) || fallsOutOf(ins.z, bounds)) {
            continue;
        }

        filtered.push({
            sign: ins.sign,
            x: [Math.max(ins.x[0], bounds[0]), Math.min(ins.x[1], bounds[1])],
            y: [Math.max(ins.y[0], bounds[0]), Math.min(ins.y[1], bounds[1])],
            z: [Math.max(ins.z[0], bounds[0]), Math.min(ins.z[1], bounds[1])],
        });
    }

    return filtered;
}

function collectVolume(instructions: Instruction[]): number {
    const volumes = new Counter();

    for (const { sign, x: [x0, x1], y: [y0, y1], z: [z0, z1] } of instructions) {
        const updates: Array<[[Range, Range, Range], number]> = [];
        // Find overlaps thus far
        for (const cube of volumes.keyList()) {
            const [[cx0, cx1], [cy0, cy1], [cz0, cz1]] = cube;
            // Get rid of any overlaps. If they're turning it off, that's it!
            // If they're double turning it on, we'll take care of that in the
            // next step
            const ox0 = Math.max(x0, cx0);
            const ox1 = Math.min(x1, cx1);
            const oy0 = Math.max(y0, cy0);
            const oy1 = Math.min(y1, cy1);
            const oz0 = Math.max(z0, cz0);
            const oz1 = Math.min(z1, cz1);

            // If there IS some overlap, cancel it out
            if (ox0 <= ox1 && oy0 <= oy1 && oz0 <= oz1) {
                const diff = -1 * volumes.get(cube)!;
                updates.push([[[ox0, ox1], [oy0, oy1], [oz0, oz1]], diff]);
            }
        }

        // If it's a "turn on", let's either mark that as new or negate the
        // turning off we just did!
        if (sign > 0) {
            updates.push([
                [[x0, x1], [y0, y1], [z0, z1]],
                sign,
            ]);
        }

        updates.forEach(([k, count]) => {
            volumes.update(k, count);
        });
    }

    // Sum up the volumes
    const volumeMagnitudes = volumes.entryList().map(([[x, y, z], c]) => {
        return (x[1] + 1 - x[0]) * (y[1] + 1 - y[0]) * (z[1] + 1 - z[0]) * c;
    });

    return sum(volumeMagnitudes);
}

function part1(lines: string[]) {
    const instructions = lines.map(parse);
    const validInstructions = keepWithin(instructions, [-50, 50]);
    return collectVolume(validInstructions);
}

function part2(lines: string[]) {
    const instructions = lines.map(parse);
    return collectVolume(instructions);
}

export default Solution.lines({
    part1,
    part2,
});
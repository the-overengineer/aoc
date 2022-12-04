import { Solution } from '@core/DaySolution';
import { Vector3D } from '@core/Linear';
import '@core/polyfill';
import { isEqual, lcmAll, sum } from '@core/utilityBelt';

type Moon = {
    position: Vector3D;
    velocity: Vector3D;
};
const pattern = /^<x=(-?\d+), y=(-?\d+), z=(-?\d+)>$/;

export function part1(lines: string[]): number {
    let moons = lines.map(parseMoon);

    for (let i = 0; i < 1_000; i++) {
        moons = getNextState(moons);
    }

    const energy = sum(moons.map(getEnergy));

    return energy;
}

function part2(lines: string[]): number {
    const startingMoons = lines.map(parseMoon);
    const initial = [
        startingMoons.map((m) => m.position.at(0)),
        startingMoons.map((m) => m.position.at(1)),
        startingMoons.map((m) => m.position.at(2)),
    ];
    let cycles = [];

    for (let index = 0; index < initial.length; index++) {
        let moons = [...startingMoons];
        
        for (let count = 1;;count++) {
            moons = getNextState(moons);
            const axis = moons.map((m) => m.position.at(index));
            if (isEqual(axis, initial[index])) {
                cycles[index] = count + 1;
                break;
            }
        }
    }

    console.log(cycles);

    return lcmAll(cycles);
}

function parseMoon(line: string): Moon {
    const [x, y, z] = pattern.exec(line)!.slice(1).map(_ => _.toInt());

    return {
        position: new Vector3D([x, y, z]),
        velocity: new Vector3D([0, 0, 0]),
    };
}

function applyVelocity(moon: Moon): Moon {
    return {
        position: moon.position.add(moon.velocity) as Vector3D,
        velocity: moon.velocity,
    };
}

function applyPairwiseGravity(moons: Moon[]): Moon[] {
    const updatedMoons: Moon[] = [];
    for (const moon of moons) {
        const otherMoons = moons.filter((m) => m !== moon);
        const updatedMoon: Moon = {
            position: moon.position,
            velocity: moon.velocity,
        };

        for (const otherMoon of otherMoons) {
            const diff = new Vector3D([
                axisDirection(moon.position, otherMoon.position, 0),
                axisDirection(moon.position, otherMoon.position, 1),
                axisDirection(moon.position, otherMoon.position, 2),
            ]);
            updatedMoon.velocity = updatedMoon.velocity.add(diff) as Vector3D;
        }

        updatedMoons.push(updatedMoon);
    }

    return updatedMoons;
}

function getNextState(moons: Moon[]): Moon[] {
    return applyPairwiseGravity(moons).map((moon) => applyVelocity(moon));
}

function getEnergy(moon: Moon): number {
    return (Math.abs(moon.position.at(0)) + Math.abs(moon.position.at(1)) + Math.abs(moon.position.at(2)))
         * (Math.abs(moon.velocity.at(0)) + Math.abs(moon.velocity.at(1)) + Math.abs(moon.velocity.at(2)));
}

function prettyMoon(moon: Moon): string {
    const { position: p, velocity: v } = moon;
    return `pos=<x=${p.at(0)}, y=${p.at(1)}, z=${p.at(2)}>, vel=<x=${v.at(0)}, y=${v.at(1)}, z=${v.at(2)}>`
}

function prettyMoons(moons: Moon[]): string {
    return moons.map(prettyMoon).join('|');
}

// Move a towards b on an axis
function axisDirection(a: Vector3D, b: Vector3D, axis: 0 | 1 | 2): -1 | 0 | 1 {
    if (a.at(axis) > b.at(axis)) {
        return -1
    } else if (a.at(axis) < b.at(axis)) {
        return 1;
    } else {
        return 0;
    }
}

export default Solution.lines({
    part1,
    part2,
});

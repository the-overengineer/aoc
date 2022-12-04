import { Solution } from '@core/DaySolution';
import { GenericSet } from '@core/GenericSet';
import { IntCodeComputer, MachineState } from './IntCodeComputer';
import { Direction, left, right, advance } from '@core/Direction';
import { Vector2D } from '@core/Linear';
import { max, min } from '@core/utilityBelt';
import { EOL } from 'os';

function part1(input: string): unknown {
    const computer = IntCodeComputer.fromString(input);
    const paintedTiles = new GenericSet<[number, number]>();
    const whiteTiles = new GenericSet<[number, number]>();
    let position = new Vector2D([0, 0]);
    let facing: Direction = Direction.Up;

    while (computer.state !== MachineState.Halted) {
        const isCurrentWhite = whiteTiles.has(position.data);
        const input = isCurrentWhite ? 1 : 0;
        const [colorCode, turnCode] = computer.run([input]).output;
        const isToWhite = colorCode === 1;

        paintedTiles.add(position.data);

        if (isCurrentWhite) {
            if (!isToWhite) {
                whiteTiles.delete(position.data);
            }
        } else if (isToWhite) {
            whiteTiles.add(position.data);
        }

        facing = turnCode === 0
            ? left(facing)
            : right(facing);

        position = advance(position, facing);        
    }

    return paintedTiles.size;
}

function part2(input: string): unknown {
    const computer = IntCodeComputer.fromString(input);
    const whiteTiles = new GenericSet<[number, number]>();
    let position = new Vector2D([0, 0]);
    let facing: Direction = Direction.Up;

    whiteTiles.add(position.data);

    while (computer.state !== MachineState.Halted) {
        const isCurrentWhite = whiteTiles.has(position.data);
        const input = isCurrentWhite ? 1 : 0;
        const [colorCode, turnCode] = computer.run([input]).output;
        const isToWhite = colorCode === 1;

        if (isCurrentWhite) {
            if (!isToWhite) {
                whiteTiles.delete(position.data);
            }
        } else if (isToWhite) {
            whiteTiles.add(position.data);
        }

        facing = turnCode === 0
            ? left(facing)
            : right(facing);

        position = advance(position, facing);        
    }

    return visualize(whiteTiles);
}

function visualize(whiteTiles: GenericSet<[number, number]>): string {
    const points = whiteTiles.toList();
    const minX = min(points.map(([x]) => x))!;
    const maxX = max(points.map(([x]) => x))!;
    const minY = min(points.map(([_, y]) => y))!;
    const maxY = max(points.map(([_, y]) => y))!;
    let visualisation = '';

    for (let y = maxY; y >= minY; y--) {
        for (let x = minX; x <= maxX; x++) {
            visualisation += whiteTiles.has([x, y]) ? '#' : '.';
        }

        visualisation += EOL;
    }

    return visualisation;
}

export default Solution.raw({
    part1,
    part2,
});

import { Solution } from '@core/DaySolution';
import { GenericSet } from '@core/GenericSet';
import { IntCodeComputer, MachineState } from './IntCodeComputer';
import { Direction, left, right, advance } from '@core/Direction';
import { Vector2D } from '@core/Linear';

function part1(input: string): unknown {
    const computer = IntCodeComputer.fromString(input);
    const paintedTiles = new GenericSet<[number, number]>();
    let position = new Vector2D([0, 0]);
    let facing = Direction.Up;

    while (computer.state !== MachineState.Halted) {
        // const [_, turn] = computer.run()
    }
    return 0;
}

// Up [0, 1]
// Right [1, 0]
// Bottom [0, -1]
// Left [-1, 0]

export default Solution.raw({
    part1,
});

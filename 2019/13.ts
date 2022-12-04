import { Solution } from '@core/DaySolution';
import { GenericMap } from '@core/GenericMap';
import { Vector2D } from '@core/Linear';
import { delay, fst, groupIntoChunks, minmax, snd } from '@core/utilityBelt';
import { EOL, totalmem } from 'os';
import { IntCodeComputer } from './IntCodeComputer';

const DrawnSymbol = {
    Empty: 0,
    Wall: 1,
    Block: 2,
    HorizontalPaddle: 3,
    Ball: 4,
} as const;
type DrawnSymbol = typeof DrawnSymbol[keyof typeof DrawnSymbol];

const Tilt = {
    Neutral: 0,
    Left: -1,
    Right: 1,
} as const;
type Tilt = typeof Tilt[keyof typeof Tilt];


type X = number;
type Y = number;
type Instruction = [X, Y, DrawnSymbol] | [-1, 0, number];

const representation: Record<DrawnSymbol, string> = {
    [DrawnSymbol.Empty]: ' ',
    [DrawnSymbol.Ball]: '◌',
    [DrawnSymbol.Block]: '▢',
    [DrawnSymbol.Wall]: '▆',
    [DrawnSymbol.HorizontalPaddle]: '▁',
}
type GameMap = GenericMap<[X, Y], DrawnSymbol>;
type GameState = {
    map: GameMap;
    score: number;
};


function part1(code: string): number {
    const computer = IntCodeComputer.fromString(code);

    const drawings = groupIntoChunks(computer.run([]).output, 3) as Instruction[];
    return drawings.filter((d) => d[2] === DrawnSymbol.Block).length;
}

async function part2(code: string): Promise<any> {
    const game: GameState = {
        map: new GenericMap(),
        score: 0,
    };

    const computer = IntCodeComputer.fromString(code);
    computer.writeAt(0, 2); // set to free play mode

    function playTick(input?: Tilt) {
        const inputs = input != null ? [input] : [];
        return groupIntoChunks(computer.run(inputs).output, 3) as Instruction[];
    }

    // Draw the first screen
    const initialInstructions = playTick();
    update(game, initialInstructions);
    console.log(draw(game));
    while (true) {
        if (computer.halted) {
            break;
        }

        await delay(1_000 / 30); // 30 fps
        console.clear();
        const nextTilt = determineTilt(game);
        update(
            game,
            playTick(nextTilt),
        );
        console.log(draw(game));
    }

    return game.score;
}

function update(state: GameState, instructions: Instruction[]): void {
    for (const [x, y, instr] of instructions) {
        if (x === -1 && y === 0) {
            state.score = instr;
        } else {
            state.map.set([x, y], instr as DrawnSymbol);
        }
    }
}

function draw(game: GameState): string {
    const coords = game.map.keyList();
    const [minX, maxX] = minmax(coords.map(fst));
    const [minY, maxY] = minmax(coords.map(snd));

    let drawing = '';

    for (let y = maxY; y >= minY; y--) {
        for (let x = minX; x <= maxX; x++) {
            drawing += representation[game.map.get([x, y]) ?? DrawnSymbol.Empty];
        }
        drawing += EOL;
    }

    drawing += `Score | ${game.score}`;

    return drawing;
}

function determineTilt(game: GameState): Tilt {
    const ballPositionX = findPosition(game, DrawnSymbol.Ball)[0];
    const paddlePositionX = findPosition(game, DrawnSymbol.HorizontalPaddle)[0];

    if (paddlePositionX < ballPositionX) {
        return Tilt.Right;
    } else if (paddlePositionX === ballPositionX) {
        return Tilt.Neutral;
    } else {
        return Tilt.Left;
    }
}

function findPosition(game: GameState, drawnSymbol: DrawnSymbol): [X, Y] {
    return game.map.keyList().find((key) => game.map.get(key) === drawnSymbol)!;
}

export default Solution.raw({
    part1,
    part2: part2 as any,
});

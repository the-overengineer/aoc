import { Vector2D } from './Linear';

export const Direction = {
    Up: 'Up',
    Right: 'Right',
    Down: 'Down',
    Left: 'Left',
} as const;
export type Direction = typeof Direction[keyof typeof Direction];

export function right(dir: Direction): Direction {
    return rightTurnMap[dir];
}

export function left(dir: Direction): Direction {
    return leftTurnMap[dir];
}

export function advance(start: Vector2D, dir: Direction, times: number = 1): Vector2D {
    return start.add(
        moveMap[dir].timesScalar(times),
    ) as Vector2D;
}

const rightTurnMap: Record<Direction, Direction> = {
    [Direction.Up]: Direction.Right,
    [Direction.Right]: Direction.Down,
    [Direction.Down]: Direction.Left,
    [Direction.Left]: Direction.Up,
};

const leftTurnMap: Record<Direction, Direction> = {
    [Direction.Up]: Direction.Left,
    [Direction.Right]: Direction.Up,
    [Direction.Down]: Direction.Right,
    [Direction.Left]: Direction.Down,
};

const moveMap: Record<Direction, Vector2D> = {
    [Direction.Up]: new Vector2D([0, 1]),
    [Direction.Right]: new Vector2D([1, 0]),
    [Direction.Down]: new Vector2D([0, -1]),
    [Direction.Left]: new Vector2D([-1, 0]),
};
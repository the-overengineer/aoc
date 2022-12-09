import { Solution } from '@core/DaySolution';
import { advance, Direction } from '@core/Direction';
import { GenericSet } from '@core/GenericSet';
import { Vector2D } from '@core/Linear';
import '@core/polyfill';
import { generateRepeat } from '@core/utilityBelt';

type Rope = [Vector2D, Vector2D];
type LongRope = Vector2D[];

type Visited = GenericSet<[number, number]>;

type Move = {
    direction: Direction;
    steps: number;
};

function part1(lines: string[]): number {
    const moves: Direction[] = unroll(lines.map(parse));
    const tailVisited: Visited = new GenericSet();
    let position: Rope = [new Vector2D([0, 0]), new Vector2D([0, 0])];

    tailVisited.add(position.peek().data);

    for (const move of moves) {
        position = getNext(position, move);
        tailVisited.add(position.peek().data);
    }

    return tailVisited.size;
}

function part2(lines: string[]): number {
    const moves: Direction[] = unroll(lines.map(parse));
    const tailVisited: Visited = new GenericSet();
    let rope: LongRope = generateRepeat(
        () => new Vector2D([0, 0]),
        10,
    );

    tailVisited.add(rope.peek().data);

    for (const move of moves) {
        rope = getNextLongRope(rope, move);
        tailVisited.add(rope.peek().data);
    }

    return tailVisited.size;
}

function parse(line: string): Move {
    const [dir, stepsStr] = line.split(' ');
    const steps = stepsStr.toInt();
    const dirs: Record<string, Direction> = {
        'U': Direction.Up,
        'R': Direction.Right,
        'D': Direction.Down,
        'L': Direction.Left,
    };

    return {
        direction: dirs[dir],
        steps,
    };
}

function unroll(moves: Move[]): Direction[] {
    const discreteMoves: Direction[] = [];

    for (const move of moves) {
        for (let i = 0; i < move.steps; i++) {
            discreteMoves.push(move.direction);
        }
    }

    return discreteMoves;
}

function getNext(position: Rope, step: Direction): Rope {
    const [head, tail] = position;
    const nextHead = advance(head, step);
    const nextTail = follow(nextHead, tail);

    return [nextHead, nextTail];
}

function getNextLongRope(rope: LongRope, step: Direction): LongRope {
    const [head, ...knots] = rope;
    const nextHead = advance(head, step);
    let previousKnot = nextHead;
    const nextRope: LongRope = [nextHead];

    for (const knot of knots) {
        const nextKnot = follow(previousKnot, knot);
        nextRope.push(nextKnot);
        previousKnot = nextKnot;
    }

    return nextRope;
}

function follow(leader: Vector2D, follower: Vector2D): Vector2D {
    if (areAdjacentOrOverlapping(leader, follower)) {
        return follower;
    }

    const moveVector = leader.subtract(follower).map(Math.sign);
    return follower.add(moveVector) as Vector2D;
}

function areAdjacentOrOverlapping(a: Vector2D, b: Vector2D): boolean {
    return a.subtract(b).data.map((val) => Math.abs(val)).every((diff) => diff <= 1);
}

export default Solution.lines({
    part1,
    part2,
});

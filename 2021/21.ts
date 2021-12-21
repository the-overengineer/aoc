import '@core/polyfill';
import { Solution } from '@core/DaySolution';

interface Player {
    position: number;
    score: number;
}

export function * getDeterministicDie() {
    for (let i = 1;;i++) {
        if (i > 100) {
            i = 1;
        }
        yield i;
    }

    return 0;
}

export function move(from: number, by: number): number {
    if (by === 0) {
        return from;
    }

    return move(from === 10 ? 1 : from + 1, by - 1);
}

function playTurn(
    board: [Player, Player],
    player: 0 | 1,
    die: Generator<number, number, unknown>,
): [Player, Player] {
    const rolls = die.next().value + die.next().value + die.next().value;

    return board.map((b, i) => {
        if (i !== player) {
            return b;
        }

        const position = move(b.position, rolls);
        const score = b.score + position;
        return {
            position,
            score,
        };
    }) as [Player, Player];
}

function parse(lines: string[]): [Player, Player] {
    return lines.map((line) => {
        const position = line.split(': ')[1].toInt();

        return {
            position,
            score: 0,
        };
    }) as [Player, Player];
}

function apply(board: [Player, Player], idx: 0 | 1, fn: (p: Player) => Player): [Player, Player] {
    return board.map((p, i) => i === idx ? fn(p) : p) as [Player, Player];
}

function part1(lines: string[]) {
    let board = parse(lines);
    let player: 0 | 1 = 0;
    let rollsCount = 0;
    const die = getDeterministicDie();

    while (true) {
        board = playTurn(board, player, die);
        player = 1 - player as 0 | 1;
        rollsCount += 3;

        if (board.some((p) => p.score >= 1_000)) {
            return board.find((p) => p.score < 1000)!.score * rollsCount;
        }
    }
}

function getDiracRolls(): Record<number, number> {
    const rolled: Record<number, number> = {};

    for (const fst of [1, 2, 3]) {
        for (const snd of [1, 2, 3]) {
            for (const trd of [1, 2, 3]) {
                const val = fst + snd + trd;

                if (rolled[val] == null) {
                    rolled[val] = 1;
                } else {
                    rolled[val] += 1;
                }
            }
        }
    }

    return rolled;
}

const diracRolls = getDiracRolls();

function playDiracsDice(
    board: [Player, Player],
    player: 0 | 1,
): [number, number] {
    const wins: [number, number] = [0, 0];

    for (const [roll, times] of Object.entries(diracRolls)) {
        const updatedBoard = apply(board, player, (p) => {
            const position = move(p.position, roll.toInt());
            const score = p.score + position;
            return {
                position,
                score,
            };
        });

        if (updatedBoard[player].score >= 21) {
            wins[player] += times;
        } else {
            const deepWins = playDiracsDice(updatedBoard, 1 - player as 0 | 1);
            wins[0] += times * deepWins[0];
            wins[1] += times * deepWins[1];
        }
    }

    return wins;
}

function part2(lines: string[]) {
    const board = parse(lines);
    const result = playDiracsDice(board, 0);
    return Math.max(...result);
}

export default Solution.lines({
    part1,
    part2,
});
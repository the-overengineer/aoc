import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { sum } from '@core/utilityBelt';

const Move = {
    Rock: 'Rock',
    Paper: 'Paper',
    Scissors: 'Scissors',
} as const;
type Move = typeof Move[keyof typeof Move];
const Resolution = {
    Win: 'Win',
    Lose: 'Lose',
    Draw: 'Draw',
} as const;
type Resolution = typeof Resolution[keyof typeof Resolution];
type Round = [Move, Move];
type RoundGuide = [Move, Resolution];

const moveScores: Record<Move, number> = {
    [Move.Rock]: 1,
    [Move.Paper]: 2,
    [Move.Scissors]: 3,
};

const winsOver: Record<Move, Move> = {
    [Move.Rock]: Move.Scissors,
    [Move.Paper]: Move.Rock,
    [Move.Scissors]: Move.Paper,
};

const opponentMoveLookup: Record<string, Move> = {
    'A': Move.Rock,
    'B': Move.Paper,
    'C': Move.Scissors,
};

const myMoveLookup: Record<string, Move> = {
    'X': Move.Rock,
    'Y': Move.Paper,
    'Z': Move.Scissors,
};

const resolutionLookup: Record<string, Resolution> = {
    'X': Resolution.Lose,
    'Y': Resolution.Draw,
    'Z': Resolution.Win,
};

function scoreWin(round: Round) {
    const [other, me] = round;
    if (other === me) {
        return 3;
    } else if (winsOver[me] === other) {
        return 6;
    } else if (winsOver[other] === me) {
        return 0;
    } else {
        throw new Error(`Cannot handle ${round}`);
    }
}

function scoreRound(round: Round) {
    const myMove = round[1];
    return scoreWin(round) + moveScores[myMove]; 
}

function parseRow(row: string): Round {
    const [opponent, me] = row.split(' ');
    return [
        opponentMoveLookup[opponent],
        myMoveLookup[me],
    ];
}

function parseWithResolution(row: string): RoundGuide {
    const [opponent, me] = row.split(' ');
    return [
        opponentMoveLookup[opponent],
        resolutionLookup[me],
    ];
}

function resolutionToRound(guide: RoundGuide): Round {
    const [opponent, resolution] = guide;
    const myMove = (() => {
        if (resolution === Resolution.Draw) {
            return opponent;
        } else if (resolution === Resolution.Lose) {
            return winsOver[opponent];
        } else {
            return Object.keys(winsOver).find((winCondition) => {
                return winsOver[winCondition as Move] === opponent;
            })
        }
    })() as Move;

    return [opponent, myMove];
}

function part1(lines: string[]) {
    const moves = lines.map(parseRow);
    const scores = moves.map(scoreRound);
    return sum(scores);
}

function part2(lines: string[]) {
    const moves = lines.map(parseWithResolution);
    const scores = moves.map(resolutionToRound).map(scoreRound);
    return sum(scores);
}

export default Solution.lines({
    part1,
    part2,
});

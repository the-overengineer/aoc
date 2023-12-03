import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { sum } from '@core/utilityBelt';

type Game = {
    id: number;
    draws: Draw[];
}

type GameWithPower = Game & {
    power: number;
};

type Draw = {
    blue: number;
    green: number;
    red: number;
};

function part1(lines: string[]) {
    const games = lines.map((line) => parseGame(line));
    const possibleGames = games.filter(isGamePossible);
    return sum(possibleGames.map((game) => game.id));
}

function part2(lines: string[]) {
    const games = lines.map((line) => parseGame(line));
    const gamesWithPower = games.map(getGamePower);
    return sum(gamesWithPower.map((game) => game.power));
}

function parseGame(line: string): Game {
    const [gameWithId, drawList] = line.split(': ');
    const id = parseInt(gameWithId.split(' ')[1], 10);
    const draws: Draw[] = drawList.split('; ').map((drawStr: string): Draw => {
        const draw: Draw = {
            green: 0,
            red: 0,
            blue: 0,
        };

        drawStr.split(', ').forEach((colorStr) => {
            const [number, color] = colorStr.split(' ');
            draw[color as keyof Draw] = parseInt(number, 10);
        });

        return draw;
    });

    return {
        id,
        draws,
    };
}

function isGamePossible(game: Game): boolean {
    return game.draws.every((draw) => {
        return draw.red <= 12 && draw.green <= 13 && draw.blue <= 14;
    });
}

function requiredBallsPerGame(game: Game): Draw {
    return game.draws.reduce((current, draw) => {
        return {
            red: Math.max(current.red, draw.red),
            green: Math.max(current.green, draw.green),
            blue: Math.max(current.blue, draw.blue),
        };
    }, {
        red: 0,
        green: 0,
        blue: 0,
    });
}

function getGamePower(game: Game): GameWithPower {
    const requiredBalls = requiredBallsPerGame(game);
    const power = requiredBalls.red * requiredBalls.green * requiredBalls.blue;
    return {
        ...game,
        power,
    };
}

export default Solution.lines({
    part1,
    part2,
});
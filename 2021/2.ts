import { Solution } from '@core/DaySolution';

interface Position {
  distance: number;
  depth: number;
}

interface AimPosition extends Position {
  aim: number;
}

type MoveType = 'up' | 'down' | 'forward';

interface Move {
  moveType: MoveType;
  distance: number;
}

function parseMove(line: string): Move {
  const [tpe, distStr] = line.split(' ');
  return {
    moveType: tpe as MoveType,
    distance: parseInt(distStr, 10),
  };
}

function getMoves(lines: string[]) {
  return lines.map((line) => parseMove(line));
}

function part1(lines: string[]) {
  const moves = getMoves(lines);
  const position: Position = {
    distance: 0,
    depth: 0,
  };

  for (const move of moves) {
    switch (move.moveType) {
      case 'forward':
        position.distance += move.distance;
        break;
      case 'down':
        position.depth += move.distance;
        break;
      case 'up':
        position.depth -= move.distance;
        break;
    }
  }

  return position.depth * position.distance;
}

function part2(lines: string[]) {
  const moves = getMoves(lines);
  const position: AimPosition = {
    distance: 0,
    depth: 0,
    aim: 0,
  };

  for (const move of moves) {
    switch (move.moveType) {
      case 'forward':
        position.distance += move.distance;
        position.depth += move.distance * position.aim;
        break;
      case 'down':
        position.aim += move.distance;
        break;
      case 'up':
        position.aim -= move.distance;
        break;
    }
  }

  return position.depth * position.distance;
}

export default Solution.lines({
  part1,
  part2,
});

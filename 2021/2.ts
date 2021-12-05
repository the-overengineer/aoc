import { readLines } from "./utilityBelt";


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

async function getMoves() {
  const lines = await readLines('./2.txt');
  return lines.map((line) => parseMove(line));
}

async function part1() {
  const moves = await getMoves();
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

async function part2() {
  const moves = await getMoves();
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

part2().then(console.log);

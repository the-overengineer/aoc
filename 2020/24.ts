import { ArraySet } from '@core/ArraySet';
import { count, flatten, readLines } from '@core/utilityBelt';


type ITile = [number, number];

function strToMove(str: string): ITile {
  switch (str) {
    case 'e': return [2, 0];
    case 'w': return [-2, 0];
    case 'nw': return [-1, 1];
    case 'ne': return [1, 1];
    case 'sw': return [-1, -1];
    case 'se': return [1, -1];
    default: throw new Error(`Unexpected input ${str}`);
  }
}

function navigate(moves: ITile[], from: ITile = [0, 0]): ITile {
  return moves.reduce((tile, move) => [tile[0] + move[0], tile[1] + move[1]], from);
}

function hexNeighbours(tile: ITile): ITile[] {
  return ['e', 'w', 'ne', 'nw', 'se', 'sw'].map((dir) => navigate([strToMove(dir)], tile));
}

async function readTiles(): Promise<ITile[]> {
  const lines = await readLines('./24.txt');
  const tiles: ITile[] = [];

  for (const line of lines) {
    let buf: string = '';
    const moves: ITile[] = [];

    const chars = line.split('');

    for (const char of chars) {
      if (char === 'n' || char === 's') {
        if (buf.length) {
          moves.push(strToMove(buf));
        }
        buf = char;
      } else {
        if (buf.endsWith('e') || buf.endsWith('w')) {
          moves.push(strToMove(buf));
          buf = char;
        } else {
          buf += char;
        }
      }
    }

    if (buf.length) {
      moves.push(strToMove(buf));
    }

    tiles.push(navigate(moves));
  }

  return tiles;
}

async function getInitialTiles() {
  const tiles = await readTiles();
  const flipped = new ArraySet<ITile>();

  for (const tile of tiles) {
    if (flipped.has(tile)) {
      flipped.delete(tile);
    } else {
      flipped.add(tile);
    }
  }

  return flipped;
}

async function main1() {
  const flipped = await getInitialTiles();

  console.log(flipped.size);
}

async function main2() {
  let tiles = await getInitialTiles();

  for (let i = 0; i < 100; i++) {
    const next = new ArraySet<ITile>()
    const candidates = flatten(tiles.toList().map((t) => [t, ...hexNeighbours(t)]));

    for (const candidate of candidates) {
      const isBlack = tiles.has(candidate);
      const blackNeighbours = count(hexNeighbours(candidate), (t) => tiles.has(t));

      if (isBlack) {
        if (blackNeighbours > 0 && blackNeighbours <= 2) {
          next.add(candidate);
        }
      } else if (blackNeighbours === 2) {
        next.add(candidate);
      }
    }
    tiles = next;
  }

  console.log(tiles.size);
}

main2();

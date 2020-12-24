import { count, flatten, read } from './utilityBelt';

export class Grid {
  public static parse(text: string) {
    return new Grid(text.split('\n').map((row) => row.split('')));
  }

  public constructor(
    public readonly cells: string[][],
  ) {}

  public get height(): number {
    return this.cells.length;
  }

  public get width(): number {
    return this.cells[0].length;
  }

  public at(y: number, x: number) {
    return this.cells[y][x];
  }

  public nextState(strict: boolean = true, threshold: number = 4): Grid {
    const nextCells: string[][] = [];

    for (let y = 0; y < this.height; y++) {
      nextCells.push([]);

      for (let x = 0; x < this.width; x++) {
        if (this.isFloor(y, x)) {
          nextCells[y].push('.');
        } else if (this.isFree(y, x)) {
          const seats = strict ? this.neighbours(y, x) : this.visibleSeats(y, x);
          if (seats.every(([ny, nx]) => !this.isTaken(ny, nx))) {
            nextCells[y].push('#');
          } else {
            nextCells[y].push('L');
          }
        } else {
          const seats = strict ? this.neighbours(y, x) : this.visibleSeats(y, x);
          const occupiedNeighbours = seats.filter(([ny, nx]) => this.isTaken(ny, nx));
          nextCells[y].push(occupiedNeighbours.length >= threshold ? 'L' : '#');
        }
      }
    }

    return new Grid(nextCells);
  }

  public toString(): string {
    return this.cells.map((row) => row.join('')).join('\n');
  }

  public equals(grid: Grid): boolean {
    return this.toString() === grid.toString();
  }

  private isFloor(y: number, x: number) {
    return this.at(y, x) === '.';
  }

  private isFree(y: number, x: number) {
    return this.at(y, x) === 'L';
  }

  private isTaken(y: number, x: number) {
    return this.at(y, x) === '#';
  }

  private neighbours(y: number, x: number): [number, number][] {
    const diffs = [-1, 0, 1];
    const indices: [number, number][] = [];

    for (const yDiff of diffs) {
      const newY = y + yDiff;
      if (newY < 0 || newY >= this.height) {
        continue;
      }

      for (const xDiff of diffs) {
        const newX = x + xDiff;
        if (newX < 0 || newX >= this.width || (xDiff === 0 && yDiff === 0)) {
          continue;
        }

        indices.push([newY, newX]);
      }
    }

    return indices;
  }


  private visibleSeats(y: number, x: number): [number, number][] {
    const moves = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    const foundSeatIndices: [number, number][] = [];

    for (const [dY, dX] of moves) {
      for (let ny = y + dY, nx = x + dX; ny >= 0 && ny < this.height && nx >= 0 && nx < this.width; ny += dY, nx += dX) {
        if (!this.isFloor(ny, nx)) {
          foundSeatIndices.push([ny, nx]);
          break;
        }
      }
    }

    return foundSeatIndices;
  }
}

async function main1() {
  const text = await read('./11.txt');
  let previousGrid = Grid.parse(text);

  while(true) {
    const nextGrid = previousGrid.nextState();
    if (nextGrid.equals(previousGrid)) {
      break;
    }

    previousGrid = nextGrid;
  }

  const takenSeats = count(flatten(previousGrid.cells), (it) => it === '#');
  console.log(takenSeats);
}

async function main2() {
  const text = await read('./11.txt');
  let previousGrid = Grid.parse(text);

  while(true) {
    const nextGrid = previousGrid.nextState(false, 5);
    if (nextGrid.equals(previousGrid)) {
      break;
    }

    previousGrid = nextGrid;
  }

  const takenSeats = count(flatten(previousGrid.cells), (it) => it === '#');
  console.log(takenSeats);
}

main2();
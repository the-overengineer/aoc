import { read } from '@core/utilityBelt';

enum Cell {
  Tree,
  Open,
}

class Row {
  private cells: Cell[];

  public constructor(row: string) {
    this.cells = row.split("").map((c) => c === '#' ? Cell.Tree : Cell.Open);
  }

  public at(index: number): Cell {
    return this.cells[index % this.cells.length];
  }
}

class Grid {
  private rows: Row[];

  constructor(drawing: string) {
    this.rows = drawing.split('\n').map((r) => new Row(r))
  }

  public get height(): number {
    return this.rows.length;
  }

  public at(row: number, column: number): Cell {
    return this.rows[row].at(column);
  }
}

function getPoints(xDelta: number, yDelta: number, yMax: number) {
  const points: [number, number][] = []

  for (let x = 0, y = 0; y < yMax; x = x + xDelta, y = y + yDelta) {
    points.push([x, y])
  }

  return points
}

function countTrees(cells: Cell[]): number {
  return cells.reduce((count, cell) => cell === Cell.Tree ? count + 1 : count, 0)
}

async function main1() {
  const map = await read('./3.txt');
  const grid = new Grid(map)

  const count = countTrees(
    getPoints(3, 1, grid.height).map(([x, y]) => grid.at(y, x))
  )

  console.log(count)
}

async function main2() {
  const map = await read('./3.txt');
  const grid = new Grid(map)

  const moves = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ]

  const fullProduct = moves.reduce((product, [x, y]) => {
    return product * countTrees(getPoints(x, y, grid.height).map(([x, y]) => grid.at(y, x)))
  }, 1)

  console.log(fullProduct)
}

main2()
import { read, max } from '@core/utilityBelt';

type Pair = [number, number]

const lowerRange = ([from, to]: Pair): Pair => {
  const newTo = Math.max(from, Math.floor(from + (to - from) / 2))
  return [from, newTo]
}

const upperRange = ([from, to]: Pair): Pair => {
  const newFrom = Math.min(to, Math.ceil(from + (to - from) / 2))
  return [newFrom, to]
}

class SeatLocation {
  private cols: Pair = [0, 7];
  private rows: Pair = [0, 127];

  public constructor(path: string) {
    const letters = path.split('');
    for (const letter of letters) {
      if (letter === 'R') {
        this.cols = upperRange(this.cols)
      } else if (letter === 'L') {
        this.cols = lowerRange(this.cols)
      } else if (letter === 'F') {
        this.rows = lowerRange(this.rows)
      } else if (letter === 'B') {
        this.rows = upperRange(this.rows)
      }
    }
  }

  public get row(): number {
    const [from, to] = this.rows;
    if (from !== to) {
      throw new Error('Did not navigate to seat');
    }

    return from;
  }

  public get col(): number {
    const [from, to] = this.cols;
    if (from !== to) {
      throw new Error('Did not navigate to seat');
    }

    return from;
  }

  public get id(): number {
    return this.row * 8 + this.col
  }

  public static parse(path: string) {
    return new SeatLocation(path)
  }
}

async function main1() {
  const seatIDs = (await read('./5.txt')).split('\n').map(SeatLocation.parse).map((s) => s.id);
  const maxID = max(seatIDs);
  console.log(maxID);
}

async function main2() {
  const seatIDs = (await read('./5.txt')).split('\n').map(SeatLocation.parse).map((s) => s.id);
  const sortedSeatIDs = seatIDs.sort((a, b) => a - b);
  const idBeforeMine = sortedSeatIDs.find((seatID, index) => sortedSeatIDs[index + 1] === seatID + 2)!;
  const myID = idBeforeMine + 1;
  console.log(myID);
}

main2()
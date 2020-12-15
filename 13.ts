import './hackery';
import { product as productFn, read } from './utilityBelt';

interface Timetable {
  leaveTime: number;
  ids: number[];
}

const getWaitTime = (timestamp: number, id: number): number => {
  const nextIndex = Math.ceil(timestamp / id);
  return nextIndex * id - timestamp;
}

async function readTimetable(): Promise<Timetable> {
  const text = await read('./13.txt');
  const [leaveTimeStr, allIds] = text.split('\n');

  return {
    leaveTime: parseInt(leaveTimeStr, 10),
    ids: allIds.split(',').filter((it) => it !== 'x').map((it) => parseInt(it, 10)),
  };
}

async function main1() {
  const { leaveTime, ids } = await readTimetable();
  const earliestId = ids.reduce((earliestFoundId, id) => {
    const nextArrival = getWaitTime(leaveTime, id);
    const earliestArrival = getWaitTime(leaveTime, earliestFoundId);
    if (nextArrival - leaveTime < earliestArrival - leaveTime) {
      return id;
    }

    return earliestFoundId;
  }, ids[0]);

  const waitTime = getWaitTime(leaveTime, earliestId);

  console.log(earliestId, waitTime, earliestId * waitTime);
}

interface TimetablePosition {
  id: number;
  offset: number;
}

const modularInverse = (a: number, b: number): number => {
  const b0 = b;
  let x0 = 0;
  let x1 = 1;
  if (b === 1) {
    return 1;
  }

  while (a > 1) {
    const q = a / b;
    const rem = a % b;
    a = b;
    b = rem;
    const newX0 = x1 - q * x0
    x1 = x0
    x0 = newX0
  }

  if (x1 < 0) {
    x1 += b0
  }

  return x1
}

const chineseRemainder = (timetables: TimetablePosition[]): number => {
  let sum = 0;
  const product = productFn(timetables.map((bus) => bus.id));
  for (const bus of timetables) {
    const p = Math.floor(product / bus.id);
    sum += bus.offset * p * modularInverse(p, bus.id);
  }

  return sum % product;
}

async function main2() {
  const timetable: TimetablePosition[] = await read('./13.txt').then((text) => {
    const [,idsRow] = text.split('\n');
    return idsRow.split(',')
      .map((id, idx): [string, number] => [id, idx])
      .filter(([id]) => id !== 'x')
      .map(([id, idx]): TimetablePosition => ({
        id: id.toInt(),
        offset: (id.toInt() * 10 - idx) % id.toInt(),
      }));
  });

  console.log(timetable);

  const result = chineseRemainder(timetable);
  console.log(result);
}

main2();

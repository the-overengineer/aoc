import { gcd, max, read } from './utilityBelt';

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

async function main2() {
  const timetable: TimetablePosition[] = await read('./13.txt').then((text) => {
    const [,idsRow] = text.split('\n');
    return idsRow.split(',')
      .map((id, idx): [string, number] => [id, idx])
      .filter(([id]) => id !== 'x')
      .map(([id, idx]): TimetablePosition => ({
        id: parseInt(id, 10),
        offset: idx,
      }));
  });

  const largestId = max(timetable.map((bus) => bus.id))!;
  const largestOffset = timetable.find((bus) => bus.id === largestId)!.offset;
  console.log(largestId, largestOffset);

  for (let timestamp = largestOffset, i = 1 ;; timestamp += largestId, i++) {
    if (i < 10) {
      console.log(timestamp);
    }
    const matches = timetable.every((bus) => getWaitTime(timestamp, bus.id) === bus.offset);
    if (matches) {
      console.log(timestamp);
      break;
    }
  }
}

main2();

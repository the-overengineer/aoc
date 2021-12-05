import { readLines } from './utilityBelt';

async function part1() {
  const numbers = await readLines('./1.txt').then((xs) => xs.map((i) => parseInt(i, 10)));
  return numbers.reduce((cnt, n, i, ns) => i > 0 && n > ns[i - 1] ? cnt + 1 : cnt, 0);
}

function collectSummedSlidingWindow(xs: number[], size: number): number[] {
  const sums: number[] = [];

  for (let i = 0; i < xs.length; i++) {
    let sum = 0;
    for (let j = 0; j < size; j++) {
      sum += xs[i + j];
    }

    sums.push(sum);
  }

  return sums;
}

async function part2() {
  const numbers = await readLines('./1.txt').then((xs) => xs.map((i) => parseInt(i, 10)));
  const windows = collectSummedSlidingWindow(numbers, 3);
  return windows.reduce((cnt, n, i, ns) => i > 0 && n > ns[i - 1] ? cnt + 1 : cnt, 0);
}

part2().then(console.log);

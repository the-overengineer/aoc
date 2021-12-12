import { Solution } from '@core/DaySolution';

function part1(lines: string[]) {
  const numbers = lines.map((i) => parseInt(i, 10));
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

function part2(lines: string[]) {
  const numbers = lines.map((i) => parseInt(i, 10));
  const windows = collectSummedSlidingWindow(numbers, 3);
  return windows.reduce((cnt, n, i, ns) => i > 0 && n > ns[i - 1] ? cnt + 1 : cnt, 0);
}

export default Solution.lines({
  part1,
  part2,
});

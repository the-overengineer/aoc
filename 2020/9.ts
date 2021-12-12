import { read, max, min, sum } from '@core/utilityBelt';

function isValid(n: number, prev: number[]): boolean {
  for (let i = 0; i < prev.length; i++) {
    for (let j = i + 1; j < prev.length; j++) {
      if (prev[i] + prev[j] === n) {
        return true;
      }
    }
  }

  return false;
}

async function main1() {
  const numbers = (await read('./9.txt')).split('\n').map((it) => parseInt(it, 10));

  for (let i = 25, p = 0; i < numbers.length; i++, p++) {
    const prevNums = numbers.slice(p, p + 25);
    const num = numbers[i];
    if (!isValid(num, prevNums)) {
      console.log(num);
      break;
    }
  }
}

const WEAKNESS_NUM = 22477624;

async function main2() {
  const numbers = (await read('./9.txt')).split('\n').map((it) => parseInt(it, 10));

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const range = numbers.slice(i, j + 1);
      const summed = sum(range);
      if (summed === WEAKNESS_NUM) {
        console.log(range, summed, min(range)! + max(range)!);
      } else if (summed > WEAKNESS_NUM) {
        break;
      }
    }
  }
}

main2();

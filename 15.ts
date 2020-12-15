function getNextNumber(newNum: number, index: number, lookup: Map<number, number>): number {
  const result = lookup.has(newNum) ? index - lookup.get(newNum)! : 0;
  lookup.set(newNum, index);
  return result;
}

function * getNumbers(initial: number[]) {
  const lookup = new Map<number, number>();

  initial.slice(0, initial.length - 1).forEach((num, i) => {
    lookup.set(num, i);
  });

  let index = initial.length - 1;
  let newNum = initial[index];

  while (true) {
    newNum = getNextNumber(newNum, index++, lookup);
    yield newNum;
  }
}

function main1() {
  const initial = [2,0,1,7,4,14,18];
  const numberGame = getNumbers(initial);
  let index = initial.length + 1;

  for (const num of numberGame) {
    if (index++ === 2020) {
      console.log(num)
      break;
    }
  }
}

function main2() {
  const initial = [2,0,1,7,4,14,18];
  const numberGame = getNumbers(initial);
  let index = initial.length + 1;

  for (const num of numberGame) {
    if (index++ === 30_000_000) {
      console.log(num)
      break;
    }
  }
}

main2();

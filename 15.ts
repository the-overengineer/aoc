function getNextNumber(nums: number[], seen: Set<number>): number {
  const newNum = nums[nums.length - 1];
  const start = nums.length - 1;
  const end = 0;

  if (!seen.has(newNum)) {
    return 0;
  }

  let i = 1;
  while (start - i >= end) {
    if (nums[start - i] === newNum) {
      return i;
    }

    i++;
  }

  throw new Error(`Something went wrong with number ${newNum}`);
}

function * getNumbers(initial: number[]) {
  const seen = new Set(initial.slice(0, initial.length - 1));
  const numbers = [...initial];

  while (true) {
    const next = getNextNumber(numbers, seen);
    seen.add(numbers[numbers.length - 1]);
    numbers.push(next);
    yield next;
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

main1();

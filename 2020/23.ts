import '@core/polyfill';
import { range } from '@core/utilityBelt';

const input = '784235916'.split('').map(_ => _.toInt());

type Current = number;
type Next = number;
interface Cup {
  value: number;
  next: Next;
}
type Cups = Map<Current, Cup>;

function getCups(xs: number[]): Cups {
  const cups: Cups = new Map();

  xs.forEach((num, index) => {
    const value = num;
    const next = xs[(index + 1) % xs.length];
    cups.set(value, { value, next });
  });

  return cups;
}

function runRoundMap(currentValue: Current, cups: Cups): Next {
  const current = cups.get(currentValue)!
  const first = cups.get(current.next)!;
  const second = cups.get(first.next)!;
  const third = cups.get(second.next)!;

  const moved = [first.value, second.value, third.value];

  const destinationValue = ((): number => {
    let label = currentValue - 1;
    while (true) {
      if (moved.includes(label)) label--;
      else if (label <= 0) label = cups.size;
      else return label;
    }
  })();

  const destination = cups.get(destinationValue)!;
  const afterDestination = destination.next;
  current.next = third.next;
  destination.next = first.value;
  third.next = afterDestination;

  return current.next;
}

function stringify(cups: Cups, startingValue: number) {
  let output = String(startingValue);
  let ptr = cups.get(cups.get(1)!.next)!;
  while(ptr.value !== startingValue) {
    output += ptr.value;
    ptr = cups.get(ptr.next)!;
  }
  return output;
}

function main1() {
  const cups = getCups(input);
  let current = input[0];
  for (let i = 0; i < 100; i++) {
    current = runRoundMap(current, cups);
  }
  console.log(stringify(cups, 1).slice(1));
}

function main2() {
  const cups = getCups(input.concat(range(Math.max(...input) + 1, 1_000_001)));
  let current = input[0];
  for (let i = 0; i < 10_000_000; i++) {
    current = runRoundMap(current, cups);
  }

  const first = cups.get(cups.get(1)!.next)!;
  const second = cups.get(first.next)!;
  console.log(first.value, second.value, first.value * second.value);
}

// 53248976
// main1();

main2();

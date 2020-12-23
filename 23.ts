import './polyfill';
import { range } from "./utilityBelt";

const input = '784235916'.split('').map(_ => _.toInt());

function runRound(xs: number[]): number[] {
  const target = [...xs];
  const moved = target.splice(1, 3);
  const current = target.shift()!;
  const destinationCup = ((): number => {
    let label = current - 1;
    while (true) {
      if (moved.includes(label)) label--;
      else if (label <= 0) label = Math.max(...target);
      else return label;
    }
  })();
  const insertionIndex = target.indexOf(destinationCup) + 1;
  target.splice(insertionIndex, 0, ...moved);
  target.push(current);
  return target;
}

function main1() {
  let cups = input;
  for (let i = 0; i < 100; i++) {
    cups = runRound(cups);
  }
  console.log(cups.join(''));
}

function main2() {
  let cups = input.concat(range(Math.max(...input) + 1, 1_000_001));
  for (let i = 0; i < 10_000_000; i++) {
    cups = runRound(cups);
  }
  const indexOfOne = cups.indexOf(1);
  const [next, other] = [cups[indexOfOne + 1 % cups.length], cups[indexOfOne + 2 % cups.length]]
  console.log(next, other, next * other);
}

main2();

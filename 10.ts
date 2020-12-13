import { count, max, readLines, zip } from './utilityBelt';

async function readInput(): Promise<number[]> {
  const lines = await readLines('./10.txt');
  return lines.map((l) => parseInt(l, 10)).sort((a, b) => a - b);
}

const collectValid = (
  chargers: number[],
  device: number,
  ground: number = 0,
  valid: Set<string> = new Set(),
  invalid: Set<string> = new Set(),
): [Set<string>, Set<string>] => {
  const key = chargers.join(', ');
  if (valid.has(key) || invalid.has(key)) {
    return [valid, invalid];
  }

  valid.add(key);

  for (let i = 0; i < chargers.length; i++) {
    const otherChargers = [...chargers.slice(0, i), ...chargers.slice(i + 1)];

    const variantKey = otherChargers.join(', ');
    const previous = i === 0 ? ground : chargers[i - 1];
    const next = i === chargers.length - 1 ? device : chargers[i + 1];
    const canDrop = next - previous <= 3;

    if (valid.has(variantKey) || invalid.has(variantKey)) {
      continue;
    }

    if (!canDrop) {
      invalid.add(variantKey);
      continue;
    }

    collectValid(otherChargers, device, ground, valid, invalid);
  }

  return [valid, invalid];
}

function countValid(chargers: number[]): BigInt {
  const counts: Map<number, bigint> = new Map();

  counts.set(chargers.length - 1, BigInt(1));


  for (let i = chargers.length - 2; i >= 0; i--) {
    let currCount = BigInt(0);

    for (let j = i + 1; j < chargers.length && j - i <= 3 && chargers[j] - chargers[i] <= 3; j++) {
      currCount += counts.get(j)!;
    }

    counts.set(i, currCount);
  }

  return counts.get(0)!;
}

async function main1() {
  const chargers = await readInput();
  const ground = 0;
  const device = max(chargers)! + 3;
  const jumps = zip(
    [ground, ...chargers],
    [...chargers, device],
  );
  const diffs = jumps.map(([from, to]) => to - from);
  const countThrees = count(diffs, (d) => d === 3);
  const countOnes = count(diffs, (d) => d === 1);
  console.log(countThrees, countOnes, countThrees * countOnes);
}

async function main2() {
  const chargers = await readInput();
  const device = max(chargers)! + 3;
  const cnt = countValid([0, ...chargers]);
  console.log(cnt);
}

main2();
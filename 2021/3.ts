import { Solution } from '@core/DaySolution';
import {
  BinaryString,
  binaryStringToNumber,
} from '@core/utilityBelt';

function getMostCommonBit(bitStrings: BinaryString[], atIndex: number, prefer: '0' | '1' = '1'): '0' | '1' {
  const rowCount = bitStrings.length;
  let oneCount = 0;
  for (let row = 0; row < rowCount; row++) {
    if (bitStrings[row][atIndex] === '1') {
      oneCount++;
    }
  }

  const zeroCount = rowCount - oneCount;

  if (oneCount === rowCount) {
    return '1';
  } else if (zeroCount === rowCount) {
    return '0';
  } else {
    return oneCount >= rowCount / 2 ? '1' : '0';
  }
}

function getLeastCommonBit(bitStrings: BinaryString[], atIndex: number, prefer: '0' | '1' = '0'): '0' | '1' {
  const rowCount = bitStrings.length;
  let oneCount = 0;
  for (let row = 0; row < rowCount; row++) {
    if (bitStrings[row][atIndex] === '1') {
      oneCount++;
    }
  }

  const zeroCount = rowCount - oneCount;

  if (oneCount === rowCount) {
    return '1';
  } else if (zeroCount === rowCount) {
    return '0';
  } else {
    return zeroCount <= rowCount / 2 ? '0' : '1';
  }
}

function findByCriterion(
  bitStrings: BinaryString[],
  filterByCriterion: (bss: BinaryString[], idx: number) => BinaryString[],
  atIndex: number = 0,
): BinaryString | undefined {
  if (bitStrings.length === 0) {
    return;
  }

  if (bitStrings.length === 1) {
    return bitStrings[0];
  }


  const nextBitStrings = filterByCriterion(bitStrings, atIndex);

  return findByCriterion(nextBitStrings, filterByCriterion, atIndex + 1);
}

function filterMatchingMostCommonBit(bitStrings: BinaryString[], atIndex: number): BinaryString[] {
  const mostCommon = getMostCommonBit(bitStrings, atIndex, '1');
  return bitStrings.filter((bs) => bs[atIndex] === mostCommon);
}

function filterMatchingLeastCommonBit(bitStrings: BinaryString[], atIndex: number): BinaryString[] {
  const leastCommon = getLeastCommonBit(bitStrings, atIndex, '0');
  return bitStrings.filter((bs) => bs[atIndex] === leastCommon);
}

function part1(lines: string[]) {
  const binaryStrings: BinaryString[] = lines as BinaryString[];
  let mostCommonBitstring: string = '';
  let leastCommonBitstring: string = '';
  const bsLen = binaryStrings[0].length;

  for (let index = 0; index < bsLen; index++) {
    const mostCommonBit = getMostCommonBit(binaryStrings, index);


    if (mostCommonBit === '1') {
      mostCommonBitstring += '1';
      leastCommonBitstring += '0';
    } else {
      mostCommonBitstring += '0';
      leastCommonBitstring += '1';
    }
  }

  const gammaRate = binaryStringToNumber(mostCommonBitstring);
  const epsiolonRate = binaryStringToNumber(leastCommonBitstring);

  return gammaRate * epsiolonRate;
}

function part2(lines: string[]) {
  const binaryStrings: BinaryString[] = lines as BinaryString[];
  const oxygenGeneratorRatingStr = findByCriterion(
    binaryStrings,
    filterMatchingMostCommonBit,
  );
  const co2ScrubberRatingStr = findByCriterion(
    binaryStrings,
    filterMatchingLeastCommonBit,
  );

  if (oxygenGeneratorRatingStr == null || co2ScrubberRatingStr == null) {
    throw new Error(`Failed to find values O2(${oxygenGeneratorRatingStr}), CO2(${co2ScrubberRatingStr})`);
  }

  return binaryStringToNumber(oxygenGeneratorRatingStr) * binaryStringToNumber(co2ScrubberRatingStr);
}

export default Solution.lines({
  part1,
  part2,
})

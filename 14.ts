import './hackery';
import { flatten, leftPad, readLines, sum } from './utilityBelt';

const MASK_SET = /^mask = ([01X]+)$/;
const ASSIGN = /^mem\[(\d+)\] = (\d+)$/
type Address = string;

class BitString {
  public constructor(
    private readonly bits: string,
  ) {}

  public mask(bitmask: string) {
    if (bitmask.length !== this.bits.length) {
      throw new Error(`Invalid bitmask with length ${bitmask.length} (expected ${this.bits.length})`);
    }

    const newBits: string[] = [];

    for (let i = 0; i < bitmask.length; i++) {
      if (bitmask.charAt(i) === '1') {
        newBits.push('1');
      } else if (bitmask.charAt(i) === '0') {
        newBits.push('0');
      } else {
        newBits.push(this.bits.charAt(i));
      }
    }

    return new BitString(newBits.join(''));
  }

  public toInt(): number {
    return parseInt(leftPad(this.bits, 36, '0'), 2);
  }

  public toString(): string {
    return this.bits;
  }

  public static fromInt(int: number): BitString {
    const binaryStr = int.toString(2).split('').reverse().slice(0, 36).reverse().join('');
    return new BitString(leftPad(binaryStr, 36, '0'));
  }
}

function maskToV1(v2Mask: string, collected: string[] = []): string[] {
  if (v2Mask.length === 0) {
    return collected;
  }

  const resolvedBits: string[] = v2Mask.charAt(0) === '0'
    ? ['X']
    : v2Mask.charAt(0) === '1'
      ? ['1']
      : ['0', '1'];

  if (collected.length === 0) {
    return maskToV1(v2Mask.slice(1), resolvedBits);
  }

  const newCollected: string[] = flatten<string>(
    collected.map((c: string): string[] => {
      return resolvedBits.map((rb: string): string => {
        return c + rb;
      })
    }),
  );

  return maskToV1(v2Mask.slice(1), newCollected);
}


export function execute(lines: string[]): Map<Address, BitString> {
  const addresses = new Map<Address, BitString>();
  let mask: string;

  for (const line of lines) {
    if (MASK_SET.test(line)) {
      mask = MASK_SET.exec(line)![1]!;
    } else if (ASSIGN.test(line)) {
      const [, address, numStr] = ASSIGN.exec(line)!;
      const bitValue = BitString.fromInt(numStr.toInt());
      const maskedValue = bitValue.mask(mask!);
      addresses.set(address, maskedValue);
    } else {
      throw new Error(`Invalid line: ${line}`);
    }
  }

  return addresses;
}

export function executeV2(lines: string[]): Map<Address, BitString> {
  const addresses = new Map<Address, BitString>();
  let masks: string[] = [];

  for (const line of lines) {
    if (MASK_SET.test(line)) {
      masks = maskToV1(MASK_SET.exec(line)![1]!);
    } else if (ASSIGN.test(line)) {
      const [, address, numStr] = ASSIGN.exec(line)!;

      const bitAddr = BitString.fromInt(address.toInt());
      const bitValue = BitString.fromInt(numStr.toInt());

      masks.forEach((mask: string) => {
        const maskedAddr = bitAddr.mask(mask);
        addresses.set(maskedAddr.toString(), bitValue);
      });

    } else {
      throw new Error(`Invalid line: ${line}`);
    }
  }

  return addresses;
}

async function main1() {
  const lines = await readLines('./14.txt');
  const memory = execute(lines);
  console.log(memory);
  const sumOfValues = sum(Array.from(memory.values()).map((bs) => bs.toInt()));
  console.log(sumOfValues);
}

async function main2() {
  const lines = await readLines('./14.txt');
  const memory = executeV2(lines);
  console.log(memory);
  const sumOfValues = sum(Array.from(memory.values()).map((bs) => bs.toInt()));
  console.log(sumOfValues);
}

main2();

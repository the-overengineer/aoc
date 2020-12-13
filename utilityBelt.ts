import { readFile } from 'fs';
import { promisify } from 'util';

export const readBuff = promisify(readFile)
export const read = (filePath: string): Promise<string> => readBuff(filePath).then(_ => _.toString())
export const readLines = (filePath: string): Promise<string[]> => read(filePath).then((s) => s.split('\n'))

export function count<T>(items: T[], condition: (x: T) => boolean): number {
  return items.reduce((cnt, item) => condition(item) ? cnt + 1 : cnt, 0);
}

export function sum(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0);
}

export function zip<T, U>(xs: T[], ys: U[]): [T, U][] {
  const len = Math.min(xs.length, ys.length);
  const acc: [T, U][] = [];

  for (let i = 0; i < len; i++) {
    acc.push([xs[i], ys[i]]);
  }

  return acc;
}

export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, a) => [...acc, ...a], []);
}

export function intersect<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();

  if (sets.length === 0) {
    return result;
  }

  const firstSet = sets[0];

  Array.from(firstSet).forEach((v) => {
    if (sets.every((s) => s.has(v))) {
      result.add(v);
    }
  });

  return result;
}

export function max<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return;
  }

  let biggest = items[0]
  for (const item of items) {
    if (item > biggest) {
      biggest = item;
    }
  }

  return biggest;
}

export function min<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return;
  }

  let biggest = items[0]
  for (const item of items) {
    if (item < biggest) {
      biggest = item;
    }
  }

  return biggest;
}

export function replace<T>(arr: T[], index: number, value: T): T[] {
  return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
}

export function gcd(a: number, b: number): number {
  if (b > a) {
    return gcd(b, a);
  }

  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
}

export class Validate {
  public static exactLength(l: number) {
    return (value: string | any[]): boolean => value.length === l;
  }

  public static inRange(min: number, max: number) {
    return (value: string | number): boolean => {
      const numVal = typeof value === 'string' ? parseInt(value, 10) : value;
      return numVal >= min && numVal <= max;
    }
  }

  public static match(pattern: RegExp) {
    return (value: string): boolean => pattern.test(value)
  }

  public static oneOf<T>(vals: T[]) {
    return (value: T) => vals.includes(value)
  }
}

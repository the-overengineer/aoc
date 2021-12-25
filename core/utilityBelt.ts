import { readFile } from 'fs';
import { promisify } from 'util';

export const readBuff = promisify(readFile)
export const read = (filePath: string): Promise<string> => readBuff(filePath).then(_ => _.toString())
export const readLines = (filePath: string): Promise<string[]> => read(filePath).then((s) => s.split('\n'))

export function gaussSum(n: number) {
  return (n + 1) * n / 2;
}

export function argmin<T, R>(xs: T[], fn: (x: T) => R): T {
  let best = xs[0];
  let bestScore = fn(xs[0]);

  for (let i = 1; i < xs.length; i++) {
    const score = fn(xs[i]);

    if (score < bestScore) {
      bestScore = score;
      best = xs[i];
    }
  }

  return best;
}

export function argmax<T, R>(xs: T[], fn: (x: T) => R): T {
  let best = xs[0];
  let bestScore = fn(xs[0]);

  for (let i = 1; i < xs.length; i++) {
    const score = fn(xs[i]);

    if (score > bestScore) {
      bestScore = score;
      best = xs[i];
    }
  }

  return best;
}

export function count<T>(items: T[], condition: (x: T) => boolean): number {
  return items.reduce((cnt, item) => condition(item) ? cnt + 1 : cnt, 0);
}

export function sum(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0);
}

export function product(nums: number[]): number {
  return nums.reduce((s, n) => s * n, 1);
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

export function transpose<T>(matrix: T[][]): T[][] {
  const result: T[][] = [];
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let col = 0; col < cols; col++) {
    result.push([]);
    for (let row = 0; row < rows; row++) {
      result[result.length - 1]!.push(matrix[row][col]);
    }
  }

  return result;
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

export function union<T>(...sets: Set<T>[]): Set<T> {
  const result = new Set<T>();

  sets.forEach((s) => {
    Array.from(s).forEach((v) => {
      result.add(v);
    });
  });

  return result;
}

export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
  const result = new Set<T>();

  Array.from(a).forEach((v) => {
    if (!b.has(v)) {
      result.add(v);
    }
  });

  return result;
}

export function setEquals<T>(a: Set<T>, b: Set<T>): boolean {
  return a.size === b.size && Array.from(a).every((v) => b.has(v));
}

export function isEqual<T>(a: T, b: T): boolean {
  if (a instanceof Set && b instanceof Set) {
    return a.size === b.size && Array.from(a.values()).every((v) => b.has(v));
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => isEqual(x, b[i]));
  } else if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    return isEqual(aKeys, bKeys)
      && aKeys.every((k: any) => {
        const aVal = (a as any)[k];
        const bVal = (b as any)[k];
        return isEqual(aVal, bVal);
      });
  } else {
    return a === b;
  }
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

export function range(from: number, to: number): number[] {
  const result: number[] = [];
  for (let i = from; i < to; i++) {
    result.push(i);
  }
  return result;
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

export function gcdAll(nums: number[]): number {
  if (nums.length === 1) {
    return nums[0];
  }

  if (nums.length === 2) {
    return gcd(nums[0], nums[1]);
  }

  const [a, b, ...rest] = nums;

  return gcdAll([gcd(a, b), ...rest])
}

export function groupBy<T, K extends string>(xs: T[], fn: (x: T) => K): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;

  xs.forEach((x) => {
    const key = fn(x);

    if (groups[key] == null) {
      groups[key] = [];
    }

    groups[key].push(x);
  });

  return groups;
}

export function leftPad(str: string, len: number, padding: string = '0') {
  if (str.length >= len) {
    return str;
  }

  const missing = len - str.length;
  const repeatCount = Math.floor(missing / padding.length);

  return padding.repeat(repeatCount) + str;
}

export function repeat<T>(x: T, times: number): T[] {
  const repeated: T[] = [];

  for (let i = 0; i < times; i++) {
    repeated.push(x);
  }

  return repeated;
}

export type BinaryString = string;

export function binaryStringToNumber(bs: BinaryString) {
  let factor = 1;
  let num = 0;
  
  for (let i = bs.length - 1; i >= 0; i--) {
    if (bs[i] === '1') {
      num += factor;
    }

    factor *= 2;
  }

  return num;
}

export function slidingWindow<T>(items: T[], size: number): T[][] {
  const collections: T[][] = [];

  for (let i = 0; i <= items.length - size; i++) {
    const window: T[] = [];

    for (let j = 0; j < size; j++) {
      window.push(items[i + j]);
    }

    collections.push(window);
  }

  return collections;
}

export function pairings<T>(items: T[], orderMatters: boolean = false): [T, T][] {
  const pairs: [T, T][] = [];

  if (orderMatters) {
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (i !== j) {
          pairs.push([items[i], items[j]]);
        }
      }
    }
  } else {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        pairs.push([items[i], items[j]]);
      }
    }
  }

  return pairs;
}

export function memoized<A, R>(fn: (a: A) => R): (a: A) => R;
export function memoized<A, B, R>(fn: (a: A, b: B) => R): (a: A, b: B) => R;
export function memoized<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A, b: B, c: C) => R;
export function memoized(fn: Function) {
  const memo = new Map<string, any>();

  return function(...args: any[]) {
    const strArgs = JSON.stringify(args);
  
    if (memo.has(strArgs)) {
      return memo.get(strArgs)!;
    }
  
    const result = fn(...args);

    memo.set(strArgs, result);

    return result;
  }
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

export function constrainUniqueValues<K, V>(map: Map<K, Set<V>>): Map<K, Set<V>> {
  const result = new Map(map);
  let changed = true;

  while (changed) {
    changed = false;
    const uniqueValues: Set<V> = union(
      ...Array.from(result.values()).filter((vs) => vs.size === 1),
    );

    if (uniqueValues.size === 0) {
      break;
    }

    for (const key of result.keys()) {
      const value = result.get(key)!;
      const valuesWithoutUnique = difference(value, uniqueValues);
      if (valuesWithoutUnique.size > 0) {
        changed = true;
        result.set(key, valuesWithoutUnique);
      }
    }
  }

  return result;
}

interface String {
  toInt(): number;
  toFloat(): number;
  toBigInt(): bigint;
  reverse(): string;
}

String.prototype.toInt = function() {
  return Number.parseInt(this.toString(), 10);
};

String.prototype.toFloat = function() {
  return Number.parseFloat(this.toString());
};

String.prototype.toBigInt = function() {
  return BigInt(this.toString());
};

String.prototype.reverse = function() {
  return this.split('').reverse().join('');
};

interface Array<T> {
  peek(): T;
  toSet(): Set<T>;
  repeat(times: number): T[];
}

Array.prototype.toSet = function() {
  return new Set(this);
};

Array.prototype.peek = function() {
  return this[this.length - 1];
};

Array.prototype.repeat = function(times: number) {
  const arr = [];

  for (let i = 0; i < times; i++) {
    for (const el of this) {
      arr.push(el);
    }
  }

  return arr;
};

interface Set<T> {
  union(other: Set<T>): Set<T>;
  intersect(other: Set<T>): Set<T>;
  difference(other: Set<T>): Set<T>;
  isSupersetOf(other: Set<T>): boolean;
  isSubsetOf(other: Set<T>): boolean;
  with(value: T): Set<T>;
  without(value: T): Set<T>;
}

Set.prototype.with = function(value) {
  const res = new Set(Array.from(this));
  res.add(value);
  return res;
}

Set.prototype.without = function(value) {
  return this.difference(new Set(value));
};

Set.prototype.union = function(other) {
  const result = new Set();
  this.forEach((v) => result.add(v));
  other.forEach((v) => result.add(v));
  return result;
};

Set.prototype.intersect = function(other) {
  const result = new Set();
  this.forEach((v) => {
    if (other.has(v)) {
      result.add(v);
    }
  });
  return result;
};

Set.prototype.difference = function(other) {
  const result = new Set();
  this.forEach((v) => {
    if (!other.has(v)) {
      result.add(v);
    }
  });
  return result;
};

Set.prototype.isSupersetOf = function(other) {
  for (const value of other) {
    if (!this.has(other)) {
      return false;
    }
  }

  return true;
};

Set.prototype.isSubsetOf = function(other) {
  return other.isSubsetOf(this);
};

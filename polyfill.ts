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
  toSet(): Set<T>;
}

Array.prototype.toSet = function() {
  return new Set(this);
};

interface Set<T> {
  union(other: Set<T>): Set<T>;
  intersect(other: Set<T>): Set<T>;
  difference(other: Set<T>): Set<T>;
  isSupersetOf(other: Set<T>): boolean;
  isSubsetOf(other: Set<T>): boolean;
}

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

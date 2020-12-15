interface String {
  toInt(): number;
  toFloat(): number;
  toBigInt(): bigint;
}

String.prototype.toInt = function() {
  return Number.parseInt(this.toString(), 10);
}

String.prototype.toFloat = function() {
  return Number.parseFloat(this.toString());
}

String.prototype.toBigInt = function() {
  return BigInt(this.toString());
}

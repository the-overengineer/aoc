/* tslint:disable max-classes-per-file array-type */
import { assert } from 'console';
import { readLines, sum } from "./utilityBelt";

abstract class Expr {
  abstract result(): number;
  abstract toString(): string;
}

class Num extends Expr {
  public constructor(
    private num: number,
  ) {
    super();
  }

  public result() {
    return this.num;
  }

  public toString(): string {
    return this.num.toString();
  }
}

class Add extends Expr {
  public constructor(
    private a: Expr,
    private b: Expr,
  ) {
    super();
  }

  public result() {
    return this.a.result() + this.b.result();
  }

  public toString(): string {
    return `${this.a.toString()} + ${this.b.toString()}`;
  }
}

class Mult extends Expr {
  public constructor(
    private a: Expr,
    private b: Expr,
  ) {
    super();
  }

  public result() {
    return this.a.result() * this.b.result();
  }

  public toString(): string {
    return `${this.a.toString()} * ${this.b.toString()}`;
  }
}

class Paren extends Expr {
  public constructor(
    private innerExpr: Expr,
  ) {
    super();
  }

  public result() {
    return this.innerExpr.result();
  }

  public toString(): string {
    return `(${this.innerExpr.toString()})`;
  }
}

type Operator = '+' | '(' | '*'

interface Priority {
  [key: string]: number
}

function parse(text: string, priority: Priority = {}): Expr {
  const stack: Expr[] = [];
  const operatorStack: Array<Operator> = [];

  const chars = text.split('');

  const runTopOperation = () => {
    const b = stack.pop();
    const a = stack.pop();
    const operator = operatorStack.pop();

    assert(a != null, 'First argument is undefined!');
    assert(b != null, 'Second argument is undefined!');
    assert(operator != null, 'Operator is undefined!');

    const e = operator === '*' ? new Mult(a!, b!) : new Add(a!, b!);
    stack.push(e);
  }

  for (const char of chars) {
    if (char === ' ') continue;

    if (char === '+' || char === '*') {
      while (operatorStack.length > 0) {
        const topOp = operatorStack[operatorStack.length - 1];
        if (topOp === '(') break
        const myPrio = priority[char] || 0;
        const otherPrio = priority[topOp] || 0;
        if (otherPrio < myPrio) break;
        runTopOperation();
      }

      operatorStack.push(char);
      continue;
    }

    if (char === '(') {
      operatorStack.push('(');
      continue;
    }

    if (char === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        runTopOperation();
      }

      const innerExpr = stack.pop();
      const leftParen = operatorStack.pop();
      assert(leftParen === '(', 'Did not find a matching left parenthesis')
      assert(innerExpr != null, 'Did not get an argument for parens, but expected one')
      stack.push(new Paren(innerExpr!));
    } else {
      stack.push(new Num(parseInt(char, 10)));
    }
  }

  while (operatorStack.length) {
    runTopOperation()
  }

  assert(operatorStack.length === 0, 'We have extra operators to handle');
  assert(stack.length === 1, `We did not reduce the problem to one expression`);

  return stack[0]!;
}

/**
 * Get sum of expressions from file
 */
async function main1() {
  const expressions = await readLines('./18.txt');
  const results = expressions.map((expr) => parse(expr).result());
  console.log(sum(results));
}

/**
 * Get sum of expressions from file where priority of + is higher than *
 */
async function main2() {
  const expressions = await readLines('./18.txt');
  const priority = { '+': 1, '*': 0 }
  const results = expressions.map((expr) => parse(expr, priority).result());
  console.log(sum(results));
}

main2();

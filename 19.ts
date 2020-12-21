/* tslint:disable max-classes-per-file */
import './hackery';
import { count, readLines } from "./utilityBelt";

type Literal = string;
type RuleRef = number;

type Rule = RuleRef[][] | Literal;

type Rules = Map<RuleRef, Rule>;

const literalPattern = /^\"(.)\"$/

function parseRule(line: string): [RuleRef, Rule] {
  const [ruleRef, ruleText] = line.split(':').map((s) => s.trim());
  if (literalPattern.test(ruleText)) {
    return [ruleRef.toInt(), literalPattern.exec(ruleText)![1]! as Literal]
  }

  const segments: RuleRef[][] = ruleText.split(' | ').map((segment) => segment.split(' ').map((c) => c.toInt()));

  return [ruleRef.toInt(), segments];
}

function parseInput(lines: string[]): [Rules, string[]] {
  const rules: Rules = new Map();
  const inputs: string[] = [];
  let readingInputs = false;

  for (const line of lines) {
    if (readingInputs) {
      inputs.push(line.trim());
    } else if (line.trim() === '') {
      readingInputs = true;
      continue;
    } else {
      const [ref, rule] = parseRule(line);
      rules.set(ref, rule);
    }
  }

  return [rules, inputs];
}

function test(input: string, queue: RuleRef[], rules: Rules): boolean {
  if (queue.length === 0) {
    return input.length === 0;
  }

  const [ref, ...rest] = queue;
  const rule = rules.get(ref)!;

  if (typeof rule === 'string') {
    return input.charAt(0) === rule ? test(input.slice(1), rest, rules) : false
  }

  return rule.some((variant) => test(input, [...variant, ...rest], rules));

}

async function main1() {
  const lines = await readLines('./19.txt');
  const [rules, inputs] = parseInput(lines);
  const matched = count(inputs, (l) => test(l, [0], rules));
  console.log(matched) // 230
}

async function main2() {
  const lines = await readLines('./19.txt');
  const [rules, inputs] = parseInput(lines);
  rules.set(8, [[42], [42, 8]]);
  rules.set(11, [[42, 31], [42, 11, 31]]);
  const matched = count(inputs, (l) => test(l, [0], rules));
  console.log(matched) // 230
}

main2();

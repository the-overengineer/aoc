import { count, read, sum } from '@core/utilityBelt';

interface ContainsRule {
  colour: string;
  count: number;
}

interface BagRules {
  [colour: string]: ContainsRule[];
}

const RULE_PATTERN = /^([\w ]+) bags contain (.+).$/;
const BAG_CONTAINS_PATTERN = /^(\d+) ([\w ]+) bags?$/
const EMPTY = 'no other bags';

function getBagRules(lines: string[]): BagRules {
  const rules: BagRules = {};

  for (const line of lines) {
    const [_, colour, bagRules] = RULE_PATTERN.exec(line)!;
    const containsRules: ContainsRule[] = [];

    if (bagRules !== EMPTY) {
      bagRules.split(', ').forEach((bagRule) => {
        const [__, countStr, bagColour] = BAG_CONTAINS_PATTERN.exec(bagRule)!;
        containsRules.push({
          colour: bagColour,
          count: parseInt(countStr, 10),
        });
      });
    }

    rules[colour] = containsRules;
  }

  return rules;
}

function contains(rules: BagRules, bag: string, targetBag: string): boolean {
  if (rules[bag].some((rule) => rule.colour === targetBag)) {
    return true;
  }

  if (rules[bag].some((rule) => contains(rules, rule.colour, targetBag))) {
    return true;
  }

  return false;
}

function countBagsInside(rules: BagRules, bag: string): number {
  return sum(rules[bag].map((b) => b.count + b.count * countBagsInside(rules, b.colour)));
}

async function main1() {
  const text = await read('./7.txt');
  const rules = getBagRules(text.split('\n'));
  const TARGET = 'shiny gold';

  const possibleCount = count(Object.keys(rules), (rule: string) => contains(rules, rule, TARGET));
  console.log(possibleCount);
}

async function main2() {
  const text = await read('./7.txt');
  const rules = getBagRules(text.split('\n'));
  const TARGET = 'shiny gold';

  const bagCount = countBagsInside(rules, TARGET);
  console.log(bagCount);
}

main2();

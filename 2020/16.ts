import './polyfill';
import { constrainUniqueValues, flatten, product, readLines, sum, transpose, Validate } from './utilityBelt';

interface IRule {
  name: string;
  ranges: [number, number][];
}

type Ticket = number[];

interface ITicketInformation {
  rules: IRule[];
  myTicket: Ticket;
  nearbyTickets: Ticket[];
}

const RULE_PATTERN = /^(.+?): (\d+-\d+) or (\d+-\d+)$/

async function readInfo(): Promise<ITicketInformation> {
  const lines = await readLines('./16.txt');
  const rules: IRule[] = [];
  let myTicket!: Ticket;
  const nearbyTickets: Ticket[] = [];
  let stage = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) {
      stage++;
      i++; // skip additional title line
      continue;
    }

    if (stage === 1) {
      const [_, name, range1, range2] = RULE_PATTERN.exec(line)!;
      rules.push({
        name,
        ranges: [
          range1.split('-').map((x) => x.toInt()) as [number, number],
          range2.split('-').map((x) => x.toInt()) as [number, number],
        ],
      })
    } else if (stage === 2) {
      myTicket = line.split(',').map((x) => x.toInt())
    } else {
      nearbyTickets.push(line.split(',').map((x) => x.toInt()))
    }
  }

  return {
    rules,
    myTicket,
    nearbyTickets,
  }
}

const isInvalid = (ticket: Ticket, rules: IRule[]): boolean =>
  ticket.some((value) =>
    !rules.some((rule) => rule.ranges.some((range) => Validate.inRange(range[0], range[1])(value))),
  )

async function main1() {
  const { rules, nearbyTickets } = await readInfo();

  const values = flatten(nearbyTickets);

  const invalids: number[] = [];

  values.forEach((value) => {
    if (isInvalid([value], rules)) {
      invalids.push(value);
    }
  });


  console.log(sum(invalids))
}

async function main2() {
  const { rules, myTicket, nearbyTickets } = await readInfo();
  const validTickets = [
    myTicket,
    ...nearbyTickets.filter((t) => !isInvalid(t, rules)),
  ];

  const ticketCols = transpose(validTickets);

  const ruleSatisfiesFields: Map<string, Set<number>> = new Map();

  for (const rule of rules) {
    const name = rule.name;
    const indices: number[] = [];
    ticketCols.forEach((col, index) => {
      if (col.every((val) => rule.ranges.some(([min, max]) => Validate.inRange(min, max)(val)))) {
        indices.push(index);
      }
    })

    ruleSatisfiesFields.set(name, new Set(indices));
  }

  const matchedRules = constrainUniqueValues(ruleSatisfiesFields);

  const departureIndices = Array.from(matchedRules.keys())
    .filter((rule) => rule.startsWith('departure'))
    .map((k) => Array.from(matchedRules.get(k)!)[0]!)

  console.log(product(departureIndices.map((i) => myTicket[i])));
}

main2();

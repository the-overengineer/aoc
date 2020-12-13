import { read, replace } from './utilityBelt';

type Program = [string, number][];

function parse(text: string): Program {
  return text.split('\n').map((line) => {
    const [cmd, arg] = line.split(' ');
    return [cmd, Number.parseInt(arg, 10)];
  });
}

function run(code: Program): [number, boolean] {
  let accumulator = 0;
  let terminates = false;

  const visitedLines = new Set<number>()

  for (let i = 0; i < code.length;) {
    const [cmd, arg] = code[i];

    if (visitedLines.has(i)) {
      break;
    }

    visitedLines.add(i);

    if (cmd === 'acc') {
      accumulator += arg;
      i++;
    } else if (cmd === 'jmp') {
      i += arg;
    } else if (cmd === 'nop') {
      i++
    }

    if (i === code.length) {
      terminates = true;
      break;
    }
  }

  return [accumulator, terminates];
}

function possibleFixes(code: Program): Program[] {
  const programs: Program[] = [];

  // We could just skip options that would lead to a visited node even after the change,
  // if we first ran the original program once, I guess... But no need for optimisation
  for (let i = 0; i < code.length; i++) {
    if (code[i][0] === 'jmp') {
      programs.push(replace(code, i, ['nop', code[i][1]]));
    } else if (code[i][0] === 'nop') {
      programs.push(replace(code, i, ['jmp', code[i][1]]));
    }
  }

  return programs;
}

async function main1() {
  const code: Program = parse(await read('./8.txt'));
  console.log(run(code)[0]);
}

async function main2() {
  const code: Program = parse(await read('./8.txt'));
  const programs = possibleFixes(code);

  for (const program of programs) {
    const [acc, terminates] = run(program);
    if (terminates) {
      console.log(acc);
      break;
    }
  }
}

main2();
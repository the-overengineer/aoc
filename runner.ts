require('module-alias/register');

import { DaySolution } from '@core/DaySolution';
import { read, readLines } from '@core/utilityBelt';
import { join } from 'path';
import yargs from 'yargs/yargs';

const parts = [1, 2] as const;

yargs(process.argv.slice(2)).options({
    day: { type: 'number', demandOption: true },
    year: { type: 'number', default: new Date().getFullYear() },
    part: { choices: parts, demandOption: false },
    inputFile: { type: 'string', demandOption: false },
}).parseAsync().then((args) => {
    const solutionPath = join(__dirname, args.year.toString(), `${args.day}.ts`);

    import(solutionPath).then((imported: { default: DaySolution<any> }) => {
        const task = imported.default;
        
        const inputFile = args.inputFile == null
            ? join(__dirname, args.year.toString(), `${args.day}.input`)
            : join(__dirname, args.year.toString(), args.inputFile!);
        
        const input: Promise<string | string[]> = task.lines
            ? readLines(inputFile)
            : read(inputFile);

        input.then((parsedInput: any) => {
            if (args.part === 2) {
                return task.part2!(parsedInput);
            } else if (args.part === 1) {
                return task.part1(parsedInput);
            } else if (task.part2 != null) {
                return task.part2!(parsedInput);
            } else {
                return task.part1(parsedInput);
            }
        }).then((solution) => {
            console.log(solution);
        });
    }).catch((err) => {
        console.error(err);
    });
});


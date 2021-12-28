import { Solution } from "@core/DaySolution";

function iterate(input: string) {
    let count = 0;
    let symbol: string;
    let builder: string = '';

    input.split('').forEach((c) => {
        if (c === symbol) {
            count++;
        } else {
            if (count > 0) {
                builder += `${count}${symbol}`;
            }
            symbol = c;
            count = 1;
        }
    });

    return builder + `${count}${symbol!}`;
}

function part1(line: string) {
    let value = line;

    for (let i = 0; i < 40; i++) {
        value = iterate(value);
    }

    return value.length;
}

function part2(line: string) {
    let value = line;

    for (let i = 0; i < 50; i++) {
        value = iterate(value);
    }

    return value.length;
}

export default Solution.raw({
    part1,
    part2,
});
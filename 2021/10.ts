import { readLines } from './utilityBelt';

const closedBy: Record<string, string> = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
};

const openSymbols: Set<string> = new Set(['(', '[', '{', '<'])

const incompletenessScoreLookup: Record<string, number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};

const autocompleteScoreLookup: Record<string, number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};


function getIncompletenessScore(syms: string[]): number | undefined {
    const stack: string[] = [];

    for (const sym of syms) {
        if (openSymbols.has(sym)) {
            stack.push(sym);
        } else {
            const stackTop = stack[stack.length - 1];
            if (closedBy[stackTop] === sym) {
                stack.pop();
            } else {
                // We have an incompleteness error!
                return incompletenessScoreLookup[sym];
            }
        }
    }
}

function getAutocompleteScore(syms: string[]): number {
    const stack: string[] = [];

    for (const sym of syms) {
        if (openSymbols.has(sym)) {
            stack.push(sym);
        } else {
            const stackTop = stack[stack.length - 1];
            if (closedBy[stackTop] === sym) {
                stack.pop();
            } else {
                throw new Error('Incomplete list snuck in here!');
            }
        }
    }

    let autocompleteScore: number = 0;

    while (stack.length > 0) {
        const top = stack.pop()!;
        const closer = closedBy[top];
        const closerScore = autocompleteScoreLookup[closer];
        autocompleteScore = autocompleteScore * 5 + closerScore;
    }

    return autocompleteScore;
}

async function part1() {
    const lines = await readLines('./10.input');
    let score = 0;

    for (const line of lines) {
        const syms = line.split('');
        const lineScore = getIncompletenessScore(syms);

        if (lineScore != null) {
            score += lineScore;
        }
    }

    return score;
}

async function part2() {
    const lines = await readLines('./10.input');
    const inputs = lines.map((l) => l.split(''));
    const validInputs = inputs.filter((i) => getIncompletenessScore(i) == null);
    const scores: number[] = [];

    for (const input of validInputs) {
        const lineScore = getAutocompleteScore(input);
        scores.push(lineScore);
    }

    const sortedScores = scores.sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedScores.length / 2);
    return sortedScores[middleIndex];
}

part2().then(console.log);

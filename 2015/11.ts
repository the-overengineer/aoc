import { Solution } from '@core/DaySolution';
import { last, pairings, slidingWindow } from '@core/utilityBelt';

export function iteratePassword(current: string): string {
    const reversed = current.split('').reverse();
    const builder: string[] = [];

    for (let i = 0; i < reversed.length; i++) {
        const char = reversed[i];

        if (char === 'z') {
            builder.push('a');
        } else {
            const next = String.fromCharCode(char.charCodeAt(0) + 1);
            builder.push(next);
            return [...builder, ...reversed.slice(i + 1)].reverse().join('');
        }
    }

    return [...builder].reverse().join('');
}

export function satisfiesRule1(input: string): boolean {
    let streak: string[] = [];

    for (const char of input.split('')) {
        if (streak.length === 3) {
            return true;
        }

        if (streak.length === 0) {
            streak.push(char);
        }

        if (char.charCodeAt(0) === last(streak).charCodeAt(0) + 1) {
            streak.push(char);
        } else {
            streak = [char];
        }
    }

    return streak.length === 3;
}

export function satisfiesRule2(input: string): boolean {
    return !['i', 'o', 'l'].some((c) => input.includes(c));
}

export function satisfiesRule3(input: string): boolean {
    let previousMatched = false;
    let matches = 0;
    const pairs = slidingWindow(input.split(''), 2);

    for (const [a, b] of pairs) {
        if (previousMatched) {
            previousMatched = false;
            continue;
        } else if (a === b) {
            previousMatched = true;
            matches++;
        }
    }

    return matches >= 2;
}

export function nextPassword(current: string): string {
    let password = iteratePassword(current);

    while (true) {
        if (satisfiesRule1(password) && satisfiesRule2(password) && satisfiesRule3(password)) {
            return password;
        }

        password = iteratePassword(password);
    }
}

function part1(input: string) {
    return nextPassword(input);
}

function part2(input: string) {
    return nextPassword(nextPassword(input));
}

export default Solution.raw({
    part1,
    part2,
})
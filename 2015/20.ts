import '@core/polyfill'
import { Solution } from '@core/DaySolution';

function giftCount(house: number): number {
    let count = house * 10;

    for (let i = 1; i <= Math.floor(house / 2); i++) {
        if (house % i === 0) {
            count += i * 10;
        }
    }

    return count;
}

function giftCountLazyElves(house: number): number {
    let count = house * 11;

    for (let i = 1; i <= Math.floor(house / 2); i++) {
        if (house <= i * 50 && house % i === 0) {
            count += i * 11;
        }
    }

    return count;
}

function part1(input: string) {
    const expectedPresents = input.toInt();

    for (let i = 600_000 ;; i++) {
        if (i % 1000 === 0) {
            console.debug(i, '=>', giftCount(i));
        } 
        if (giftCount(i) >= expectedPresents) {
            return i;
        }
    }
}

function part2(input: string) {
    const expectedPresents = input.toInt();

    for (let i = 600_000 ;; i++) {
        if (i % 1000 === 0) {
            console.debug(i, '=>', giftCount(i));
        } 
        if (giftCountLazyElves(i) >= expectedPresents) {
            return i;
        }
    }
}

export default Solution.raw({
    part1,
    part2,
});
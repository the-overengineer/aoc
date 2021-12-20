import { ArrayMap } from '@core/ArrayMap';
import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { repeat } from '@core/utilityBelt';

export type Sym = '#' | '.'
export type Algorithm = Array<Sym>;
export type LightMap = ArrayMap<[number, number], Sym>;

interface Enhanced {
    lightMap: LightMap;
    outsideSymbol: Sym;
}

function parse(input: string): [Algorithm, LightMap] {
    const [algorithm, lines] = input.split('\n\n');
    const lightMap = new ArrayMap<[number, number], Sym>();

    lines.split('\n').forEach((row, y) => {
        row.split('').forEach((cell, x) => {
            lightMap.set([y, x], cell as Sym);
        });
    });

    return [
        algorithm.split('') as Algorithm,
        lightMap,
    ];
}

function xBounds(map: LightMap): [number, number] {
    let minx = Infinity;
    let maxx = -Infinity;

    Array.from(map.keyList()).forEach(([_, x]) => {
        minx = Math.min(x, minx);
        maxx = Math.max(x, maxx);
    });

    return [minx, maxx];
}

function yBounds(map: LightMap): [number, number] {
    let miny = Infinity;
    let maxy = -Infinity;

    Array.from(map.keyList()).forEach(([y]) => {
        miny = Math.min(y, miny);
        maxy = Math.max(y, maxy);
    });

    return [miny, maxy];
}

function getEnhanceIndex(map: LightMap, y: number, x: number, outsideSymbol: Sym): number {
    let bitStr = '';

    for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
            const sym = map.get([y + dy, x + dx]) ?? outsideSymbol;
            bitStr += sym === '#' ? '1' : '0';
        }
    }

    return parseInt(bitStr, 2);
}

function enhance(map: LightMap, algorithm: Algorithm, outsideSymbol: Sym): Enhanced {
    const nextOutsideSymbol = outsideSymbol === '.'
        ? algorithm[0]
        : algorithm[algorithm.length - 1];
    
    const nextMap = new ArrayMap<[number, number], Sym>();
    const [minX, maxX] = xBounds(map);
    const [minY, maxY] = yBounds(map);

    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            const index = getEnhanceIndex(map, y, x, outsideSymbol);
            const value = algorithm[index];
            nextMap.set([y, x], value);
        }   
    }

    return {
        lightMap: nextMap,
        outsideSymbol: nextOutsideSymbol,
    };
}

function brightness(map: LightMap): number {
    return Array.from(map.values()).filter(_ => _ === '#').length;
}

function toString(map: LightMap): string {
    const [minX, maxX] = xBounds(map);
    const [minY, maxY] = yBounds(map);
    let str: string = '';


    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            str += map.get([y, x]) ?? '?';
        }
        str += '\n';
    }

    return str;
}

function part1(input: string) {
    const [algorithm, lightMap] = parse(input);
    let outsideSymbol: Sym = '.';

    const enhanced = enhance(lightMap, algorithm, outsideSymbol);
    const result = enhance(enhanced.lightMap, algorithm, enhanced.outsideSymbol);

    return brightness(result.lightMap);
}

function part2(input: string) {
    const [algorithm, initialMap] = parse(input);
    let outsideSymbol: Sym = '.';
    let lightMap = initialMap;

    for (let i = 0; i < 50; i++) {
        const enhanced = enhance(lightMap, algorithm, outsideSymbol);
        lightMap = enhanced.lightMap;
        outsideSymbol = enhanced.outsideSymbol;
    }

    return brightness(lightMap);
}

export default Solution.raw({
    part1,
    part2,
})
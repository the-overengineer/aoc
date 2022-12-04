import { Solution } from '@core/DaySolution';
import '@core/polyfill';
import { argmin, count, flatten, groupIntoChunks } from '@core/utilityBelt';

type Layer = number[][];
type Image = Layer[];
const Color = {
    Black: 0,
    White: 1,
    Transparent: 2,
} as const;
type Color = typeof Color[keyof typeof Color];

export function part1(input: string): number {
    const image = getImage(input, 25, 6);
    const fewestZeroesLayer = argmin(image, (layer) => count(flatten(layer), _ => _ === 0));
    const oneDigitsCount = count(flatten(fewestZeroesLayer), _ => _ === 1);
    const twoDigitsCount = count(flatten(fewestZeroesLayer), _ => _ === 2);
    return oneDigitsCount * twoDigitsCount;
}

export function part2(input: string): number {
    const image = getImage(input, 25, 6);
    const decoded = decode(image);
    console.log();
    return decoded.map(
        (row) => row.map((c) => c === 1 ? '#' : ' ').join(''),
    ).join('\n') as any;
}

export function getImage(input: string, width: number, height: number): Image {
    const layers: number[][] =
        groupIntoChunks(
            input.split('').map(_ => _.toInt()),
            width * height,
        );

    return layers.map((layer) => groupIntoChunks(layer, width))
}

export function decode(image: Image): Layer {
    const firstLayer = image[0];
    return firstLayer.map((row, y) => {
        return row.map((topPixel, x) => {
            return image.reduce((pixel, layer) => {
                if (pixel !== Color.Transparent) {
                    return pixel;
                } else {
                    return layer[y][x];
                }
            }, topPixel);
        })
    });
}

export default Solution.raw({
    part1,
    part2,
});

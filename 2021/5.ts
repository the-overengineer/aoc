import { readLines } from './utilityBelt';

type X = number;
type Y = number;
type Point = [X, Y];
type VisitCount = Record<string, number>;

function getStep(a0: number, a1: number): number {
    if (a0 === a1) {
        return 0;
    } else if (a0 > a1) {
        return -1;
    } else {
        return 1;
    }
}

class Line {
    public static of(descriptor: string): Line {
        const [x1, y1, x2, y2] = /^(\d+),(\d+) -> (\d+),(\d+)$/
            .exec(descriptor)
            ?.slice(1, 5)
            ?.map((it) => parseInt(it, 10)) ?? [];

        return new Line(
            [x1, y1],
            [x2, y2],
        );
    }
    public constructor(
        public readonly from: Point,
        public readonly to: Point,
    ) {}

    public get isStraight(): boolean {
        return this.from[0] === this.to[0]
            || this.from[1] === this.to[1];
    }

    public get path(): Point[] {
        const [x0, y0] = this.from;
        const [x1, y1] = this.to;
        const xdiff = getStep(x0, x1);
        const ydiff = getStep(y0, y1);
        const thePath: Point[] = [];

        for (let x = x0, y = y0 ;; x += xdiff, y += ydiff) {
            thePath.push([x, y]);

            if (x === x1 && y === y1) {
                break;
            }
        }

        return thePath;
    }
}

function countOverlaps(lines: Line[]): number {
    const counter: VisitCount = {};

    lines.forEach((line) => {
        line.path.forEach((p) => {
            const pathDescriptor = p.join(',');

            if (counter[pathDescriptor] != null) {
                counter[pathDescriptor]++;
            } else {
                counter[pathDescriptor] = 1;
            }
        });
    });

    const overlapCount = Object.values(counter).filter((cnt) => cnt > 1).length;
    
    return overlapCount;
}

async function getLinesFromFile(path: string): Promise<Line[]> {
    const textLines = await readLines(path);
    return textLines.map((line) => Line.of(line));
}

async function part1() {
    const lines = await getLinesFromFile('./5.txt');
    return countOverlaps(lines.filter((l) => l.isStraight));   
}

async function part2() {
    const lines = await getLinesFromFile('./5.txt');
    return countOverlaps(lines);   
}

part1().then(console.log);
part2().then(console.log);

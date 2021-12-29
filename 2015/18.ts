import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';

class Lights extends Grid<'#' | '.'> {
    public static of(data: string): Lights {
        return new Lights(data.split('\n').map((line) => line.split('') as Array<'#' | '.'>));
    }

    public next(stuckCorners: boolean = false): Lights {
        const grid = this.map((cell, y, x) => {
            const neighbours = this.getNeighbours(y, x, true);
            const onCount = neighbours.filter((n) => n === '#').length;
            const offCount = 8 - onCount;

            if (stuckCorners && this.isCorner(y, x)) {
                return '#';
            }

            if (cell === '#') {
                return onCount === 2 || onCount === 3 ? '#' : '.';
            } else {
                return onCount === 3 ? '#' : '.';
            }
        });

        return new Lights(grid.data);
    }

    private isCorner(y: number, x: number) {
        return (x === 0 || x === this.width - 1) && (y === 0 || y === this.height - 1);
    }
}

function part1(input: string) {
    let grid = Lights.of(input);

    for (let i = 0; i < 100; i++) {
        grid = grid.next();
    }

    const onLights = grid.filter((it) => it === '#');
    return onLights.length;
}

function part2(input: string) {
    let grid = Lights.of(input);
    grid.set(0, 0, '#');
    grid.set(0, grid.height - 1, '#');
    grid.set(grid.width - 1, 0, '#');
    grid.set(grid.width - 1, grid.height - 1, '#');

    for (let i = 0; i < 100; i++) {
        grid = grid.next(true);
    }

    const onLights = grid.filter((it) => it === '#');
    return onLights.length;
}

export default Solution.raw({
    part1,
    part2,
});

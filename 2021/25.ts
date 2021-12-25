import { Solution } from '@core/DaySolution';
import { Grid } from '@core/Grid';
import { isEqual } from '@core/utilityBelt';

type OceanFloor = '>' | 'v' | '.';

class Floor extends Grid<OceanFloor> {
    public next(): [Floor, boolean] {
        const data = this.map((c, y, x, grid) => {
            if (c === '>' && grid[y][this.rightIndex(x)] === '.') {
                return '.';
            } else if (c === '.' && grid[y][this.leftIndex(x)] === '>') {
                return '>';
            } else {
                return c;
            }
        }).map((c, y, x, grid) => {
            if (c === 'v' && grid[this.bottomIndex(y)][x] === '.') {
                return '.';
            } else if (c === '.' && grid[this.topIndex(y)][x] === 'v') {
                return 'v';
            } else {
                return c;
            }
        }).data;

        return [new Floor(data), isEqual(this.data, data)];
    }

    private rightIndex(x: number) {
        return x === this.width - 1 ? 0 : x + 1;
    }

    private leftIndex(x: number) {
        return x === 0 ? this.width - 1 : x - 1;
    }

    private bottomIndex(y: number) {
        return y === this.height - 1 ? 0 : y + 1;
    }

    private topIndex(y: number) {
        return y === 0 ? this.height - 1 : y - 1;
    }
}

function part1(lines: string[]) {
    const data = lines.map((l) => l.split('') as OceanFloor[]);
    let grid = new Floor(data);

    for (let i = 1 ;; i++) {
        const [nextGrid, isSame] = grid.next();

        if (isSame) {
            return i;
        }

        grid = nextGrid;
    }
}

export default Solution.lines({
    part1,
});

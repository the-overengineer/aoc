import { ArraySet } from "./ArraySet";

type Coordinate = [number, number, number, number];

class CubeSpace {
  public constructor(
    public readonly active: ArraySet<Coordinate>,
  ) {}

  public get activeCount(): number {
    return this.active.size;
  }

  public next(): CubeSpace {
    const nextActive = new ArraySet<Coordinate>();

    const [[minX, minY, minZ, minW], [maxX, maxY, maxZ, maxW]] = this.bounds;

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          for (let w = minW; w <= maxW; w++) {
            const point: Coordinate = [x, y, z, w];
            const isActive = this.active.has(point);
            const activeNeighbours = this.countActiveNeighbours(point);
  
            if (isActive && activeNeighbours >= 2 && activeNeighbours <= 3) {
              nextActive.add(point);
            } else if (!isActive && activeNeighbours === 3) {
              nextActive.add(point);
            }
          }
        }
      }
    }

    return new CubeSpace(nextActive);
  }

  private get bounds(): [Coordinate, Coordinate]{
    const coordList = this.active.toList();

    let min: Coordinate = coordList[0];
    let max: Coordinate = coordList[0];

    for (const coord of coordList) {
      min = [
        Math.min(min[0], coord[0]),
        Math.min(min[1], coord[1]),
        Math.min(min[2], coord[2]),
        Math.min(min[3], coord[3]),
      ]
      max = [
        Math.max(max[0], coord[0]),
        Math.max(max[1], coord[1]),
        Math.max(max[2], coord[2]),
        Math.max(max[3], coord[3]),
      ]
    }

    return [
      [
        min[0] - 1,
        min[1] - 1,
        min[2] - 1,
        min[3] - 1,
      ],
      [
        max[0] + 1,
        max[1] + 1,
        max[2] + 1,
        max[3] + 1,
      ],
    ];
  }

  private countActiveNeighbours(coord: Coordinate): number {
    let counter = 0;

    for (const dx of [-1, 0, 1]) {
      for (const dw of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
          for (const dz of [-1, 0, 1]) {
            if (dx === 0 && dy === 0 && dz === 0 && dw === 0) {
              continue;
            }

            if (this.active.has([coord[0] + dx, coord[1] + dy, coord[2] + dz, coord[3] + dw])) {
              counter++;
            }
          }
        }
      }
    }

    return counter;
  }

  public toString(): string {
    const [[minX, minY, minZ, minW], [maxX, maxY, maxZ, maxW]] = this.bounds;
    let builder = '';

    for (let z = minZ + 1; z < maxZ; z++) {
      builder += `z=${z}`;
      for (let w = minW + 1; w < maxW; w++) {
        builder += `, w=${w}`
        for (let y = minY + 1; y < maxY; y++) {
          builder += `
`;
          for (let x = minX + 1; x < maxX; x++) {
            builder += this.active.has([x, y, z, w]) ? '#' : '.';
          }
        }
      }
      builder += `

`;
    }

    return builder.trimEnd();
  }

  public static parseSlice(slice: string) {
    const active = new ArraySet<Coordinate>()
    const rows = slice.split('\n');
    rows.forEach((row, y) => {
      row.split('').forEach((symbol, x) => {
        if (symbol === '#') {
          active.add([x, y, 0, 0]);
        }
      })
    });

    return new CubeSpace(active);
  }
}

function main2() {
  let cube = CubeSpace.parseSlice(`.......#
....#...
...###.#
#...###.
....##..
##.#..#.
###.#.#.
....#...`);

  for (let i = 0; i < 6; i++) {
    cube = cube.next();
  }

  console.log(cube.activeCount);
}

main2();

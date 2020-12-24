/* tslint:disable max-classes-per-file */
import './polyfill';
import { count, product, read } from "./utilityBelt";

class RasterImage {
  public constructor(
    public readonly cells: string[][],
  ) {}

  public get height(): number {
    return this.cells.length;
  }

  public get width(): number {
    return this.cells[0].length;
  }

  public get topEdge(): string {
    return this.getEdge(0, 0, 0, this.width - 1);
  }

  public get bottomEdge(): string {
    return this.getEdge(this.height - 1, this.height - 1, 0, this.width - 1);
  }

  public get leftEdge(): string {
    return this.getEdge(0, this.height - 1, 0, 0);
  }

  public get rightEdge(): string {
    return this.getEdge(0, this.height - 1, this.width - 1, this.width - 1);
  }

  public get edges(): string[] {
    const possibleEdges = [];

    possibleEdges.push(this.topEdge);
    possibleEdges.push(this.topEdge.reverse());
    possibleEdges.push(this.bottomEdge);
    possibleEdges.push(this.bottomEdge.reverse());
    possibleEdges.push(this.leftEdge);
    possibleEdges.push(this.leftEdge.reverse());
    possibleEdges.push(this.rightEdge);
    possibleEdges.push(this.rightEdge.reverse());

    return possibleEdges;
  }

  public get flippedVertical(): RasterImage {
    const transformed: string[][] = [];
    for (let row = 0; row < this.height; row++) {
      transformed.push([]);
      for (let column = 0; column < this.width; column++) {
        const indexRow = row;
        const indexColumn = this.width - column - 1;
        transformed[transformed.length - 1].push(this.cells[indexRow][indexColumn]);
      }
    }

    return new RasterImage(transformed);
  }

  public get flippedHorizontal(): RasterImage {
    const transformed: string[][] = [];
    for (let row = 0; row < this.height; row++) {
      transformed.push([]);
      for (let column = 0; column < this.width; column++) {
        const indexRow = this.height - row - 1;
        const indexColumn = column;
        transformed[transformed.length - 1].push(this.cells[indexRow][indexColumn]);
      }
    }

    return new RasterImage(transformed);
  }

  public get rotateRight(): RasterImage {
    const transformed: string[][] = [];
    for (let row = 0; row < this.height; row++) {
      transformed.push([]);
      for (let column = 0; column < this.width; column++) {
        const indexRow = this.width - column - 1;
        const indexColumn = row;
        transformed[transformed.length - 1].push(this.cells[indexRow][indexColumn]);
      }
    }

    return new RasterImage(transformed);
  }

  public get rotateLeft(): RasterImage {
    const transformed: string[][] = [];
    for (let row = 0; row < this.height; row++) {
      transformed.push([]);
      for (let column = 0; column < this.width; column++) {
        const indexRow = column;
        const indexColumn = this.height - row - 1;
        transformed[transformed.length - 1].push(this.cells[indexRow][indexColumn]);
      }
    }

    return new RasterImage(transformed);
  }

  // inclusive, exclusive
  public crop(fromX: number, toX: number, fromY: number, toY: number): RasterImage {
    const cropped: string[][] = [];
    for (let row = fromY; row < toY; row++) {
      cropped.push([]);
      for (let col = fromX; col < toX; col++) {
        cropped[cropped.length - 1].push(this.cells[row][col]);
      }
    }

    return new RasterImage(cropped);
  }

  public appendRight(other: RasterImage): RasterImage {
    const cells: string[][] = [];

    if (this.height !== other.height) {
      throw new Error('Cannot horizontally merge rasters of unequal height!');
    }

    for (let row = 0; row < this.height; row++) {
      cells.push([]);
      for (let col = 0; col < this.width; col++) {
        cells[cells.length - 1].push(this.cells[row][col]);
      }
      for (let col = 0; col < other.width; col++) {
        cells[cells.length - 1].push(other.cells[row][col]);
      }
    }

    return new RasterImage(cells);
  }

  public prependLeft(other: RasterImage): RasterImage {
    return other.appendRight(this);
  }

  public appendBottom(other: RasterImage): RasterImage {
    const cells: string[][] = [];

    if (this.width !== other.width) {
      throw new Error('Cannot vertically merge rasters of unequal width!');
    }

    for (let row = 0; row < this.height; row++) {
      cells.push([]);
      for (let col = 0; col < this.width; col++) {
        cells[cells.length - 1].push(this.cells[row][col]);
      }
    }

    for (let row = 0; row < other.height; row++) {
      cells.push([]);
      for (let col = 0; col < other.width; col++) {
        cells[cells.length - 1].push(other.cells[row][col]);
      }
    }

    return new RasterImage(cells);
  }

  public prependTop(other: RasterImage): RasterImage {
    return other.appendBottom(this);
  }

  private getEdge(xFrom: number, xTo: number, yFrom: number, yTo: number): string {
    let edge = '';

    for (let i = xFrom; i <= xTo; i++) {
      for (let j = yFrom; j <= yTo; j++) {
        edge += this.cells[i][j];
      }
    }

    return edge;
  }

  public equals(other: RasterImage, matchCell: (a: string, b: string) => boolean = (a, b) => a === b): boolean {
    return this.height === other.height
      && this.width === other.width
      && this.cells.every((row, i) => row.every((cell, j) => matchCell(cell, other.cells[i][j])));
  }

  public toString(): string {
    return this.cells.map((c) => c.join('')).join('\n');
  }

  public static combineGrid(grid: RasterImage[][]): RasterImage {
    const rows: RasterImage[] = grid.map((row) => {
      return row.slice(1).reduce((acc, raster) => acc.appendRight(raster) , row[0]);
    });
    return rows.slice(1).reduce((acc, row) => acc.appendBottom(row), rows[0]);
  }

  public static fromString(rasterStr: string): RasterImage {
    return new RasterImage(rasterStr.split('\n').map((r) => r.split('')));
  }
}

class Tile extends RasterImage {
  public constructor(
    public readonly id: string,
    cells: string[][],
  ) {
    super(cells);
  }
}

const TILE_PATTERN = /^Tile (\d+):$/;

async function readTiles(): Promise<Tile[]> {
  const text = await read('./20.txt');
  const tileDescriptors = text.split('\n\n');

  const tiles: Tile[] = []

  for (const tileDescriptor of tileDescriptors) {
    const lines = tileDescriptor.split('\n');
    const id = TILE_PATTERN.exec(lines[0])![1];
    const cells = lines.slice(1).map((l) => l.split(''));

    tiles.push(new Tile(id, cells));
  }

  return tiles;
}

class ScannableRasterImage extends RasterImage {
  public constructor(raster: RasterImage) {
    super(raster.cells)
  }

  public countAppearances(other: RasterImage, matchCell: (a: string, b: string) => boolean = (a, b) => a === b): number {
    const maxX = this.width - other.width;
    const maxY = this.height - other.height;
    let appearanceCounter = 0;

    for (let row = 0; row <= maxY; row++) {
      for (let col = 0; col <= maxX; col++) {
        const searchSquare = this.crop(col, col + other.width, row, row + other.height);
        if (searchSquare.equals(other, matchCell)) {
          appearanceCounter++;
        }
      }
    }

    return appearanceCounter;
  }
}

function combinedAlignedImage(grid: RasterImage[][]): RasterImage {
  const squareSize = grid[0][0].width;

  const croppedRasters = grid.map((row) => row.map((raster) => {
    // Slice off extra padding for alignment
    return raster.crop(1, squareSize - 1, 1, squareSize - 1);
  }));

  return RasterImage.combineGrid(croppedRasters);
}

function getCorners(tiles: Tile[]): Tile[] {
  const matches = new Map<string, string[]>();

  for (const tile of tiles) {
    for (const edge of tile.edges) {
      if (!matches.has(edge)) {
        matches.set(edge, []);
      }

      matches.get(edge)!.push(tile.id);
    }
  }

  const unmatchedCount: { [id: string]: number } = {};

  for (const border of matches.keys()) {
    if (matches.get(border)!.length === 1) {
      const id = matches.get(border)![0];
      if (!unmatchedCount[id]) {
        unmatchedCount[id] = 0;
      }
      unmatchedCount[id]++;
    }
  }

  const corners: Tile[] = [];

  Object.keys(unmatchedCount).forEach((k) => {
    if (unmatchedCount[k] === 4) {
      corners.push(tiles.find((t) => t.id === k)!);
    }
  });

  return corners;
}

async function main1() {
  const tiles = await readTiles();
  const corners = getCorners(tiles);
  console.log(product(corners.map((t) => t.id.toInt()))); // 27803643063307
}

// main1();

function variants(tile: RasterImage): RasterImage[] {
  const baseVariants = [tile, tile.rotateLeft, tile.rotateRight, tile.rotateLeft.rotateLeft];
  const allVariants = [];

  for (const base of baseVariants) {
    allVariants.push(base);
    allVariants.push(base.flippedHorizontal);
    allVariants.push(base.flippedVertical);
  }
  return allVariants;
}

function findRightAligned(fixed: RasterImage, options: Tile[]): [Tile, RasterImage] | undefined {
  for (const tile of options) {
    const transformed = variants(tile);
    for (const version of transformed) {
      if (fixed.rightEdge === version.leftEdge) {
        return [tile, version];
      }
    }
  }
}

function findBottomAligned(fixed: RasterImage, options: Tile[]): [Tile, RasterImage] | undefined {
  for (const tile of options) {
    const transformed = variants(tile);
    for (const version of transformed) {
      if (fixed.bottomEdge === version.topEdge) {
        return [tile, version];
      }
    }
  }
}

// We assume only one valid pair exists for each edge
function findValidCornerOrientation(corner: Tile, options: Tile[]): RasterImage | undefined {
  const transformed = variants(corner);
  for (const version of transformed) {
    if (findRightAligned(version, options) != null && findBottomAligned(version, options) != null) {
      return version;
    }
  }
}

function arrange(tiles: Tile[]): RasterImage {
  const corners = getCorners(tiles);
  const chosenCorner = corners[0];
  const otherTiles = tiles.filter((t) => t.id !== chosenCorner.id);
  // Number of tiles on the grid for each dimension. It's equal!
  const size = Math.sqrt(tiles.length);

  // First we need to find a correct rotation for our corner
  const fixedCorner = findValidCornerOrientation(chosenCorner, otherTiles);
  if (fixedCorner == null) {
    throw new Error('There is no valid corner orientation! You messed up!');
  }

  // Prepare our drawing board with empty rows
  const arrangedTiles: RasterImage[][] = [];

  for (let i = 0; i < size; i++) {
    arrangedTiles.push([]);
  }

  let remaining: Tile[] = [...otherTiles];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === 0 && j === 0) {
        arrangedTiles[i][j] = fixedCorner;
        continue;
      }

      // We only have the top one to align to
      if (j === 0) {
        const [tile, variant] = findBottomAligned(arrangedTiles[i - 1][j], remaining)!;
        remaining = remaining.filter((it) => it.id !== tile.id);
        arrangedTiles[i][j] = variant;
      } else {
        const [tile, variant] = findRightAligned(arrangedTiles[i][j - 1], remaining)!;
        remaining = remaining.filter((it) => it.id !== tile.id);
        arrangedTiles[i][j] = variant;
      }
    }
  }

  return combinedAlignedImage(arrangedTiles);
}

const SEA_MONSTER = RasterImage.fromString(`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `);

const TILES_IN_SEA_MONSTER = count(SEA_MONSTER.toString().split(''), (c) => c === '#');

async function main2() {
  const tiles = await readTiles();

  const image = arrange(tiles);
  const imageVariants = variants(image);

  const counter = (cell: string, monsterCell: string) => {
    if (monsterCell === '#') {
      return cell === '#';
    }

    return true;
  }

  for (const variant of imageVariants) {
    const appearances = new ScannableRasterImage(variant).countAppearances(SEA_MONSTER, counter);
    if (appearances > 0) {
      const tilesInAppearances = appearances * TILES_IN_SEA_MONSTER;
      const fullTiles = count(variant.toString().split(''), (c) => c === '#');
      const roughnessCount = fullTiles - tilesInAppearances;
      console.log(variant.toString());
      console.log(roughnessCount);
    }
  }
}

main2();

import { deepStrictEqual as eq } from 'assert';
import { Grid } from './11';

const initial = `#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##`;

const step1 = `#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##`;

const step2 = `#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##`;

const step3 = `#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##`;

const step4 = `#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##`;

describe('Grid from day 11', () => {
  describe('mutation', () => {
    it('should correctly calculate the next grid', () => {
      const grid = Grid.parse(initial);

      eq(grid.toString(), initial, 'Initial state is wrong');

      let mutated = grid.nextState();

      eq(grid.toString(), initial, 'Next state mutates original');
      eq(mutated.toString(), step1, 'Step 1 is wrong');

      mutated = mutated.nextState();
      eq(mutated.toString(), step2, 'Step 2 is wrong');

      mutated = mutated.nextState();
      eq(mutated.toString(), step3, 'Step 3 is wrong');

      mutated = mutated.nextState();
      eq(mutated.toString(), step4, 'Step 4 is wrong');
    });

    it('should correctly calculate the grid in loose mode', () => {
      const grid = Grid.parse(initial);

      let mutated = grid.nextState(false, 5);

      eq(mutated.toString(), `#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#`, 'Step 1 is wrong');

      mutated = mutated.nextState(false, 5);

      eq(mutated.toString(), `#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#`, 'Step 2 is wrong');

      mutated = mutated.nextState(false, 5);

      eq(mutated.toString(), `#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##LL.LL.L#
L.LL.LL.L#
#.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLL#.L
#.L#LL#.L#`, 'Step 3 is wrong');

      mutated = mutated.nextState(false, 5);

      eq(mutated.toString(), `#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.#L.L#
#.L####.LL
..#.#.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#`, 'Step 4 is wrong');
    });
  });
})